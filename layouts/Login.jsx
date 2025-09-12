import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  Button,
  HelperText,
  TextInput,
  Text,
  useTheme,
} from "react-native-paper";
import React, { useState } from "react";
import InputPassword from "../components/Input/InputPassword";
import {
  httpHelper,
  handleChange,
  downloadOrCahceFile,
} from "../helpers/HttpHelper";
import * as yup from "yup";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { CONFIG, log } from "../config";

export default function Login() {
  const [errorsMessage, setErrorsMessage] = useState({});
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const theme = useTheme();
  const navigation = useNavigation();

  const loginSchema = yup.object({
    username: yup
      .string()
      .required("Username is required")
      .min(CONFIG.VALIDATION.USERNAME.MIN_LENGTH)
      .max(CONFIG.VALIDATION.USERNAME.MAX_LENGTH),
    password: yup
      .string()
      .required("Password is required")
      .min(CONFIG.VALIDATION.PASSWORD.MIN_LENGTH)
      .max(CONFIG.VALIDATION.PASSWORD.MAX_LENGTH),
  });
  const ProcessAuth = async () => {
    setErrorsMessage({});
    const newErrors = {};
    try {
      await loginSchema.validate(loginData, { abortEarly: false });

      let result = await httpHelper("POST", "auth/login", loginData);
      await SecureStore.deleteItemAsync(CONFIG.STORAGE.TOKEN);
      await SecureStore.setItemAsync(CONFIG.STORAGE.TOKEN, result.data.token);
      if (result.data.user.user.profile_picture) {
        result.data.user.user.profile_picture = await downloadOrCahceFile(
          CONFIG.API.ASSET_BASE_URL +
            "/customer-profile-picture/" +
            result.data.user.user.profile_picture,
          "customer-profile-picture",
          result.data.user.user.profile_picture
        );
        await SecureStore.deleteItemAsync(CONFIG.STORAGE.USER);
        await SecureStore.setItemAsync(
          CONFIG.STORAGE.USER,
          JSON.stringify(result.data.user)
        );
      }
      console.log(result.data.user);
      navigation.replace("Main");
    } catch (error) {
      console.log(error);
      if (error.inner) {
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
      }
    }
    setErrorsMessage(newErrors);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            flex: 1,
            padding: 24,
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <View
            style={{ flex: 1, width: "100%", maxWidth: 200, maxHeight: 300 }}
          >
            <Image
              source={require("../assets/login-image.png")}
              style={{
                resizeMode: "contain",
                width: "100%",
                height: "100%",
              }}
            />
          </View>

          <View style={{ flex: 1, width: "100%" }}>
            <TextInput
              style={{ backgroundColor: "#fff" }}
              value={loginData.username}
              onChangeText={(e) => handleChange(e, "username", setLoginData)}
              outlineColor={theme.colors.primary}
              outlineStyle={{ borderWidth: 1.5 }}
              label="Username/Email/Phone number"
              mode="outlined"
              placeholder="Enter your username"
            />
            <HelperText type="error" visible={!!errorsMessage.username}>
              {errorsMessage.username}
            </HelperText>

            {/* Password */}
            <InputPassword
              handleChange={handleChange}
              title="Password"
              stateFn={setLoginData}
              error={!!errorsMessage.password}
              errorMessage={errorsMessage.password}
            />

            <View style={{ flexDirection: "column", width: "100%", rowGap: 8 }}>
              <Button
                buttonColor={theme.colors.primaryContainer}
                textColor="black"
                icon="fingerprint"
                mode="contained"
                onPress={ProcessAuth}
                style={{
                  borderColor: theme.colors.primary,
                  borderWidth: 2,
                  borderRadius: 8,
                }}
              >
                Login
              </Button>

              <Button
                icon="account-plus"
                mode="contained"
                buttonColor={theme.colors.primaryContainer}
                textColor="black"
                onPress={() => navigation.navigate("Register")}
                style={{
                  borderColor: theme.colors.primary,
                  borderWidth: 2,
                  borderRadius: 8,
                }}
              >
                Register
              </Button>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
