import {
  Keyboard,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import React, { useState } from "react";
import InputPassword from "../../components/Input/InputPassword";
import InputRight from "../../components/Input/InputRight";
import * as yup from "yup";

export default function Account(props) {
  const userSchema = yup.object({
    name: yup.string().required(),
    username: yup.string().required(),
    email: yup.string().email().required(),
    phone_number: yup
      .string()
      .required()
      .matches(
        /628\d{9,10}$/,
        "phone_number is must indonesian phone number format"
      ),
    password: yup
      .string()
      .required()
      .min(8)
      .max(15)
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,15}$/s,
        "password is must contain capital, lower, number, dan symbol"
      ),
    confirm_password: yup
      .string()
      .required()
      .min(8)
      .max(15)
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,15}$/s,
        "confirm_password is must contain capital, lower, number, dan symbol"
      )
      .oneOf(
        [yup.ref("password")],
        "confirm_password must be same as value on password"
      ),
  });
  const [errorsMessage, setErrorsMessage] = useState({
    name: null,
    username: null,
    email: null,
    phone_number: null,
    password: null,
    confirm_password: null,
  });
  return (
    <View>
      <View
        style={{
          flex: 1,
          justifyContent: "space-around",
          alignItems: "center",
          minWidth: "100%",
          maxWidth: "50%",
        }}
      >
        <Text style={{ fontSize: 20, textAlign: "center" }}>Account</Text>
        <View style={{ width: "100%" }}>
          <TextInput
            style={{ backgroundColor: "#fff" }}
            placeholder="Please enter your name"
            mode="outlined"
            label="Name"
            value={props.user.name}
            onChangeText={(e) => props.handleOnChange(e, "name", props.setUser)}
          />
          <HelperText type="error" visible={errorsMessage.name !== null}>
            {errorsMessage?.name}
          </HelperText>
        </View>
        <View style={{ width: "100%" }}>
          <TextInput
            style={{ backgroundColor: "#fff" }}
            placeholder="Please enter your username"
            mode="outlined"
            label="Username"
            value={props.user.username}
            onChangeText={(e) =>
              props.handleOnChange(e, "username", props.setUser)
            }
          />
          <HelperText type="error" visible={errorsMessage.username !== null}>
            {errorsMessage?.username}
          </HelperText>
        </View>
        <View style={{ width: "100%" }}>
          <TextInput
            style={{ backgroundColor: "#fff" }}
            placeholder="Please enter your email"
            mode="outlined"
            label="Email"
            value={props.user.email}
            onChangeText={(e) =>
              props.handleOnChange(e, "email", props.setUser)
            }
          />
          <HelperText type="error" visible={errorsMessage.email !== null}>
            {errorsMessage?.email}
          </HelperText>
        </View>
        <View style={{ width: "100%" }}>
          <TextInput
            style={{ backgroundColor: "#fff" }}
            placeholder="Please enter phone number"
            mode="outlined"
            label="phone number"
            value={props.user.phone_number}
            onChangeText={(e) =>
              props.handleOnChange(e, "phone_number", props.setUser)
            }
          />
          <HelperText type="error" visible={errorsMessage.name !== null}>
            {errorsMessage?.phone_number}
          </HelperText>
        </View>
        <InputPassword
          title="Password"
          handleChange={props.handleOnChange}
          stateFn={props.setUser}
          value={props.user.password}
          error={errorsMessage.password !== null}
          errorMessage={errorsMessage.password}
        />
        <InputPassword
          title="Confirm Password"
          handleChange={props.handleOnChange}
          stateFn={props.setUser}
          value={props.user.confirm_password}
          error={errorsMessage.confirm_password !== null}
          errorMessage={errorsMessage.confirm_password}
        />
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            width: "100%",
            rowGap: 5,
            marginBottom: 10,
          }}
        >
          <Button
            style={{
              borderRadius: 5,
            }}
            icon="account-question"
            mode="elevated"
            onPress={async () => {
              try {
                await userSchema.validate(
                  { ...props.user },
                  { abortEarly: false }
                );
                await props.checkAvailabilityUser();
              } catch (error) {
                setErrorsMessage({
                  name: null,
                  username: null,
                  email: null,
                  phone_number: null,
                  password: null,
                  confirm_password: null,
                });
                error.errors.map((err) => {
                  const key = err.match(/(\w{1,})\ /);
                  setErrorsMessage((prevState) => ({
                    ...prevState,
                    [key[1]]: err,
                  }));
                });
              }
            }}
          >
            Check Available User
          </Button>
        </View>
      </View>
    </View>
  );
}
