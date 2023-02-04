import React, { useCallback, useReducer, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Input from "../components/Input/Input";
import PageContainer from "../components/PageContainer/PageContainer";
import PageTitle from "../components/PageTitle/PageTitle";
import { validateInput } from "../utils/Actions/formActions";
import { reducer } from "../utils/Reducers/formReducer";
import { useDispatch, useSelector } from "react-redux";
import colors from "../../constants/colors";
import SubmitButton from "../components/SubmitButton/SubmitButton";
import {
  updateSignedInUserData,
  userLogout,
} from "../utils/Actions/authActions";
import { updatedLoggedInUserData } from "../store/authSlice";
import ProfileImage from "../components/ProfileImage/ProfileImage";

const SettingsScreen = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const userData = useSelector((state) => state.auth.userData);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const firstName = userData.firstName || "";
  const lastName = userData.lastName || "";
  const email = userData.email || "";
  const about = userData.about || "";

  const initialState = {
    inputValues: {
      firstName,
      lastName,
      email,
      about,
    },
    inputValidities: {
      firstName: undefined,
      lastName: undefined,
      email: undefined,
      about: undefined,
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
      await updateSignedInUserData(userData.userId, updatedValues);
      dispatch(updatedLoggedInUserData({ newData: updatedValues }));

      setShowSuccessMessage(true);

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, formState]);

  const hasChanges = () => {
    const currentValues = formState.inputValues;
    return (
      currentValues.firstName != firstName ||
      currentValues.lastName != lastName ||
      currentValues.email != email ||
      currentValues.about != about
    );
  };

  return (
    <PageContainer style={styles.container}>
      <PageTitle text="Setting" />
      <ScrollView contentContainerStyle={styles.formContainer}>
        <ProfileImage
          size={80}
          userId={userData.userId}
          uri={userData.profilePicture}
          showEditbutton={true}
        />
        <Input
          id="firstName"
          label="First Name"
          icon="user"
          autoCapitalize="none"
          iconPack={Feather}
          iconSize={24}
          onInputChanged={inputChangedHandler}
          initialValue={userData.firstName}
          errorText={formState.inputValidities["firstName"]}
        />
        <Input
          id="lastName"
          label="Last Name"
          icon="user"
          autoCapitalize="none"
          iconPack={Feather}
          iconSize={24}
          onInputChanged={inputChangedHandler}
          initialValue={userData.lastName}
          errorText={formState.inputValidities["lastName"]}
        />
        <Input
          id="email"
          label="Email"
          icon="mail"
          autoCapitalize="none"
          keyboardType="email-address"
          iconPack={Feather}
          iconSize={24}
          onInputChanged={inputChangedHandler}
          initialValue={userData.email}
          errorText={formState.inputValidities["email"]}
        />
        <Input
          id="about"
          label="About"
          icon="user"
          autoCapitalize="none"
          iconPack={Feather}
          iconSize={24}
          onInputChanged={inputChangedHandler}
          initialValue={userData.about}
          errorText={formState.inputValidities["about"]}
        />
        <View style={styles.actionButtonsWrapper}>
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
                title="Save"
                onPress={saveHandler}
                style={styles.saveButton}
                disabled={!formState.formIsValid}
              />
            )
          )}
        </View>
        <SubmitButton
          title="Logout"
          onPress={() => dispatch(userLogout())}
          style={styles.saveButton}
          color={colors.nearlyRed}
        />
      </ScrollView>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  activityIndicator: {
    alignSelf: "center",
    margin: 10,
  },
  saveButton: {
    marginTop: 20,
  },
  actionButtonsWrapper: {
    marginTop: 20,
    width: "100%",
  },
  saveMessageText: {
    fontSize: 20,
    fontFamily: "bold",
  },
  formContainer: {
    alignItems: "center",
  },
});

export default SettingsScreen;
