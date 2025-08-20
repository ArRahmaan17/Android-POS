import React, { useState } from "react";
import { Image, ScrollView, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { httpHelper } from "../../helpers/HttpHelper";
import Company from "./Company";
import Account from "./Account";

export default function Register() {
  // benakno cuy
  function handleOnChange(value, key, stateFn) {
    stateFn((prevState) => ({ ...prevState, [key]: value }));
  }

  const [availableUser, setAvailableUser] = useState(false);

  const [user, setUser] = useState({
    // name: "",
    // username: "",
    // email: "",
    // phone_number: "",
    name: "test1",
    username: "test.rahmaan",
    email: "test@gmail.com",
    phone_number: "89522983274",
    password: "",
    confirm_password: "",
  });

  const [company, setCompany] = useState({
    name: "",
    email: "",
    phone_number: "",
  });
  const [address, setAddress] = useState({
    place: "",
    address: "",
    city: "",
    province: "",
    zipCode: "",
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
    <SafeAreaProvider>
      <ScrollView>
        <View
          style={{
            flex: 1,
            flexWrap: "wrap",
            columnGap: 4,
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
    </SafeAreaProvider>
  );
}
