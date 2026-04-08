import { useEffect, useState } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/native/src/__stubs__/createStackNavigator";
import Login from "./Login";
import Register from "./Register/Register";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Toast, {
  ErrorToast,
  SuccessToast,
  InfoToast,
} from "react-native-toast-message";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import * as SecureStore from "expo-secure-store";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import Home from "./Home";
import Splash from "./Splash";
import Sales from "./Sales";
import Profile from "./Profile/Profile";
import ProfileUser from "./Profile/ProfileUser";
import ProfileCompany from "./Profile/ProfileCompany";
import Product from "./Product/Product";
import ChangeProduct from "./Product/ChangeProduct";
import { BlurView } from "expo-blur";
import { CONFIG } from "../config";
import UnderMaintenance from "./UnderMaintenance";

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
  info: (props) => (
    <InfoToast
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
const theme = {
  ...DefaultTheme,
  colors: {
    primary: "rgb(71, 72, 221)",
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(225, 224, 255)",
    onPrimaryContainer: "rgb(7, 0, 108)",
    secondary: "rgb(0, 104, 116)",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(151, 240, 255)",
    onSecondaryContainer: "rgb(0, 31, 36)",
    tertiary: "rgb(0, 107, 94)",
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(118, 248, 226)",
    onTertiaryContainer: "rgb(0, 32, 27)",
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    background: "rgb(255, 255, 255)",
    onBackground: "rgb(28, 27, 31)",
    surface: "rgb(255, 251, 255)",
    onSurface: "rgb(28, 27, 31)",
    surfaceVariant: "rgb(228, 225, 236)",
    onSurfaceVariant: "rgb(71, 70, 79)",
    outline: "rgb(119, 118, 128)",
    outlineVariant: "rgb(200, 197, 208)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(49, 48, 52)",
    inverseOnSurface: "rgb(243, 239, 244)",
    inversePrimary: "rgb(192, 193, 255)",
    elevation: {
      level0: "transparent",
      level1: "rgba(246, 242, 253, 0.2)",
      level2: "rgba(240, 237, 252, 0.3)",
      level3: "rgba(235, 231, 251, 0.5)",
      level4: "rgba(233, 230, 251, 0.7)",
      level5: "rgba(229, 226, 250, 0.9)",
    },
    surfaceDisabled: "rgba(28, 27, 31, 0.12)",
    onSurfaceDisabled: "rgba(28, 27, 31, 0.38)",
    backdrop: "rgba(48, 48, 56, 0.4)",
    success: "rgb(42, 108, 0)",
    onSuccess: "rgb(255, 255, 255)",
    successContainer: "rgb(142, 252, 84)",
    onSuccessContainer: "rgb(8, 33, 0)",
    info: "rgb(0, 99, 154)",
    onInfo: "rgb(255, 255, 255)",
    infoContainer: "rgb(206, 229, 255)",
    onInfoContainer: "rgb(0, 29, 50)",
    warning: "rgb(130, 85, 0)",
    onWarning: "rgb(255, 255, 255)",
    warningContainer: "rgb(255, 221, 179)",
    onWarningContainer: "rgb(41, 24, 0)",
  },
};

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTab() {
  const token = SecureStore.getItem(CONFIG.STORAGE.TOKEN);
  const navigation = useNavigation();
  if (!token) {
    navigation.replace("Login");
  }
  return (
    <Tab.Navigator
      initialRouteName="Home"
      detachInactiveScreens={true}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Profile":
              iconName = focused ? "cog" : "cog-outline";
              break;
            case "Products":
              iconName = focused ? "library" : "library-outline";
              break;
            case "Reports":
              iconName = focused ? "documents" : "documents-outline";
              break;
            case "Sales":
              iconName = focused ? "wallet" : "wallet-outline";
              break;

            default:
              break;
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
              style={[
                focused
                  ? { transform: [{ scale: 1.2 }] }
                  : { transform: [{ scale: 0.8 }] },
              ]}
            />
          );
        },
        tabBarActiveTintColor: theme.colors.primary,
        headerShown: false,
        tabBarInactiveTintColor: theme.colors.backdrop,
        tabBarBackground: () => (
          <BlurView
            intensity={0.5}
            style={{
              flex: 1,
              backgroundColor: theme.colors.background,
            }}
          />
        ),
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Sales" component={Sales} />
      <Tab.Screen name="Products" component={Product} />
      <Tab.Screen name="Reports" component={Home} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
function RootStack() {
  return (
    <Stack.Navigator initialRouteName={"Splash"} id="navigation">
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="UnderMaintenance" component={UnderMaintenance} />
      <Stack.Screen name="Main" component={HomeTab} />
      <Stack.Screen name="ProfileUser" component={ProfileUser} />
      <Stack.Screen name="ProfileCompany" component={ProfileCompany} />
      <Stack.Screen name="ChangeProduct" component={ChangeProduct} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <RootStack />
        <Toast
          config={configToast}
          position="bottom"
          topOffset={0}
          bottomOffset={80}
          leftOffset={10}
          rightOffset={10}
          visibilityTime={1000}
        />
      </NavigationContainer>
    </PaperProvider>
  );
}
