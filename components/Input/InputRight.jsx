import React, { useState } from "react";
import { View } from "react-native";
import { HelperText, Icon, TextInput, useTheme } from "react-native-paper";
export default function InputRight({
  title = "Phone Number",
  readOnly = false,
  handleChange,
  stateFn,
  value,
  error,
  errorMessage,
  icon = "link",
  customKey = null,
}) {
  let theme = useTheme();
  return (
    <View style={{ width: "100%" }}>
      <TextInput
        accessibilityLabelledBy={title}
        placeholder={`Please enter your ${title.toLowerCase()}`}
        label={title}
        outlineColor={theme.colors.primary}
        outlineStyle={{ borderWidth: 2 }}
        mode="outlined"
        value={value}
        readOnly={readOnly}
        right={<TextInput.Icon icon={icon} />}
        style={{ backgroundColor: "#fff" }}
        onChangeText={(e) =>
          handleChange(
            e,
            customKey ? customKey : title.split(" ").join("_").toLowerCase(),
            stateFn
          )
        }
      />
      <HelperText type="error" visible={error}>
        {errorMessage && errorMessage.split("_").join(" ")}
      </HelperText>
    </View>
  );
}
