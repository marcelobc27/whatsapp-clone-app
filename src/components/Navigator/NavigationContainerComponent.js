import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./StackNavigator";
import AuthScreen from "../../screens/Authentication/AuthScreen";

const NavigationContainerComponent = () => {
  const isAuth = false

  return (
    <NavigationContainer>
      {
        isAuth ? <StackNavigator /> : <AuthScreen/>
      }
    </NavigationContainer>
  );
};

export default NavigationContainerComponent;
