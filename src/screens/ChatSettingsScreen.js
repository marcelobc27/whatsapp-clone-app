import React, { useCallback, useReducer, useState } from "react";
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
import { updateChatData } from "../utils/Actions/chatActions";
import colors from "../../constants/colors";
import SubmitButton from "../components/SubmitButton/SubmitButton";
import { validateInput } from "../utils/Actions/formActions";
import DataItem from "../components/DataItem/DataItem";

const ChatSettingsScreen = (props) => {
  const chatId = props.route.params.chatId;
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const chatData = useSelector((state) => state.chats.chatsData[chatId]);
  const userData = useSelector((state) => state.auth.userData);
  const storedUsers = useSelector((state) => state.users.storedUsers)

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
          <Text style={styles.heading}>{chatData.users.length} Participantes</Text>
          <DataItem
            title="Add users"
            icon="plus"
            type="button"
          />
          {
            chatData.users.map(uid => {
              const currentUser = storedUsers[uid]
              return (
                <DataItem
                  key={uid}
                  image={currentUser.profilePicture}
                  title={`${currentUser.firstName} ${currentUser.lastName}`}
                  subTitle={currentUser.about}
                  type={uid !== userData.userId && "link"}
                  onPress={() => uid !== userData.userId && props.navigation.navigate("ContactScreen", {uid})}  
                />
              )
            })
          }
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
      </ScrollView>
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
  marginTop: 10
  },
  heading: {
    marginVertical: 8,
    color: colors.textColor,
    fontFamily: "bold",
    letterSpacing: 0.3
  }
});

export default ChatSettingsScreen;
