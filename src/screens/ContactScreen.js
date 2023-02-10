import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import colors from "../../constants/colors";
import DataItem from "../components/DataItem/DataItem";
import PageContainer from "../components/PageContainer/PageContainer";
import PageTitle from "../components/PageTitle/PageTitle";
import ProfileImage from "../components/ProfileImage/ProfileImage";
import { getUserChats } from "../utils/Actions/userActions";

const ContactScreen = (props) => {
  const navigation = useNavigation()
  const storedUsers = useSelector((state) => state.users.storedUsers);
  const currentUser = storedUsers[props.route.params.uid];

  const storedChats = useSelector((state) => state.chats.chatsData);
  const [commonChats, setCommonChats] = useState([]);

  useEffect(() => {
    const getCommonUserChats = async () => {
      const currentUserChats = await getUserChats(currentUser.userId);
      setCommonChats(
        Object.values(currentUserChats).filter(
          (cid) => storedChats[cid] && storedChats[cid].isGroupChat
        )
      );
    };

    getCommonUserChats();
  }, []);

  return (
    <PageContainer>
      <View style={styles.topContainer}>
        <ProfileImage
          uri={currentUser.profilePicture}
          size={80}
          style={{ marginBottom: 20 }}
        />
        <PageTitle text={`${currentUser.firstName} ${currentUser.lastName}`} />
        {currentUser.about && (
          <Text style={styles.about} numberOfLines={2}>
            {currentUser.about}
          </Text>
        )}
      </View>
      {commonChats.length > 0 && (
        <>
          <Text style={styles.heading}>
            {commonChats.length} {commonChats.length === 1 ? "Group" : "Groups"}{" "}
            Group in common
          </Text>
          {
            commonChats.map(cid => {
              const chatData = storedChats[cid]
              return(
                <DataItem
                  key={cid}
                  title={chatData.chatName}
                  subtitle={chatData.latestMessageData}
                  type="link"
                  onPress={() => navigation.push("ChatScreen", { chatId: cid })}
                  image={chatData.chatImage}
                />
              )
            })
          }
        </>
      )}
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  about: {
    fontFamily: "medium",
    fontSize: 16,
    letterSpacing: 0.3,
    color: colors.grey,
  },
  heading: {
    fontFamily: "bold",
    letterSpacing: 0.3,
    color: colors.textColor,
    marginVertical: 8
  },
});

export default ContactScreen;
