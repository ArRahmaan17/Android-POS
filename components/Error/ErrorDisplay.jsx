import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { capitalizeFirstLetter } from "../../helpers/ConvertHelper";

const ErrorDisplay = ({ title, errorMessages = [] }) => {
  if (!errorMessages || errorMessages.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {errorMessages.map((message, index) => (
        <Text key={index} style={styles.errorMessage}>
          • {capitalizeFirstLetter(message)}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FCA5A5",
    borderWidth: 2,
    borderRadius: 4,
    padding: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#DC2626",
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: "#DC2626",
    marginBottom: 4,
    lineHeight: 20,
  },
});

export default ErrorDisplay;
