import React from "react";
import { FAB, useTheme } from "react-native-paper";
export default function Fab({ onPress, visible }) {
  const theme = useTheme();
  return (
    <FAB
      mode="flat"
      icon="plus"
      visible={!visible}
      size="small"
      style={{
        position: "absolute",
        backgroundColor: theme.colors.surface,
        borderWidth: 1.5,
        borderColor: theme.colors.primaryContainer,
        bottom: 10,
        right: 10,
      }}
      labelStyle={{
        fontSize: 12,
        fontWeight: "600",
        color: theme.colors.onSurface,
      }}
      onPress={onPress}
    />
  );
}
