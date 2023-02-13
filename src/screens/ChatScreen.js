import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  Button,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import AwesomeAlert from "react-native-awesome-alerts";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { createChat, sendImageMessage, sendTextMessage } from "../utils/Actions/chatActions";
import { launchImagePicker, openCamera, uploadImageAsync } from "../utils/ImagePickerHelper";
import PageContainer from "../components/PageContainer/PageContainer";
import Bubble from "../components/Bubble/Bubble";
import ReplyTo from "../components/ReplyTo/ReplyTo";
import CustomHeaderButton from "../components/CustomHeaderButton/CustomHeaderButton";
import colors from "../../constants/colors";
import backgroundImage from "../../assets/images/droplet.jpeg";

const ChatScreen = (props) => {
  const [chatUsers, setChatUsers] = useState([]);
  const [chatId, setChatId] = useState(props.route?.params?.chatId);
  const [messageText, setMessageText] = useState("");
  const [errorBannerText, setErrorBannerText] = useState("");
  const [replyingTo, setReplyingTo] = useState("");
  const [tempImageUri, setTempImageUri] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const flatList = useRef();
  const userData = useSelector((state) => state.auth.userData);
  const storedUsers = useSelector((state) => state.users.storedUsers);
  const storedChats = useSelector((state) => state.chats.chatsData);
  const chatMessages = useSelector((state) => {
    if (!chatId) return [];
    const chatMessagesData = state.messages.messagesData[chatId];

    if (!chatMessagesData) return [];

    const messageList = [];
    for (const key in chatMessagesData) {
      const message = chatMessagesData[key];
      messageList.push({
        key,
        ...message,
      });
    }

    return messageList;
  });

  const chatData =
    (chatId && storedChats[chatId]) || props.route?.params?.newChatData || {};
  const navigation = useNavigation();

  const getChatTitleFromName = () => {
    const otherUserId = chatUsers.find((uid) => uid !== userData.userId);
    const otherUserData = storedUsers[otherUserId];

    return (
      otherUserData && `${otherUserData.firstName} ${otherUserData.lastName}`
    );
  };

  useEffect(() => {
    if(!chatData) return
    navigation.setOptions({
      headerTitle: chatData.chatName ?? getChatTitleFromName(),
      headerRight: () => {
        return(
          <HeaderButtons headerButtonComponent={CustomHeaderButton}>
            {
              chatId && 
              <Item
                title="Chat Settings"
                iconName="settings-outline"
                color={colors.blue}
                onPress={() => {
                  chatData.isGroupChat
                  ? navigation.navigate("ChatSettings", { chatId })
                  : navigation.navigate("ContactScreen", {
                    uid: chatUsers.find((uid) => uid !== userData.userId) 
                  })
                }}
              />
            }
          </HeaderButtons>
        )
      }
    });

    setChatUsers(chatData.users);
  }, [chatUsers]);

  const sendMessage = useCallback(async () => {
    try {
      let id = chatId;

      if (!id) {
        id = await createChat(userData.userId, props.route.params.newChatData);
        setChatId(id);
      }

      await sendTextMessage(
        id,
        userData.userId,
        messageText,
        replyingTo && replyingTo.key
      );
      setMessageText("");
      setReplyingTo(null);
    } catch (error) {
      console.log(error);
      setErrorBannerText("Message failed to send");
      setTimeout(() => {
        setErrorBannerText("");
      }, 5000);
    }
  }, [messageText, chatId]);

  const pickImage = useCallback(async () => {
    try {
      const tempUri = await launchImagePicker();
      if(!tempUri) return;

      setTempImageUri(tempUri)
    } catch (error) {
      console.log(error)
    }
  }, [tempImageUri])

  const takePhoto = useCallback(async () => {
    try {
      const tempUri = await openCamera();
      if(!tempUri) return;

      setTempImageUri(tempUri)
    } catch (error) {
      console.log(error)
    }
  }, [tempImageUri])

  const uploadImage = useCallback(async () => {
    setIsLoading(true)

    try {
      let id = chatId;

      if (!id) {
        id = await createChat(userData.userId, props.route.params.newChatData);
        setChatId(id);
      }

      const uploadUrl = await uploadImageAsync(tempImageUri, true)
      setIsLoading(false)

      await sendImageMessage(id, userData.userId, uploadUrl, replyingTo && replyingTo.key)
      setReplyingTo(null)
      setTimeout(() => setTempImageUri(""), 500) 
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }, [isLoading, tempImageUri, chatId])

  return (
    <SafeAreaView edges={["right", "left", "bottom"]} style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={100}
      >
        <ImageBackground
          source={backgroundImage}
          style={styles.backgroundImage}
        >
          <PageContainer style={{ backgroundColor: "transparent" }}>
            {!chatId && (
              <Bubble text="This is a new chat, Say hi!" type="system" />
            )}

            {errorBannerText !== "" && (
              <Bubble text={errorBannerText} type="error" />
            )}

            {chatId && (
              <FlatList
                ref={(ref) => flatList.current = ref}
                onContentSizeChange={() => flatList.current.scrollToEnd({ animated: false})}
                onLayout={() => flatList.current.scrollToEnd({animated: false})}
                data={chatMessages}
                renderItem={(itemData) => {
                  const message = itemData.item;

                  const isOwnMessage = message.sentBy === userData.userId;

                  let messageType;
                  if(message.type && message.type === "info"){
                    messageType = "info"
                  } else if (isOwnMessage) {
                    messageType = "myMessage"
                  } else {
                    messageType = "theirMessage"
                  }

                  const sender = message.sentBy && storedUsers[message.sentBy]
                  const name = sender && `${sender.firstName} ${sender.lastName}`

                  return (
                    <Bubble
                      type={messageType}
                      text={message.text}
                      messageId={message.key}
                      userId={userData.userId}
                      chatId={chatId}
                      date={message.sentAt}
                      name={!chatData.isGroupChat || isOwnMessage ? undefined : name}
                      setReply={() => setReplyingTo(message)}
                      replyingTo={
                        message.replyTo &&
                        chatMessages.find((i) => i.key === message.replyTo)
                      }
                      imageUrl={message.imageUrl}
                    />
                  );
                }}
              />
            )}
          </PageContainer>
          {replyingTo && (
            <ReplyTo
              text={replyingTo.text}
              user={storedUsers[replyingTo.sentBy]}
              onCancel={() => setReplyingTo(null)}
            />
          )}
        </ImageBackground>
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.mediaButton} onPress={pickImage}>
            <Feather name="plus" size={24} color={colors.blue} />
          </TouchableOpacity>
          <TextInput
            style={styles.textBox}
            value={messageText}
            onChangeText={(text) => setMessageText(text)}
            onSubmitEditing={sendMessage}
          />
          {messageText === "" ? (
            <TouchableOpacity style={styles.cameraButton} onPress={takePhoto}>
              <Feather name="camera" size={24} color={colors.blue} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{ ...styles.cameraButton, ...styles.sendButton }}
              onPress={sendMessage}
            >
              <Feather name="send" size={20} color={colors.white} />
            </TouchableOpacity>
          )}
          <AwesomeAlert
            show={tempImageUri !== ""}
            title="Send Image?"
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            showConfirmButton={true}
            cancelText="Cancel"
            confirmText="send Image"
            confirmButtonColor={colors.primary}
            cancelButtonColor={colors.red}
            titleStyle={styles.popTitleStyle}
            onCancelPressed={() => setTempImageUri("")}
            onConfirmPressed={uploadImage}
            onDismiss={() => setTempImageUri("")}
            customView={(
              <View>
                {
                  isLoading && 
                  <ActivityIndicator size={'small'} color={colors.primary}/>
                }
                {
                  !isLoading && tempImageUri !== "" &&
                  <Image source={{ uri: tempImageUri}} style={styles.awesomeAlertImage}/>
                }
              </View>
            )}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  keyboardAvoidingView: {
    flex: 1,
    width: "100%",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.blue,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    height: 70,
    width: "100%",
  },
  textBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: colors.lightGrey,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 15,
    paddingHorizontal: 12,
  },
  mediaButton: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "15%",
  },
  cameraButton: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "15%",
  },
  sendButton: {
    backgroundColor: colors.blue,
    borderRadius: 50,
    padding: 8,
    height: "100%",
    width: "15%",
  },
  popTitleStyle: {
    fontFamily: 'medium',
    letterSpacing: 0.3,
    color: colors.textColor
  },
  awesomeAlertImage: {
    width: 200,
    height: 200
  }
});

export default ChatScreen;
