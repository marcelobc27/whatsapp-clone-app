import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  Platform,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/CustomHeaderButton/CustomHeaderButton";
import PageContainer from "../components/PageContainer/PageContainer";
import colors from "../../constants/colors";
import commonStyles from "../../constants/commonStyles";
import { searchUsers } from "../utils/Actions/userActions";
import DataItem from "../components/DataItem/DataItem";
import { useDispatch, useSelector } from "react-redux";
import { setStoredUsers } from "../store/userSlice";

const NewChatScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState();
  const [noResultFound, setNoResultFound] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const userData = useSelector((state) => state.auth.userData);

  const dispatch = useDispatch()
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item title="Close" onPress={() => navigation.goBack()} />
          </HeaderButtons>
        );
      },
      headerTitle: "New chat",
    });
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if(!searchTerm || searchTerm === ""){
        setUsers();
        setNoResultFound(false);
        return;
      }

      setIsLoading(true)

      const usersResult = await searchUsers(searchTerm)
      delete usersResult[userData.userId]
      setUsers(usersResult)

      if(Object.keys(usersResult).length === 0){
        setNoResultFound(true)
      } else {
        setNoResultFound(false)

        dispatch(setStoredUsers({newUsers: usersResult}))
      }

      setIsLoading(false)
    }, 500)

    return () => clearTimeout(delaySearch)
  }, [searchTerm])

  const userPressed = (userId) => {
    navigation.navigate("ChatList", {selectedUserId: userId})
  }

  return (
    <PageContainer>
      <View style={styles.searchContainer}>
        <Feather name="search" size={24} color="black" />
        <TextInput
          placeholder="Search"
          style={styles.searchBox}
          onChangeText={(text) => setSearchTerm(text)}
        />
      </View>

      {
        isLoading && 
        <View style={commonStyles.center}>
          <ActivityIndicator size={'large'} color={colors.primary}/>
        </View>
      }

      {
        !isLoading && !noResultFound && users && 
        <FlatList
          data={Object.keys(users)}
          renderItem={(itemData) => {
            const userId = itemData.item
            const userData = users[userId] 

            return <DataItem 
              title={`${userData.firstName} ${userData.lastName}`}
              subTitle={userData.about}
              image={userData.profilePicture}
              onPress={() => userPressed(userId)}
            />
          }}
        />
      }

      {!isLoading && noResultFound && (
        <View style={commonStyles.center}>
          <FontAwesome
            name="question"
            size={55}
            color={colors.lightGrey}
            style={styles.noResultIcon}
          />
          <Text style={styles.noResultsText}>
            No users found!
          </Text>
        </View>
      )}
      {!isLoading && !users && (
        <View style={commonStyles.center}>
          <Feather
            name="users"
            size={55}
            color={colors.lightGrey}
            style={styles.noResultIcon}
          />
          <Text style={styles.noResultsText}>
            Enter a name to search for a user!
          </Text>
        </View>
      )}
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.extraLightGrey,
    height: 30,
    marginVertical: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5,
  },
  searchBox: {
    marginLeft: 8,
    fontSize: 15,
    width: "100%",
  },
  noResultIcon: {
    marginBottom: 20,
  },
  noResultsText: {
    color: colors.textColor,
    fontFamily: "regular",
    fontSize: Platform.OS === "web" ? 24 : 14,
    letterSpacing: 0.3,
  },
});

export default NewChatScreen;
