import React, { useEffect, useState } from "react";
import { Image, SafeAreaView, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { checkNetworkConnection } from "../helpers/NetworkHelper";
import { httpHelper } from "../helpers/HttpHelper";
import { CONFIG } from "../config";
import Toast from "react-native-toast-message";
export default function Splash({ navigation }) {
  useEffect(() => {
    getToken();
  }, []);
  async function getToken() {
    const networkStatus = await checkNetworkConnection();
    console.log(networkStatus);
    if (!networkStatus.isConnected) {
      Toast.show({
        type: "error",
        text1: "Network Error",
        text2: "No internet connection. Please check your network settings.",
      });
      return;
    }
    await checkToken();
  }
  async function checkToken() {
    const token = await SecureStore.getItemAsync(CONFIG.STORAGE.TOKEN);
    const result = await authecticationToken(token);
    console.log(result.code);
    if (result.code >= 500) {
      navigation.replace("UnderMaintenance");
    } else if (result.code !== 200) {
      navigation.replace("Login");
    } else {
      navigation.replace("Main");
    }
  }
  async function authecticationToken(token) {
    const response = await httpHelper(
      "GET",
      "auth/me",
      {},
      { Authorization: `Bearer ${token}` }
    );
    return response;
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
