import React, { useState } from "react";
import { View } from "react-native";
import { TextInput } from "react-native-paper";
export default function InputPassword({
  title = "Password",
  handleChange,
  stateFn,
  value,
  customKey = null,
}) {
  const [visible, setVisible] = useState(false);
  return (
    <View style={{ marginBottom: 10, width: "100%" }}>
      <TextInput
        accessibilityLabelledBy={title}
        placeholder={`Please enter your ${title.toLowerCase()}`}
        label={title}
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
            onPress={() => {
              setVisible(!visible);
            }}
            icon={!visible ? "eye-off" : "eye"}
          />
        }
      />
    </View>
  );
}
