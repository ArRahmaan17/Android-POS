import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  TextInput,
  Button,
  useTheme,
  TouchableRipple,
  Avatar,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import {
  downloadOrCacheFile,
  handleChange,
  httpHelper,
} from "../../helpers/HttpHelper";
import InputRight from "../../components/Input/InputRight";
import { CONFIG, log } from "../../config";
import * as FileSystem from "expo-file-system";

export default function ProfileUser({ navigation }) {
  const theme = useTheme();
  const [user, setUser] = useState({
    name: null,
    username: null,
    email: null,
    phone_number: null,
    role: null,
    profile_picture: null,
    affiliate_code: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaType: "photo",
        selectionLimit: 1,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      console.log(result.assets[0]);
      if (!result.didCancel && result.assets?.length > 0) {
        setUser((prevState) => ({
          ...prevState,
          profile_picture: result.assets[0],
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getUser = async function () {
    try {
      let result = await httpHelper("GET", "auth/me");
      log("User data fetched:", result);
      return result;
    } catch (error) {
      log("Error fetching user data:", error, "error");
    }
  };
  const updateProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      let userData = new FormData();
      userData.append("name", user.name);
      userData.append("phone_number", user.phone_number);
      userData.append("username", user.username);
      userData.append("email", user.email);
      if (user.profile_picture && user.profile_picture.uri) {
        userData.append("profile_picture", {
          uri: user.profile_picture.uri,
          type: user.profile_picture.mimeType || "image/jpg",
          name:
            user.profile_picture.fileName ||
            CONFIG.DEFAULT.FILE_SYSTEM.PROFILE_PICTURE,
        });
      }

      let result = await httpHelper(
        "POST",
        "customer-user/update-profile",
        userData,
        {
          "Content-Type": "multipart/form-data",
        }
      );
      if (result.code === 200) {
        log("Profile updated successfully");
        let updatedUser = await getUser();
        const loggedUser = {
          ...JSON.parse(await SecureStore.getItemAsync(CONFIG.STORAGE.USER)),
        };
        if (updatedUser.user.profile_picture) {
          updatedUser.user.profile_picture = await downloadOrCacheFile(
            CONFIG.API.ASSET_BASE_URL +
              "/" +
              CONFIG.FILE_SYSTEM.CACHE.PROFILE_PICTURE_CACHE +
              "/" +
              updatedUser.user.profile_picture,
            CONFIG.FILE_SYSTEM.CACHE.PROFILE_PICTURE_CACHE,
            updatedUser.user.profile_picture
          );
        }
        updatedUser = { ...updatedUser.data, ...loggedUser.company };
        await SecureStore.deleteItemAsync(CONFIG.STORAGE.USER);
        await SecureStore.setItemAsync(
          CONFIG.STORAGE.USER,
          JSON.stringify(updatedUser)
        );
      } else {
        setError(result.data?.message || "Failed to update profile");
      }
    } catch (error) {
      log("Error updating profile:", error, "error");
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
      navigation.goBack();
    }
  };
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await SecureStore.getItemAsync(CONFIG.STORAGE.USER);
        if (userData) {
          const userLogged = JSON.parse(userData);

          console.log("userLogged", userLogged);
          setUser({
            name: userLogged.user.name,
            email: userLogged.user.email,
            username: userLogged.user.username,
            phone_number: userLogged.user.phone_number,
            role: userLogged.role.name,
            profile_picture: userLogged.user.profile_picture,
            affiliate_code: userLogged.user.affiliate_code,
          });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    loadUserData();
  }, []);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flex: 1,
      }}
    >
      <ScrollView>
        <View style={styles.container}>
          <SafeAreaView>
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <TouchableRipple
                  borderless={true}
                  onPress={pickImage}
                  style={{
                    ...styles.imageContainer,
                    borderColor: theme.colors.primary,
                    borderWidth: 2,
                  }}
                >
                  <Avatar.Image
                    size={100}
                    source={
                      typeof user.profile_picture === "string" &&
                      typeof user.profile_picture !== Object
                        ? { uri: user.profile_picture }
                        : user.profile_picture &&
                          typeof user.profile_picture === Object
                        ? { uri: user.profile_picture.uri }
                        : ""
                    }
                  />
                </TouchableRipple>
                <TextInput
                  outlineColor={theme.colors.primary}
                  outlineStyle={{ borderWidth: 2 }}
                  label="Name"
                  value={user.name}
                  onChangeText={(e) => {
                    handleChange(e, "name", setUser);
                  }}
                  mode="outlined"
                  style={styles.input}
                />
                <TextInput
                  outlineColor={theme.colors.primary}
                  outlineStyle={{ borderWidth: 2 }}
                  label="Phone Number"
                  value={user.phone_number}
                  onChangeText={(e) => {
                    handleChange(e, "phone_number", setUser);
                  }}
                  mode="outlined"
                  style={styles.input}
                />
                <TextInput
                  outlineColor={theme.colors.primary}
                  outlineStyle={{ borderWidth: 2 }}
                  label="Username"
                  value={user.username}
                  onChangeText={(e) => {
                    handleChange(e, "username", setUser);
                  }}
                  mode="outlined"
                  style={styles.input}
                />
                <TextInput
                  outlineColor={theme.colors.primary}
                  outlineStyle={{ borderWidth: 2 }}
                  label="Email"
                  value={user.email}
                  onChangeText={(e) => {
                    handleChange(e, "email", setUser);
                  }}
                  mode="outlined"
                  style={styles.input}
                />
                <TextInput
                  outlineColor={theme.colors.primary}
                  outlineStyle={{ borderWidth: 2 }}
                  label="Role"
                  value={user.role}
                  mode="outlined"
                  editable={false}
                  style={styles.input}
                />
                <InputRight
                  title="Affiliate Code"
                  value={user.affiliate_code}
                  handleChange={handleChange}
                  stateFn={setUser}
                  borderWidth
                  readOnly={true}
                />
                {error && (
                  <Text
                    style={{
                      color: "red",
                      marginBottom: 5,
                      textAlign: "center",
                    }}
                  >
                    {error}
                  </Text>
                )}
                <Button
                  mode="contained"
                  buttonColor={theme.colors.infoContainer}
                  textColor="black"
                  onPress={updateProfile}
                  loading={loading}
                  disabled={loading}
                  style={{
                    borderColor: theme.colors.primary,
                    borderWidth: 2,
                    borderRadius: 8,
                  }}
                >
                  {loading ? "Saving..." : "Save Profile"}
                </Button>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 23,
    backgroundColor: "#f9f9f9",
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
  },
  cardContent: {
    paddingHorizontal: 0,
    marginHorizontal: 0,
  },
  input: {
    marginBottom: 10,
    backgroundColor: "#fff",
    outlineColor: "indigo",
  },
  imageContainer: {
    justifyContent: "center",
    alignSelf: "center",
    flexDirection: "row",
    marginVertical: 5,
    borderRadius: 50,
    width: 100,
    height: 100,
  },
  image: {
    borderRadius: 50,
    backgroundColor: "#000",
  },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
