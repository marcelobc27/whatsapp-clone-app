import React from "react";

import ChatSettingsScreen from "../../screens/ChatSettingsScreen";
import TabNavigator from "./TabNavigator";
import ChatScreen from "../../screens/ChatScreen";
import NewChatScreen from "../../screens/NewChatScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator()

const StackNavigator = () => {
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
      <Stack.Group screenOptions={{presentation: 'modal'}}>
      <Stack.Screen
        name="NewChat"
        component={NewChatScreen}
      />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default StackNavigator
