import React, { useEffect, useState } from "react";

import ChatSettingsScreen from "../../screens/ChatSettingsScreen";
import TabNavigator from "./TabNavigator";
import ChatScreen from "../../screens/ChatScreen";
import NewChatScreen from "../../screens/NewChatScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { getFirebaseApp } from "../../../firebaseConfig";
import { child, get, getDatabase, off, onValue, ref } from "firebase/database";
import { setChatsData } from "../../store/chatSlice";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import colors from "../../../constants/colors";
import commonStyles from "../../../constants/commonStyles";
import { setStoredUsers } from "../../store/userSlice";
import { setChatMessages } from "../../store/messagesSlice";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const dispatch = useDispatch()
  const userData = useSelector((state) => state.auth.userData);
  const storedUsers = useSelector((state) => state.users.storedUsers);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log("Subscribing to firebase listeners");

    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const userChatsRef = child(dbRef, `userChats/${userData.userId}`);
    const refs = [userChatsRef];

    onValue(userChatsRef, (querySnapshot) => {
      const chatIdsData = querySnapshot.val() || {};
      const chatsIds = Object.values(chatIdsData);

      const chatsData = {}
      let chatsFoundCount = 0

      for (let i = 0; i < chatsIds.length; i++) {
        const chatId = chatsIds[i];
        const chatRef = child(dbRef, `chats/${chatId}`);
        refs.push(chatRef)

        onValue(chatRef, (chatSnapshot) => {
          chatsFoundCount++;
          const data = chatSnapshot.val()

          if(data){
            data.key = chatSnapshot.key
            data.users.forEach(userId => {
              if(storedUsers[userId]) return;

              const userRef = child(dbRef, `users/${userId}`)

              get(userRef)
              .then(userSnapshot => {
                const userSnapshotData = userSnapshot.val()
                dispatch(setStoredUsers({newUsers: {userSnapshotData}}))
              })

              refs.push(userRef)
            })
            chatsData[chatSnapshot.key] = data
          }

          if(chatsFoundCount >= chatsIds.length){
            dispatch(setChatsData({chatsData: chatsData}))
            setIsLoading(false)
          }
        })

        const messagesRef = child(dbRef, `messages/${chatId}`);
        refs.push(messagesRef)

        onValue(messagesRef, messagesSnapshot => {
          const messagesData = messagesSnapshot.val()
          dispatch(setChatMessages({chatId, messagesData}))
        })

        if(chatsFoundCount == 0){
          setIsLoading(false)
        }
      }
    });

    if(isLoading){
      <View style={commonStyles.center}>
        <ActivityIndicator size={"large"} color={colors.primary}/>
      </View>
    }

    return () => {
      console.log("Unsubscribing firebase listeners")
      refs.forEach((ref) => off(userChatsRef));
    };
  }, []);

  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen
          name="Home"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChatSettings"
          component={ChatSettingsScreen}
          options={{
            headerTitle: "Settings",
          }}
        />
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{
            headerTitle: "",
          }}
        />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="NewChat" component={NewChatScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default StackNavigator;
