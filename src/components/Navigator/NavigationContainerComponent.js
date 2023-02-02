import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./StackNavigator";
import AuthScreen from "../../screens/Authentication/AuthScreen";
import StartUpScreen from '../../screens/StartUpScreen'

import { useSelector } from "react-redux";

const NavigationContainerComponent = () => {
  const isAuth = useSelector(state => state.auth.token !== null && state.auth.token !== "")
  const didTryAutoLogin = useSelector(state => state.auth.didTryAutoLogin)

  return (
    <NavigationContainer>
      {isAuth && <StackNavigator />}
      {!isAuth && didTryAutoLogin && <AuthScreen/>}
      {!isAuth && !didTryAutoLogin && <StartUpScreen/>}
    </NavigationContainer>
  );
};

export default NavigationContainerComponent;
