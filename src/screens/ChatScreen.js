import React, { useCallback, useState } from "react";
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

const ChatScreen = (props) => {
  const [messageText, setMessageText] = useState("")

  const sendMessage = useCallback(() => {
    setMessageText("");
  }, [messageText])

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
      ></ImageBackground>
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
    flex: 1
  },
  backgroundImage: {
    flex: 1,
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
