import React, { useCallback, useEffect, useReducer, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import PageContainer from "../components/PageContainer/PageContainer";
import PageTitle from "../components/PageTitle/PageTitle";
import ProfileImage from "../components/ProfileImage/ProfileImage";
import Input from "../components/Input/Input";
import { reducer } from "../utils/Reducers/formReducer";
import {
  AddUsersToChat,
  removeUserFromChat,
  updateChatData,
} from "../utils/Actions/chatActions";
import colors from "../../constants/colors";
import SubmitButton from "../components/SubmitButton/SubmitButton";
import { validateInput } from "../utils/Actions/formActions";
import DataItem from "../components/DataItem/DataItem";
import { useNavigation } from "@react-navigation/native";

const ChatSettingsScreen = (props) => {
  const chatId = props.route.params.chatId;
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const chatData = useSelector((state) => state.chats.chatsData[chatId] || {});
  const userData = useSelector((state) => state.auth.userData);
  const storedUsers = useSelector((state) => state.users.storedUsers);
  const starredMessages = useSelector(
    (state) => state.messages.starredMessages[chatId] ?? {}
  );

  const initialState = {
    inputValues: {
      chatName: chatData.chatName,
    },
    inputValidities: {
      chatName: undefined,
    },
    formIsValid: false,
  };

  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  const selectedUsers = props.route.params && props.route.params.selectedUsers;
  useEffect(() => {
    if (!selectedUsers) {
      return;
    }

    const selectedUserData = [];
    selectedUsers.forEach((uid) => {
      if (uid === userData.userId) return;

      if (!storedUsers[uid]) {
        console.log("No user data found in the data store");
        return;
      }

      selectedUserData.push(storedUsers[uid]);
    });

    AddUsersToChat(userData, selectedUserData, chatData);
    console.log(selectedUserData);
  }, [selectedUsers]);

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({
        inputId,
        validationResult: result,
        inputValues: inputValue,
      });
    },
    [dispatchFormState]
  );

  const saveHandler = useCallback(async () => {
    const updatedValues = formState.inputValues;

    try {
      setIsLoading(true);
      await updateChatData(chatId, userData.userId, updatedValues);

      setShowSuccessMessage(true);

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [formState]);

  const hasChanges = () => {
    const currentValues = formState.inputValues;
    return currentValues.chatName != chatData.chatName;
  };

  const leaveChat = useCallback(async () => {
    try {
      setIsLoading(true);
      await removeUserFromChat(userData, userData, chatData);
      navigation.popToTop();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [navigation, isLoading]);

  if (!chatData.users) return null;

  return (
    <PageContainer>
      <PageTitle text="Chat Settings" />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <ProfileImage
          showEditButton={true}
          size={80}
          chatId={chatId}
          userId={userData.userId}
          uri={chatData.chatImage}
        />
        <Input
          id="chatName"
          label="Chat Name"
          autoCapitalize="none"
          initialValue={chatData.chatName}
          allowEmpty={false}
          onInputChanged={inputChangedHandler}
          errorText={formState.inputValidities["chatName"]}
        />
        <View style={styles.actionButtonsWrapper}>
          <View style={styles.sectionContainer}>
            <Text style={styles.heading}>
              {chatData.users.length} Participantes
            </Text>
            <DataItem
              title="Add users"
              icon="plus"
              type="button"
              onPress={() =>
                navigation.navigate("NewChat", {
                  isGroupChat: true,
                  title: "Add Users",
                  existingUsers: chatData.users,
                  chatId,
                })
              }
            />
            {chatData.users.slice(0, 4).map((uid) => {
              const currentUser = storedUsers[uid];
              return (
                <DataItem
                  key={uid}
                  image={currentUser.profilePicture}
                  title={`${currentUser.firstName} ${currentUser.lastName}`}
                  subTitle={currentUser.about}
                  type={uid !== userData.userId && "link"}
                  onPress={() =>
                    uid !== userData.userId &&
                    props.navigation.navigate("ContactScreen", { uid, chatId })
                  }
                />
              );
            })}
            {chatData.users.length > 4 && (
              <DataItem
                type={"link"}
                title="View all"
                hideImage={true}
                onPress={() =>
                  navigation.navigate("DataListScreen", {
                    title: "Participants",
                    data: chatData.users,
                    type: "users",
                    chatId: chatId,
                  })
                }
              />
            )}
          </View>
          {showSuccessMessage && (
            <Text style={styles.saveMessageText}>Saved!</Text>
          )}
          {isLoading ? (
            <ActivityIndicator
              size={"small"}
              color={colors.primary}
              style={styles.activityIndicator}
            />
          ) : (
            hasChanges() && (
              <SubmitButton
                title="Save Changes"
                onPress={saveHandler}
                style={styles.saveButton}
                disabled={!formState.formIsValid}
              />
            )
          )}
        </View>
        <DataItem
          type={"link"}
          title="Starred messages"
          hideImage={true}
          onPress={() =>
            navigation.navigate("DataListScreen", {
              title: "Starred messages",
              data: Object.values(starredMessages),
              type: "messages"
            })
          }
        />
      </ScrollView>
      {
        <SubmitButton
          title="Leave Chat"
          color={colors.red}
          onPress={leaveChat}
          style={{ marginBotton: 20 }}
        />
      }
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  activityIndicator: {
    alignSelf: "center",
    margin: 10,
  },
  saveButton: {
    marginTop: 20,
    color: colors.primary,
  },
  actionButtonsWrapper: {
    flex: 1,
    marginTop: 10,
    width: "100%",
  },
  saveMessageText: {
    fontSize: 20,
    fontFamily: "bold",
  },
  sectionContainer: {
    width: "100%",
    alignItems: "left",
    justifyContent: "center",
    marginTop: 10,
  },
  heading: {
    marginVertical: 8,
    color: colors.textColor,
    fontFamily: "bold",
    letterSpacing: 0.3,
  },
});

export default ChatSettingsScreen;
