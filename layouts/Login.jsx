import { Image, ScrollView, Text, ToastAndroid, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Button, TextInput } from "react-native-paper";
import React from "react";
import InputPassword from "../components/InputPassword";

export default function Login() {
  let navigation = useNavigation();
  return (
    <SafeAreaProvider>
      <ScrollView>
        <View
          style={{
            flex: 1,
            flexWrap: "wrap",
            columnGap: 3,
            flexDirection: "column",
            padding: 20,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            minHeight: "100%",
          }}
        >
          <View
            style={{
              flex: 1,
              width: "100%",
              maxWidth: 200,
              maxHeight: 300,
            }}
          >
            <Image
              source={require("../assets/login-image.png")}
              style={{
                objectFit: "contain",
                width: "100%",
                height: "100%",
              }}
            />
          </View>
          <View
            style={{
              flex: 1,
              height: "100%",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <View style={{ marginBottom: 10, width: "100%" }}>
              <TextInput
                autoFocus={true}
                accessibilityLabel="input"
                accessibilityLabelledBy="username"
                placeholder="Please enter your username"
                label="Username/Email/Phone number"
                mode="outlined"
              />
            </View>
            <InputPassword />
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                width: "100%",
                rowGap: 5,
              }}
            >
              <Button
                icon="fingerprint"
                mode="contained"
                style={{
                  borderRadius: 5,
                }}
                onPress={() => {
                  ToastAndroid.show("Under Development", ToastAndroid.SHORT);
                }}
              >
                <Text style={{ textAlign: "center", color: "#fff" }}>
                  Login
                </Text>
              </Button>
              <Button
                icon="account-plus"
                mode="contained"
                style={{
                  borderRadius: 5,
                }}
                onPress={() => {
                  navigation.navigate("Register");
                }}
              >
                <Text style={{ textAlign: "center", color: "#fff" }}>
                  Register
                </Text>
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}
