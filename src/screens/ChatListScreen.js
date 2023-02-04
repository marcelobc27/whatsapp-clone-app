import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/CustomHeaderButton/CustomHeaderButton";

const ChatListScreen = props => {
  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item 
            title="New Chat"
            iconName="create-outline"
            onPress={() => navigation.navigate("NewChat")}
          />
        </HeaderButtons>
      } 
    })
  }, [])

  return(
    <View style={styles.container}>
      <Text>ChatListScreen</Text>
      <Button title="Go to Chat Screen" onPress={() => navigation.navigate('ChatScreen')}/>
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