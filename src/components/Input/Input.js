import react from "react";
import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet, Text, TextInput, View } from "react-native";
import colors from "../../../constants/colors";

const Input = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{props.label}</Text>

      <View style={styles.inputContainer}>
        {props.icon && (
          <props.iconPack
            name={props.icon}
            size={props.iconSize || 15}
            style={styles.icon}
          />
        )}
        <TextInput style={styles.input} />
      </View>
      {props.errorText && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    marginVertical: 8,
    fontFamily: "bold",
    letterSpacing: 0.3,
    color: colors.textColor,
  },
  inputContainer: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 2,
    alignItems: "center",
    backgroundColor: colors.nearlyWhite,
  },
  input: {
    flex: 1,
    color: colors.textColor,
    fontFamily: "regular",
    letterSpacing: 0.3,
    paddingTop: 0,
  },
  icon: {
    marginRight: 10,
    color: colors.grey,
  },
  errorContainer: {
    marginVertical: 5,
  },
  errorText: {
    color: colors.red,
    fontFamily: "regular",
    fontSize: 13,
    letterSpacing: 0.3,
  },
});

export default Input;
