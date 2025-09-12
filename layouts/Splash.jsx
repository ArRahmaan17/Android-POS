import React, { useEffect, useState } from "react";
import { Image, SafeAreaView, View } from "react-native";
import * as SecureStore from "expo-secure-store";
export default function Splash({ navigation }) {
  const token = SecureStore.getItem("token");
  useEffect(() => {
    getToken();
  }, []);
  async function getToken() {
    console.log("auth token", token);
    setTimeout(() => {
      if (token === null) {
        navigation.replace("Login");
      } else {
        navigation.replace("Main");
      }
    }, 2500);
  }
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
          source={require("../assets/splash.png")}
          style={{ width: 250, height: 450 }}
        />
      </View>
    </SafeAreaView>
  );
}
