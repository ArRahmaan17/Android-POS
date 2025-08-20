import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/native/src/__stubs__/createStackNavigator";
import Login from "./Login";
import Register from "./Register/Register";
import Toast, { ErrorToast, SuccessToast } from "react-native-toast-message";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";

const configToast = {
  success: (props) => (
    <SuccessToast
      {...props}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 12,
        wordWrap: "break-word",
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 12,
        wordWrap: "break-word",
      }}
    />
  ),
};
const styles = StyleSheet.create({
  col: {
    flex: 1,
    height: "100%",
    flexDirection: "column",
    width: "100%",
  },
  row: {
    flexDirection: "row",
    flex: 1,
    height: "100%",
    width: "100%",
  },
});
const theme = {
  ...DefaultTheme,
};
const LoginScreen = () => {
  return <Login />;
};

const RegisterScreen = () => {
  return <Register />;
};

function HomeScreen() {
  return (
    <View style={styles.row}>
      <Text>Home</Text>
    </View>
  );
}

const Stack = createStackNavigator();

function RootStack({ validToken, JwtToken }) {
  return (
    <Stack.Navigator
      initialRouteName={validToken && JwtToken !== "" ? "Home" : "Login"}
      id="navigation"
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [jwtToken, setJwtToken] = useState("");
  const [validToken, setValidToken] = useState(false);
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <RootStack validToken={validToken} setValidToken={setValidToken} />
        <Toast config={configToast} />
      </NavigationContainer>
    </PaperProvider>
  );
}
