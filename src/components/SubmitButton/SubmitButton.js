import react from "react"
import { StyleSheet, Text, TouchableOpacity } from "react-native"
import colors from "../../../constants/colors"

const SubmitButton = (props) => {
  const enabledBgColor = props.color || colors.primary
  const disabledBgColor = colors.lightGrey;
  const bgColor = props.disabled ? disabledBgColor : enabledBgColor

  return(
    <TouchableOpacity
      onPress={props.disabled ? () => {} : props.onPress}
      style={{...styles.button, ...props.style, ...{ backgroundColor: bgColor }}}>
      <Text style={{ color: props.disabled ? colors.grey : colors.white}}>
        {props.title}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  }
})

export default SubmitButton