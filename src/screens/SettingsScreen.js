import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

const SettingsScreen = props => {
  const navigation = useNavigation()
  return(
    <View style={styles.container}>
      <Text>Settings Screen</Text>
      <Button title="Go to settings Stack" onPress={() => navigation.navigate('ChatSettings')}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
})

export default SettingsScreen