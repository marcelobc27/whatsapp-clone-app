import React, { useRef } from "react";
import { Feather, FontAwesome } from "@expo/vector-icons";
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import colors from "../../../constants/colors";
import uuid from "react-native-uuid";
import * as ClipBoard from "expo-clipboard";
import { StarMessage } from "../../utils/Actions/chatActions";
import { useSelector } from "react-redux";

function formatAmPm(dateString) {
  const date = new Date(dateString);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  return hours + ":" + minutes + " " + ampm;
}

const MenuItem = (props) => {
  const Icon = props.iconPack ?? Feather;
  return (
    <MenuOption onSelect={props.onSelect}>
      <View style={styles.menuItemContainer}>
        <Text style={styles.menuText}>{props.text}</Text>
        <Icon name={props.icon} size={18} />
      </View>
    </MenuOption>
  );
};

const Bubble = (props) => {
  const { text, type, messageId, chatId, userId, date, setReply, replyingTo, name, imageUrl } =
    props;

  const starredMessages = useSelector(
    (state) => state.messages.starredMessages[chatId] ?? {}
  );
  const storedUsers = useSelector((state) => state.users.storedUsers);

  const bubbleStyle = { ...styles.container };
  const textStyle = { ...styles.text };
  const wrapperStyle = { ...styles.wrapperStyle };

  const menuRef = useRef(null);
  const id = useRef(uuid.v4());

  const Container =
    type === "myMessage" || "theirMessage" ? TouchableWithoutFeedback : View;

  let isUserMessage = false;
  const dateString = date && formatAmPm(date);

  switch (type) {
    case "system":
      textStyle.color = colors.extraLightGreen;
      bubbleStyle.backgroundColor = colors.beige;
      bubbleStyle.alignItems = "center";
      bubbleStyle.marginTop = 10;
      break;
    case "error":
      textStyle.color = colors.white;
      bubbleStyle.backgroundColor = colors.red;
      bubbleStyle.alignItems = "center";
      bubbleStyle.marginTop = 10;
      break;
    case "myMessage":
      wrapperStyle.justifyContent = "flex-end";
      bubbleStyle.backgroundColor = colors.greenVariation;
      // bubbleStyle.maxWidth = "90";
      isUserMessage = true;
      break;
    case "theirMessage":
      wrapperStyle.justifyContent = "flex-start";
      bubbleStyle.backgroundColor = colors.beige;
      // bubbleStyle.maxWidth = "90";
      isUserMessage = true;
      break;
    case "reply":
      bubbleStyle.backgroundColor = colors.almostGrey;
      // bubbleStyle.maxWidth = "90";
      break;
    default:
      break;
  }

  const copyToClipboard = async (text) => {
    await ClipBoard.setStringAsync(text);
  };

  const isStarred = isUserMessage && starredMessages[messageId] !== undefined;
  const replyingToUser = replyingTo && storedUsers[replyingTo.sentBy];

  return (
    <View style={wrapperStyle}>
      <Container
        onLongPress={() =>
          menuRef.current.props.ctx.menuActions.openMenu(id.current)
        }
        style={styles.touchableWithoutFeedback}
      >
        <View style={bubbleStyle}>
          {
            name && 
            <Text style={styles.name}>{name}</Text>
          }
          {replyingToUser && (
            <Bubble
              type="reply"
              text={replyingTo.text}
              name={`${replyingToUser.firstName} ${replyingToUser.lastName}`}
            />
          )}
          {
            !imageUrl &&
            <Text style={textStyle}>
              {text}
            </Text>
          }
          {
            imageUrl && 
            <Image
              source={{uri: imageUrl}}
              style={styles.image}
            />
          }
          {dateString && (
            <View style={styles.timeContainer}>
              {isStarred && (
                <FontAwesome
                  name="star"
                  size={14}
                  color="black"
                  style={{ marginRight: 5 }}
                />
              )}
              <Text style={styles.time}>{dateString}</Text>
            </View>
          )}
          <Menu name={id.current} ref={menuRef}>
            <MenuTrigger />
            <MenuOptions>
              <MenuItem
                text="Copy to clipboard"
                icon={"copy"}
                onSelect={() => copyToClipboard(text)}
              />
              <MenuItem
                text={`${isStarred ? "Unstar" : "Star"} message`}
                icon={"star"}
                iconPack={isStarred ? FontAwesome : Feather}
                onSelect={() => StarMessage(messageId, chatId, userId)}
              />
              <MenuItem
                text="Reply to"
                icon={"arrow-left"}
                onSelect={setReply}
              />
            </MenuOptions>
          </Menu>
        </View>
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperStyle: {
    flexDirection: "row",
    justifyContent: "center",
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: 6,
    padding: 5,
    marginBottom: 10,
    borderColor: colors.lightGrey,
    borderWidth: 1,
  },
  textStyle: {
    fontFamily: "regular",
    letterSpacing: 0.3,
  },
  touchableWithoutFeedback: {
    width: "100%",
  },
  menuItemContainer: {
    flexDirection: "row",
    padding: 5,
  },
  menuText: {
    flex: 1,
    fontFamily: "regular",
    letterSpacing: 0.3,
    fontSize: 16,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  time: {
    fontFamily: "regular",
    letterSpacing: 0.3,
    color: colors.grey,
    fontSize: 12,
  },
  name: {
    fontFamily: 'medium',
    letterSpacing: 0.3
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 5
  }
});

export default Bubble;
