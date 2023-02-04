import React from "react";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../constants/colors";
import { HeaderButton } from "react-navigation-header-buttons";

const CustomHeaderButton = (props) => {
  return (
    <HeaderButton
      {...props}
      IconComponent={Ionicons}
      iconSize={24}
      color={props.color ?? colors.blue}
    />
  );
};

export default CustomHeaderButton;
