import React, { useEffect, useRef, useState } from "react";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import ChatSettingsScreen from "../../screens/ChatSettingsScreen";
import TabNavigator from "./TabNavigator";
import ChatScreen from "../../screens/ChatScreen";
import NewChatScreen from "../../screens/NewChatScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { getFirebaseApp } from "../../../firebaseConfig";
import { child, get, getDatabase, off, onValue, query, ref } from "firebase/database";
import { setChatsData } from "../../store/chatSlice";
import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";
import colors from "../../../constants/colors";
import commonStyles from "../../../constants/commonStyles";
import { setStoredUsers } from "../../store/userSlice";
import { setChatMessages, setStarredMessages } from "../../store/messagesSlice";
import ContactScreen from "../../screens/ContactScreen";
import DataListScreen from "../../screens/DataListScreen";
import { StackActions, useNavigation } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const userData = useSelector((state) => state.auth.userData);
  const storedUsers = useSelector((state) => state.users.storedUsers);
  const [isLoading, setIsLoading] = useState(true)

  const [expoPushToken, setExpoPushToken] = useState('');
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      //handleReceiveNotification
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const { data } = response.notification.request.content;
      const chatId = data("chatId");

      if (chatId) {
        const pushAction = StackActions.push("ChatScreen", {chatId})
        navigation.dispatch(pushAction)
      } else {
        console.log("No chat id sent")
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

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
            if(!data.users.includes(userData.userId)){
              return;
            }
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

    const userStarredMessagesRef = child(dbRef, `userStarredMessages/${userData.userId}`)
    refs.push(userStarredMessagesRef)
    onValue(userStarredMessagesRef, querySnapshot => {
      const starredMessages = querySnapshot.val() ?? {}
      dispatch(setStarredMessages({ starredMessages }))
    })

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
          options={{ 
            headerShown: false,
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="ChatSettings"
          component={ChatSettingsScreen}
          options={{
            headerTitle: "",
            headerShadowVisible: false
          }}
        />
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{
            headerTitle: "",
            headerShadowVisible: false
          }}
        />        
        <Stack.Screen
          name="ContactScreen"
          component={ContactScreen}
          options={{
            headerTitle: "Contact Info",
            headerShadowVisible: false
          }}
        />
        <Stack.Screen
          name="DataListScreen"
          component={DataListScreen}
          options={{
            headerTitle: "",
            headerShadowVisible: false
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

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}
