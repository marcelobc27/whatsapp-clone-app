import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import userImage from "../../../assets/images/userImage.jpeg";
import colors from "../../../constants/colors";
import {
  launchImagePicker,
  uploadImageAsync,
} from "../../utils/ImagePickerHelper";
import { updateSignedInUserData } from "../../utils/Actions/authActions";
import { useDispatch } from "react-redux";
import { updatedLoggedInUserData } from "../../store/authSlice";
import { updateChatData } from "../../utils/Actions/chatActions";

const ProfileImage = (props) => {
  const dispatch = useDispatch();
  const source = props.uri ? { uri: props.uri } : userImage;

  const [image, setImage] = useState(source);
  const [isLoading, setIsLoading] = useState(false);
  const showEditButton = props.showEditButton && props.showEditButton === true;
  const showRemoveButton =
    props.showRemoveButton && props.showRemoveButton === true;
  const userId = props.userId;
  const chatId = props.chatId;

  const pickImage = async () => {
    try {
      const tempUri = launchImagePicker();
      if (!tempUri) return;

      setIsLoading(true);
      const uploadUrl = await uploadImageAsync(tempUri, chatId !== undefined);
      setIsLoading(false);

      if (!uploadUrl) {
        throw new Error("Could not upload image");
      }

      if (chatId) {
        await updateChatData(chatId, userId, { chatImage: uploadUrl });
      } else {
        const newData = { profilePicture: uploadUrl };

        await updateSignedInUserData(userId, newData);
        dispatch(updatedLoggedInUserData({ newData }));
      }

      setImage({ uri: uploadUrl });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const Container = props.onPress || showEditButton ? TouchableOpacity : View;

  return (
    <Container style={props.style} onPress={props.onPress || pickImage}>
      {isLoading ? (
        <View
          style={{
            height: props.size,
            width: props.size,
            ...styles.loadingContainer,
          }}
        >
          <ActivityIndicator size={"small"} color={colors.primary} />
        </View>
      ) : (
        <Image
          source={image}
          style={{
            ...styles.profileImage,
            ...{ width: props.size, height: props.size },
          }}
        />
      )}

      {showEditButton && !isLoading && (
        <View style={styles.editIconContainer}>
          <Feather name="edit-3" size={16} color="black" />
        </View>
      )}

      {showRemoveButton && !isLoading && (
        <View style={styles.removeIconContainer}>
          <AntDesign name="closecircle" size={16} color="black" />
        </View>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  profileImage: {
    borderRadius: 50,
    borderColor: colors.grey,
    borderWidth: 1,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  removeIconContainer: {
    position: "absolute",
    bottom: -3,
    right: -3,
    padding: 3,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ProfileImage;
