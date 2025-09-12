import React, { PermissionsAndroid } from "react-native";
import { View, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "react-native-paper";
import { useEffect } from "react";
import CONFIG from "../config";
import NavBar from "../components/NavBar";
export default function Home() {
  const theme = useTheme();
  async function requestPermission() {
    const check = await PermissionsAndroid.check("android.permission.CAMERA");
    console.log(check, "permission camera");
    if (!check) {
      try {
        const resultPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: CONFIG.APP.NAME + " Camera Permission",
            message:
              CONFIG.APP.NAME +
              " needs access to your camera " +
              "so you can take awesome pictures.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (resultPermission !== "granted") {
          Linking.openURL("app-settings:");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    requestPermission();
  }, []);
  return (
    <SafeAreaView>
      <View>
        <NavBar />
      </View>
    </SafeAreaView>
  );
}
