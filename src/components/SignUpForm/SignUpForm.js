import react from "react";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";
import Input from "../../components/Input/Input";
import SubmitButton from "../../components/SubmitButton/SubmitButton";

const SignUpForm = () => {
  return (
    <>
      <Input label="First Name" icon="user" iconPack={Feather} iconSize={24} />
      <Input label="Last Name" icon="user" iconPack={Feather} iconSize={24} />
      <Input label="Email" icon="mail" iconPack={Feather} iconSize={24} />
      <Input label="Password" icon="lock" iconPack={Feather} iconSize={24} />
      <SubmitButton
        title="Sign Up"
        onPress={() => console.log("Pressed")}
        style={{ marginTop: 20 }}
      />
    </>
  );
};

export default SignUpForm;
