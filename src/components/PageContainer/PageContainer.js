import react from "react";
import { StyleSheet, View } from "react-native";

const PageContainer = (props) => {
  return(
    <View style={{ ...styles.container, ...props.style}}>
      {props.children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8
  }
})

export default PageContainer