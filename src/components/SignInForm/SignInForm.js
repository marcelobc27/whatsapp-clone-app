import react from "react";
import { Feather } from "@expo/vector-icons";
import Input from "../../components/Input/Input";
import SubmitButton from "../../components/SubmitButton/SubmitButton";

const SignInForm = () => {
  return (
    <>
      <Input label="Email" icon="mail" iconPack={Feather} iconSize={24} />
      <Input label="Password" icon="lock" iconPack={Feather} iconSize={24} />
      <SubmitButton
        title="Sign In"
        onPress={() => console.log("Pressed")}
        style={{ marginTop: 20 }}
      />
    </>
  );
};

export default SignInForm;
