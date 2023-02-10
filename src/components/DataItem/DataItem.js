import React from "react";
import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import colors from "../../../constants/colors";
import ProfileImage from '../ProfileImage/ProfileImage'
import { Ionicons, AntDesign } from '@expo/vector-icons';

const DataItem = (props) => {
  const {title, subTitle, image, type, isChecked, icon} = props
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View style={styles.container}>
        { 
          !icon &&
          <ProfileImage
          uri={image}
          size={40}
          />
        }
        {
          icon &&
          <View style={styles.leftIconContainer}>
            <AntDesign name={icon} size={20} color={colors.primary}/>
          </View>
        }
        <View style={styles.textContainer}>
          <Text numberOfLines={1} style={styles.title}>{title}</Text>
          <Text numberOfLines={1} style={styles.subTitle}>{subTitle}</Text>
        </View>
        {
          type === "checkbox" &&
          <View style={{...styles.iconContainer, ...isChecked && styles.checkedStyle}}>
            <Ionicons name="checkmark" size={18} color="black" />
          </View>
        }
        {
          type === "link" &&
          <View>
            <Ionicons name="chevron-forward-outline" size={18} color="black" />
          </View>
        }
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 7,
    borderBottomColor: colors.extraLightGrey,
    borderBottomWidth: 1,
    alignItems: 'center',
    minHeight: 50
  },
  textContainer: {
    flex: 1,
    marginLeft: 14,
  },
  title: {
    fontFamily: 'medium',
    fontSize: 16,
    letterSpacing: 0.3
  },
  subTitle: {
    fontFamily: 'regular',
    color: colors.grey,
    letterSpacing: 0.3
  },
  iconContainer: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.lightGrey,
    backgroundColor: 'white'
  },
  checkedStyle: {
    backgroundColor: colors.primary,
    borderColor: 'transparent'
  },
  leftIconContainer: {
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default DataItem;
