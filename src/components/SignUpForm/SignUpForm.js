import react, { useCallback, useEffect, useReducer, useState } from "react";
import {
  ActivityIndicator,
  ActivityIndicatorBase,
  Alert,
  StyleSheet,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Input from "../../components/Input/Input";
import SubmitButton from "../../components/SubmitButton/SubmitButton";
import { validateInput } from "../../utils/Actions/formActions";
import { reducer } from "../../utils/Reducers/formReducer";
import { signUp } from "../../utils/Actions/authActions";
import colors from "../../../constants/colors";
import { useDispatch } from "react-redux";

const initialState = {
  inputValues: {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  },
  inputValidities: {
    firstName: false,
    lastName: false,
    email: false,
    password: false,
  },
  formIsValid: false,
};

const SignUpForm = () => {
  const dispatch = useDispatch()

  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({
        inputId,
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
      const action = signUp(
        formState.inputValues.firstName,
        formState.inputValues.lastName,
        formState.inputValues.email,
        formState.inputValues.password
      )
      setError(null);
      await dispatch(action)
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
      console.log(error)
    }
  }, [dispatch, formState])

  return (
    <>
      <Input
        id="firstName"
        label="First Name"
        icon="user"
        autoCapitalize="none"
        iconPack={Feather}
        iconSize={24}
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities["firstName"]}
      />
      <Input
        id="lastName"
        label="Last Name"
        icon="user"
        autoCapitalize="none"
        iconPack={Feather}
        iconSize={24}
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities["lastName"]}
      />
      <Input
        id="email"
        label="Email"
        icon="mail"
        autoCapitalize="none"
        keyboardType="email-address"
        iconPack={Feather}
        iconSize={24}
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities["email"]}
      />
      <Input
        id="password"
        label="Password"
        icon="lock"
        autoCapitalize="none"
        secureTextEntry
        iconPack={Feather}
        iconSize={24}
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
          title="Sign Up"
          onPress={() => authHandler()}
          style={{ marginTop: 20 }}
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
  }
})

export default SignUpForm;
