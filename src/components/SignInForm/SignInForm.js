import react, { useCallback, useEffect, useReducer, useState } from "react";
import { Feather } from "@expo/vector-icons";
import Input from "../../components/Input/Input";
import SubmitButton from "../../components/SubmitButton/SubmitButton";
import { validateInput } from "../../utils/Actions/formActions";
import { reducer } from "../../utils/Reducers/formReducer";
import { signIn, signUp } from "../../utils/Actions/authActions";
import { ActivityIndicator, Alert, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import colors from "../../../constants/colors";
import { LOGIN_CREDENTIAL } from "../../../credentials/loginTestCredentials";

const isTestMode = true

const initialState = {
  inputValues: {
    email: isTestMode ? LOGIN_CREDENTIAL.email : "",
    password: isTestMode ? LOGIN_CREDENTIAL.password : "",
  },
  inputValidities: {
    email: isTestMode ? true : false,
    password: isTestMode ? true : false,
  },
  formIsValid: isTestMode ? true : false,
};

const SignInForm = () => {
  const dispatch = useDispatch();

  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({
        inputId: inputId,
        validationResult: result,
        inputValues: inputValue,
      });
    },
    [dispatchFormState]
  );

  useEffect(() => {
    if (error) {
      Alert.alert("An error occured", error);
    }
  }, [error]);

  const authHandler = useCallback(async () => {
    try {
      setIsLoading(true);
      const action = signIn(
        formState.inputValues.email,
        formState.inputValues.password
      );
      setError(null);
      await dispatch(action);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  }, [dispatch, formState]);

  return (
    <>
      <Input
        id="email"
        label="Email"
        icon="mail"
        iconPack={Feather}
        iconSize={24}
        autoCapitalize="none"
        keyboardType="email-address"
        initialValue={formState.inputValues.email}
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities["email"]}
      />
      <Input
        id="password"
        label="Password"
        icon="lock"
        iconPack={Feather}
        iconSize={24}
        autoCapitalize="none"
        secureTextEntry
        initialValue={formState.inputValues.password}
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities["password"]}
      />
      {isLoading ? (
        <ActivityIndicator
          size={"small"}
          color={colors.primary}
          style={styles.activityIndicator}
        />
      ) : (
        <SubmitButton
          title="Sign In"
          onPress={() => authHandler()}
          style={styles.submitButton}
          disabled={!formState.formIsValid}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  activityIndicator: {
    alignSelf: 'center',
    margin: 10
  },
  submitButton: {
    marginTop: 20
  }
})

export default SignInForm;
