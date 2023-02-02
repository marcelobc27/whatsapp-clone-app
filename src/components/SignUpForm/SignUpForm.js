import react, { useCallback, useReducer } from "react";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";
import Input from "../../components/Input/Input";
import SubmitButton from "../../components/SubmitButton/SubmitButton";
import { validateInput } from "../../utils/Actions/formActions";
import { reducer } from "../../utils/Reducers/formReducer";

const initialState = {
  inputValidities: {
    firstName: false,
    lastName: false,
    email: false,
    password: false,
  },
  formIsValid: false
}

const SignUpForm = () => {
  const [formState, dispatchFormState] = useReducer(reducer, initialState)

  const inputChangedHandler = useCallback((inputId, inputValue) => {
    const result = validateInput(inputId, inputValue)
    dispatchFormState({ inputId: inputId, validationResult: result})
  }, [dispatchFormState]);

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
        errorText={formState.inputValidities['firstName']}
      />
      <Input
        id="lastName"
        label="Last Name"
        icon="user"
        autoCapitalize="none"
        iconPack={Feather}
        iconSize={24}
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities['lastName']}
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
        errorText={formState.inputValidities['email']}
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
        errorText={formState.inputValidities['password']}
      />
      <SubmitButton
        title="Sign Up"
        onPress={() => console.log("Pressed")}
        style={{ marginTop: 20 }}
        disabled={!formState.formIsValid}
      />
    </>
  );
};

export default SignUpForm;
