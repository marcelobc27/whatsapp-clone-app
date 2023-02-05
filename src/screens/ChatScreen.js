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

const ChatScreen = (props) => {
  const userData = useSelector((state) => state.auth.userData);
  const storedUsers = useSelector(state => state.users.storedUsers)
  const storedChats = useSelector(state => state.chats.chatsData)
  const chatMessages = useSelector(state => state.messages.messagesData)
  const [chatUsers, setChatUsers] = useState([])
  const [chatId, setChatId] = useState(props.route?.params?.chatId)
  const [messageText, setMessageText] = useState("")
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

      await sendTextMessage(chatId, userData.userId, messageText)
    } catch (error) {
      console.log(error)
    }
    setMessageText("");
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
        </PageContainer>
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
