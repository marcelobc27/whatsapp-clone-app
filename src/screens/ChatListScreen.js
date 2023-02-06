import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Button, FlatList } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/CustomHeaderButton/CustomHeaderButton";
import { useSelector } from "react-redux";
import DataItem from "../components/DataItem/DataItem";
import PageContainer from "../components/PageContainer/PageContainer";
import PageTitle from "../components/PageTitle/PageTitle";

const ChatListScreen = (props) => {
  const navigation = useNavigation();
  const userData = useSelector((state) => state.auth.userData);
  const selectedUser = props.route?.params?.selectedUserId;
  const userChats = useSelector((state) => {
    const chatsData = state.chats.chatsData;
    return Object.values(chatsData).sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
  });
  const storedUsers = useSelector((state) => state.users.storedUsers);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item
              title="New Chat"
              iconName="create-outline"
              onPress={() => navigation.navigate("NewChat")}
            />
          </HeaderButtons>
        );
      },
    });
  }, []);

  useEffect(() => {
    if (!selectedUser) {
      return;
    }

    const chatUsers = [selectedUser, userData.userId];

    const navigationProps = {
      newChatData: { users: chatUsers },
    };

    navigation.navigate("ChatScreen", navigationProps);
  }, [props.route?.params]);


  return (
    <PageContainer>
      <PageTitle text="Chats" />
      <FlatList
        data={userChats}
        renderItem={(itemData) => {
          const chatData = itemData.item;
          const chatId = chatData.key;

          const otherUserId = chatData.users.find(
            (uid) => uid !== userData.userId
          );
          const otherUser = storedUsers[otherUserId];

          if (!otherUser) return;

          const title = `${otherUser.firstName} ${otherUser.lastName}`;
          const subtitle = chatData.latestMessageText || "New Chat";
          const image = otherUser.profilePicture;

          return (
            <DataItem
              title={title}
              subTitle={subtitle}
              image={image}
              onPress={() => navigation.navigate("ChatScreen", { chatId })}
            />
          );
        }}
      />
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ChatListScreen;
