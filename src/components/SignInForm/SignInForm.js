import react, { useCallback, useReducer } from "react";
import { Feather } from "@expo/vector-icons";
import Input from "../../components/Input/Input";
import SubmitButton from "../../components/SubmitButton/SubmitButton";
import { validateInput } from "../../utils/Actions/formActions";
import { reducer } from "../../utils/Reducers/formReducer";

const initialState = {
  inputValidities: {
    email: false,
    password: false,
  },
  formIsValid: false
}

const SignInForm = () => {
  const [formState, dispatchFormState] = useReducer(reducer, initialState)

  const inputChangedHandler = useCallback((inputId, inputValue) => {
    const result = validateInput(inputId, inputValue)
    dispatchFormState({ inputId: inputId, validationResult: result})
  }, [dispatchFormState]);

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
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities['email']}
      />
      <Input
        id="password"
        label="Password"
        icon="lock"
        iconPack={Feather}
        iconSize={24}
        autoCapitalize="none"
        secureTextEntry
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities['password']}
      />
      <SubmitButton
        title="Sign In"
        onPress={() => console.log("Pressed")}
        style={{ marginTop: 20 }}
        disabled={!formState.formIsValid}
      />
    </>
  );
};

export default SignInForm;
