import React from "react";
import { createStackNavigator } from '@react-navigation/stack';

import ChatSettingsScreen from "../../screens/ChatSettingsScreen";
import TabNavigator from "./TabNavigator";

const Stack = createStackNavigator()

const StackNavigator = () => {
  return (
    <Stack.Navigator>
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
    </Stack.Navigator>
  );
};

export default StackNavigator
