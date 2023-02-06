import React, { useCallback, useEffect, useState } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Feather } from '@expo/vector-icons';

import backgroundImage from "../../assets/images/droplet.jpeg";
import colors from "../../constants/colors";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import PageContainer from "../components/PageContainer/PageContainer";
import Bubble from "../components/Bubble/Bubble";
import { createChat, sendTextMessage } from "../utils/Actions/chatActions";
import ReplyTo from "../components/ReplyTo/ReplyTo";

const ChatScreen = (props) => {
  const [chatUsers, setChatUsers] = useState([])
  const [chatId, setChatId] = useState(props.route?.params?.chatId)
  const [messageText, setMessageText] = useState("")
  const [errorBannerText, setErrorBannerText] = useState("")
  const [replyingTo, setReplyingTo] = useState("")

  const userData = useSelector((state) => state.auth.userData);
  const storedUsers = useSelector(state => state.users.storedUsers)
  const storedChats = useSelector(state => state.chats.chatsData)
  const chatMessages = useSelector(state => {
    if(!chatId) return []
    const chatMessagesData = state.messages.messagesData[chatId]

    if(!chatMessagesData) return []

    const messageList = []
    for(const key in chatMessagesData){
      const message = chatMessagesData[key]
      messageList.push({
        key,
        ...message
      })
    }

    return messageList
  })

  const chatData = (chatId && storedChats[chatId]) || props.route?.params?.newChatData;
  const navigation = useNavigation()

  const getChatTitleFromName = () => {
    const otherUserId = chatUsers.find(uid => uid !== userData)
    const otherUserData = storedUsers[otherUserId]

    return otherUserData && `${otherUserData.firstName} ${otherUserData.lastName}`
  }

  useEffect(() => {
    navigation.setOptions({
      headerTitle: getChatTitleFromName() 
    })

    setChatUsers(chatData.users)
  }, [chatUsers])

  const sendMessage = useCallback(async() => {
    try {
      let id = chatId
      
      if(!id){
        id = await createChat(userData.userId, props.route.params.newChatData)
        setChatId(id)
      }

      await sendTextMessage(chatId, userData.userId, messageText, replyingTo && replyingTo.key)
      setMessageText("");
      setReplyingTo(null)
    } catch (error) {
      console.log(error)
      setErrorBannerText("Message failed to send")
      setTimeout(() => {
        setErrorBannerText("")
      }, 5000)
    }
  }, [messageText, chatId])

  return (
    <SafeAreaView
      edges={['right', 'left', 'bottom']}
      style={styles.container}>
      <KeyboardAvoidingView 
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={100}
      >
      <ImageBackground
        source={backgroundImage}
        style={styles.backgroundImage}
      >
        <PageContainer style={{backgroundColor: 'transparent'}}>
          {
            !chatId && <Bubble text="This is a new chat, Say hi!" type="system"/>
          }

          {
            errorBannerText !== "" && <Bubble text={errorBannerText} type="error"/>
          }

          {
            chatId && 
            <FlatList
              data={chatMessages}
              renderItem={(itemData) => {
                const message = itemData.item

                const isOwnMessage = message.sentBy === userData.userId;

                const messageType = isOwnMessage ? "myMessage" : "theirMessage"
                return (
                  <Bubble
                    type={messageType}
                    text={message.text}
                    messageId={message.key}
                    userId={userData.userId}
                    chatId={chatId}
                    date={message.sentAt}
                    setReply={() => setReplyingTo(message)}
                    replyingTo={message.replyTo && chatMessages.find(i => i.key === message.replyTo)}
                  />
                )
              }}
            />
          }
        </PageContainer>
        {
          replyingTo && (
            <ReplyTo 
              text={replyingTo.text}
              user={storedUsers[replyingTo.sentBy]}
              onCancel={() => setReplyingTo(null)}
            />
          )
        }
      </ImageBackground>
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.mediaButton}
          onPress={() => {}}>
          <Feather name="plus" size={24} color={colors.blue} />
        </TouchableOpacity>
        <TextInput 
          style={styles.textBox}
          value={messageText}
          onChangeText={text => setMessageText(text)}
          onSubmitEditing={sendMessage}
        />
        {
          messageText === "" 
          ?
          <TouchableOpacity 
            style={styles.cameraButton}
            onPress={() => {}}>
            <Feather name="camera" size={24} color={colors.blue} />
          </TouchableOpacity>
          :
          <TouchableOpacity 
            style={{...styles.cameraButton, ...styles.sendButton}}
            onPress={sendMessage}>
            <Feather name="send" size={20} color={colors.white} />
          </TouchableOpacity>
        }
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
    width: "100%"
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.blue
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    height: 70,
    width: '100%'
  },
  textBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
    paddingHorizontal: 12
  },
  mediaButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '15%'
  },
  cameraButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '15%'
  },
  sendButton: {
    backgroundColor: colors.blue,
    borderRadius: 50,
    padding: 8,
    height: '100%',
    width: '15%'
  }
});

export default ChatScreen;
