import React, { useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  KeyboardAvoidingViewComponent,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { httpHelper } from "../../helpers/HttpHelper";
import Company from "./Company";
import Account from "./Account";
import { useNavigation } from "@react-navigation/native";
import { HelperText, Text, TextInput } from "react-native-paper";

export default function Register() {
  function handleOnChange(value, key, stateFn) {
    stateFn((prevState) => ({ ...prevState, [key]: value }));
  }
  const navigation = useNavigation();
  const [availableUser, setAvailableUser] = useState(false);

  const [user, setUser] = useState({
    // name: "",
    // username: "",
    // email: "",
    // phone_number: "",
    // password: "",
    // confirm_password: "",
    name: "test1",
    username: "test.rahmaan",
    email: "test@gmail.com",
    phone_number: "6289522983274",
    password: "testTest1!",
    confirm_password: "testTest1!",
  });

  const [company, setCompany] = useState({
    name: "Test Aja",
    email: "test@test.co",
    phone_number: "6289522983279",
  });
  const [address, setAddress] = useState({
    place: "Test Aja",
    address: "Test Aja",
    city: "Test Aja",
    province: "Test Aja",
    zipCode: "Test Aja",
  });

  const checkAvailabilityUser = async () => {
    let data = { ...user };
    let checkAvailable = await httpHelper("GET", "check-available-user", {
      ...data,
    });
    if (checkAvailable.code === 200) {
      setAvailableUser(true);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flex: 1,
      }}
    >
      <ScrollView style={{ paddingHorizontal: 24 }}>
        <View
          style={{
            flex: 1,
            paddingVertical: 24,
            paddingHorizontal: 0,
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flex: 1,
              width: "100%",
              maxWidth: 100,
              maxHeight: 100,
            }}
          >
            <Image
              source={require("../../assets/register-image.png")}
              style={{
                objectFit: "contain",
                width: "100%",
                height: "100%",
              }}
            />
          </View>
          {availableUser ? (
            <Company
              company={company}
              address={address}
              user={user}
              navigation={navigation}
              availableUser={availableUser}
              setAvailableUser={setAvailableUser}
              handleOnChange={handleOnChange}
              setCompany={setCompany}
              setAddress={setAddress}
            />
          ) : (
            <Account
              user={user}
              setUser={setUser}
              checkAvailabilityUser={checkAvailabilityUser}
              handleOnChange={handleOnChange}
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
