import React, { PermissionsAndroid } from "react-native";
import { View, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "react-native-paper";
import { useEffect } from "react";
import CONFIG from "../config";
import NavBar from "../components/NavBar";
import { downloadOrCacheFile } from "../helpers/HttpHelper";
import { appendObjectToArrayOfObject } from "../helpers/ConvertHelper";
export default function Home() {
  const theme = useTheme();
  async function downloadDefaultFile(defaultFile) {
    const download = (fl) => {
      return new Promise(async (resolve, reject) => {
        let result = await downloadOrCacheFile(
          `${CONFIG.API.ASSET_BASE_URL}/${fl.folder}/${fl.file}`,
          fl.folder,
          fl.file
        );
        resolve({ status: true, result: result });
      });
    };
    return Promise.all([
      defaultFile.map((file) => {
        download(file);
      }),
    ]);
  }
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
    downloadDefaultFile(
      appendObjectToArrayOfObject(
        [CONFIG.DEFAULT.FILE_SYSTEM, CONFIG.FILE_SYSTEM.CACHE],
        ["file", "folder"],
        { strict: false }
      )
    );
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
