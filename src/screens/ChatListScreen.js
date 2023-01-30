import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

const ChatListScreen = props => {
  const navigation = useNavigation()
  return(
    <View style={styles.container}>
      <Text>ChatListScreen</Text>
      <Button title="Go to settings" onPress={() => navigation.navigate('ChatSettings')}/>
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

export default ChatListScreen