import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
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
import ProfileImage from "../components/ProfileImage/ProfileImage";

const NewChatScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState();
  const [noResultFound, setNoResultFound] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [chatName, setChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const userData = useSelector((state) => state.auth.userData);
  const storedUsers = useSelector((state) => state.users.storedUsers);

  const selectedUsersFlatList = useRef();

  const chatId = props.route.params && props.route.params.chatId;
  const existingUsers = props.route.params && props.route.params.existingUsers;
  const isGroupChat = props.route.params && props.route.params.isGroupChat;
  const isGroupChatDisabled = selectedUsers.length === 0 || (isNewChat && chatName === "");

  const isNewChat = !chatId;

  const dispatch = useDispatch();
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
      headerRight: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            {isGroupChat && (
              <Item
                title={isNewChat ? "Create" : "Add"}
                disabled={isGroupChatDisabled}
                color={isGroupChatDisabled ? colors.lightGrey : colors.blue}
                onPress={() => {
                  const screenName = isNewChat
                    ? "ChatListScreen"
                    : "ChatSettings";
                  navigation.navigate(screenName, {
                    selectedUsers: selectedUsers,
                    chatName,
                    chatId
                  });
                }}
              />
            )}
          </HeaderButtons>
        );
      },
      headerTitle: isGroupChat ? "Add participants" : "New chat",
    });
  }, [chatName, selectedUsers]);

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (!searchTerm || searchTerm === "") {
        setUsers();
        setNoResultFound(false);
        return;
      }

      setIsLoading(true);

      const usersResult = await searchUsers(searchTerm);
      delete usersResult[userData.userId];
      setUsers(usersResult);

      if (Object.keys(usersResult).length === 0) {
        setNoResultFound(true);
      } else {
        setNoResultFound(false);

        dispatch(setStoredUsers({ newUsers: usersResult }));
      }

      setIsLoading(false);
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  const userPressed = (userId) => {
    if (isGroupChat) {
      const newSelectedUsers = selectedUsers.includes(userId)
        ? selectedUsers.filter((id) => id !== userId)
        : selectedUsers.concat(userId);

      setSelectedUsers(newSelectedUsers);
    } else {
      navigation.navigate("ChatList", { selectedUserId: userId });
    }
  };

  return (
    <PageContainer>
      {isNewChat && isGroupChat && (
        <View style={styles.chatNameContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textbox}
              placeholder="Enter a name for your chat"
              autoCorrect={false}
              autoComplete={false}
              onChangeText={(text) => setChatName(text)}
            />
          </View>
        </View>
      )}
      {isGroupChat && (
        <View style={styles.selectedUsersContainer}>
          <FlatList
            style={styles.selectedUsersList}
            data={selectedUsers}
            horizontal={true}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.selectedUsersWrapper}
            ref={(ref) => (selectedUsersFlatList.current = ref)}
            onContentSizeChange={() =>
              selectedUsersFlatList.current.scrollToEnd()
            }
            renderItem={(itemData) => {
              const userId = itemData.item;
              const userData = storedUsers[userId];
              return (
                <ProfileImage
                  style={styles.selectedUserStyle}
                  size={40}
                  uri={userData.profilePicture}
                  onPress={() => userPressed(userId)}
                  showRemoveButton={true}
                />
              );
            }}
          />
        </View>
      )}
      <View style={styles.searchContainer}>
        <Feather name="search" size={24} color="black" />
        <TextInput
          placeholder="Search"
          style={styles.searchBox}
          onChangeText={(text) => setSearchTerm(text)}
        />
      </View>

      {isLoading && (
        <View style={commonStyles.center}>
          <ActivityIndicator size={"large"} color={colors.primary} />
        </View>
      )}

      {!isLoading && !noResultFound && users && (
        <FlatList
          data={Object.keys(users)}
          renderItem={(itemData) => {
            const userId = itemData.item;
            const userData = users[userId];

            if (existingUsers && existingUsers.includes(userId)) {
              return;
            }

            return (
              <DataItem
                title={`${userData.firstName} ${userData.lastName}`}
                subTitle={userData.about}
                image={userData.profilePicture}
                onPress={() => userPressed(userId)}
                type={isGroupChat ? "checkbox" : ""}
                isChecked={selectedUsers.includes(userId)}
              />
            );
          }}
        />
      )}

      {!isLoading && noResultFound && (
        <View style={commonStyles.center}>
          <FontAwesome
            name="question"
            size={55}
            color={colors.lightGrey}
            style={styles.noResultIcon}
          />
          <Text style={styles.noResultsText}>No users found!</Text>
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
  chatNameContainer: {
    paddingVertical: 10,
  },
  inputContainer: {
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: colors.nearlyWhite,
    flexDirection: "row",
    borderRadius: 2,
  },
  textbox: {
    color: colors.textColor,
    width: "100%",
    fontFamily: "regular",
    letterSpacing: 0.3,
  },
  selectedUsersContainer: {
    height: 50,
    justifyContent: "center",
  },
  selectedUsersList: {
    height: "100%",
    paddingTop: 10,
  },
  selectedUserStyle: {
    marginRight: 10,
    marginBottom: 10,
  },
  selectedUsersWrapper: {
    alignItems: "center",
  },
});

export default NewChatScreen;
