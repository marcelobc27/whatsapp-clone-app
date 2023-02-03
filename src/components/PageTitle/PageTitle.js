import React from "react"
import { StyleSheet, Text, View } from "react-native"
import colors from "../../../constants/colors"

const PageTitle = (props) => {
  return(
    <View style={styles.container}>
      <Text style={styles.titleText}>{props.text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10
  },
  titleText: {
    fontSize: 28,
    color: colors.textColor,
    fontFamily: 'bold',
    letterSpacing: 0.3
  }
})

export default PageTitle