import React, { useState } from "react";
import { View } from "react-native";
import { HelperText, TextInput, useTheme } from "react-native-paper";
export default function InputPassword({
  title = "Password",
  handleChange,
  stateFn,
  value,
  error = false,
  errorMessage,
  customKey = null,
}) {
  const [visible, setVisible] = useState(false);
  const theme = useTheme();
  return (
    <View style={{ width: "100%" }}>
      <TextInput
        style={{ backgroundColor: "#fff" }}
        accessibilityLabelledBy={title}
        placeholder={`Please enter your ${title.toLowerCase()}`}
        label={title}
        outlineColor={theme.colors.primary}
        outlineStyle={{ borderWidth: 1.5 }}
        secureTextEntry={!visible}
        mode="outlined"
        value={value}
        onChangeText={(e) =>
          handleChange(
            e,
            customKey ? customKey : title.split(" ").join("_").toLowerCase(),
            stateFn
          )
        }
        right={
          <TextInput.Icon
            size={18}
            onPress={() => {
              setVisible(!visible);
            }}
            icon={!visible ? "eye-off" : "eye"}
          />
        }
      />
      <HelperText type="error" visible={error}>
        {errorMessage && errorMessage.split("_").join(" ")}
      </HelperText>
    </View>
  );
}
