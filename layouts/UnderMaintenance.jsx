import React from "react";
import { View, Text, Image, SafeAreaView } from "react-native";

export default function UnderMaintenance() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={require("../assets/under_maintenance.png")}
          style={{ width: 350, height: 350 }}
        />
      </View>
    </SafeAreaView>
  );
}
