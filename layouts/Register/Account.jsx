import { Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import React from "react";
import { Formik } from "formik";
import InputPassword from "../../components/InputPassword";

export default function Account(props) {
  return (
    <>
      <View
        style={{
          flex: 1,
          maxHeight: "100%",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Text style={{ fontSize: 35, textAlign: "center" }}>Account</Text>
        <View style={{ marginBottom: 10, width: "100%" }}>
          <TextInput
            autoFocus={true}
            placeholder="Please enter your name"
            mode="outlined"
            label="Name"
            value={props.user.name}
            left={<TextInput.Icon icon="account" />}
            onChangeText={(e) => props.handleOnChange(e, "name", props.setUser)}
          />
        </View>
        <View style={{ marginBottom: 10, width: "100%" }}>
          <TextInput
            placeholder="Please enter your username"
            mode="outlined"
            label="Username"
            value={props.user.username}
            left={<TextInput.Icon icon="account-key" />}
            onChangeText={(e) =>
              props.handleOnChange(e, "username", props.setUser)
            }
          />
        </View>
        <View style={{ marginBottom: 10, width: "100%" }}>
          <TextInput
            placeholder="Please enter your email"
            mode="outlined"
            label="Email"
            value={props.user.email}
            left={<TextInput.Icon icon="email" />}
            onChangeText={(e) =>
              props.handleOnChange(e, "email", props.setUser)
            }
          />
        </View>
        <View style={{ marginBottom: 10, width: "100%" }}>
          <TextInput
            placeholder="Please enter your phone number"
            mode="outlined"
            label="Phone number"
            value={props.user.phone_number}
            left={<TextInput.Icon icon="phone" />}
            onChangeText={(e) =>
              props.handleOnChange(e, "phone_number", props.setUser)
            }
          />
        </View>
        <InputPassword
          title="Password"
          handleChange={props.handleOnChange}
          stateFn={props.setUser}
          value={props.user.password}
        />
        <InputPassword
          title="Confirm Password"
          handleChange={props.handleOnChange}
          stateFn={props.setUser}
          value={props.user.confirm_password}
        />
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            width: "100%",
            rowGap: 5,
          }}
        >
          <Button
            style={{
              borderRadius: 5,
            }}
            icon="account-question"
            mode="contained"
            onPress={() => props.checkAvailabilityUser()}
          >
            Check Available User
          </Button>
        </View>
      </View>
    </>
    // <Formik initialValues={props.user} onSubmit={props.checkAvailabilityUser}>
    //   {({ handleChange, handleBlur, handleSubmit, values }) => (

    //   )}
    // </Formik>
  );
}
