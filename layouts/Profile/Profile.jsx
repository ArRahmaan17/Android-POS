import React, { ScrollView, StyleSheet } from "react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Icon,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { phone_number } from "../../helpers/TextHelper";
import { CONFIG } from "../../config";
export default function Profile({ navigation }) {
  const theme = useTheme();
  const [confirmDelete, setConfirmDelete] = useState();
  const [me, setMe] = useState({});
  useEffect(() => {
    (async () => {
      setMe(JSON.parse(await SecureStore.getItemAsync(CONFIG.STORAGE.USER)));
    })();
  }, [me]);
  return (
    <ScrollView>
      <SafeAreaView>
        <View style={styles.container}>
          <Card
            onPress={() => {
              navigation.navigate("ProfileUser");
            }}
            style={{
              ...styles.card,
              backgroundColor: theme.colors.inverseOnSurface,
              marginBottom: 10,
            }}
          >
            <Card.Content style={styles.cardContent}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  columnGap: 10,
                }}
              >
                <TouchableRipple
                  borderless={true}
                  style={{
                    ...styles.imageContainer,
                    borderColor: theme.colors.secondary,
                    borderWidth: 2,
                  }}
                >
                  <Avatar.Image
                    source={
                      !me.user?.profile_picture
                        ? require("../../assets/0.jpg")
                        : { uri: me.user?.profile_picture }
                    }
                  />
                </TouchableRipple>
                <View>
                  <Text style={{ textTransform: "capitalize" }}>
                    {me.user?.name}
                  </Text>
                  <Text style={{ color: theme.colors.secondary, fontSize: 11 }}>
                    {phone_number(me.user?.phone_number)}
                  </Text>
                </View>
              </View>
              <View>
                <Icon source="chevron-right" size={20} />
              </View>
            </Card.Content>
          </Card>
          {me?.company?.name &&
            ["Developer", "Manager"].includes(me.role?.name) && (
              <View>
                <Card
                  onPress={() => {
                    navigation.navigate("ProfileCompany");
                  }}
                  style={{
                    ...styles.card,
                    backgroundColor: theme.colors.warningContainer,
                    borderColor: theme.colors.warning,
                    borderWidth: 2,
                    marginBottom: 10,
                  }}
                >
                  <Card.Content style={styles.cardContent}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        flexWrap: "wrap",
                        alignItems: "center",
                        columnGap: 10,
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          minWidth: "100%",
                          fontWeight: "bold",
                        }}
                      >
                        Administrator User Only
                      </Text>
                      <TouchableRipple
                        borderless={true}
                        style={{
                          ...styles.imageContainer,
                          borderColor: theme.colors.secondary,
                          borderWidth: 2,
                        }}
                      >
                        <Avatar.Image
                          source={
                            !me.company?.picture
                              ? require("../../assets/0.jpg")
                              : {
                                  uri: me.company?.picture,
                                }
                          }
                        />
                      </TouchableRipple>
                      <View>
                        <Text style={{ textTransform: "capitalize" }}>
                          {me.company.name}
                        </Text>
                        <Text
                          style={{
                            color: theme.colors.secondary,
                            fontSize: 11,
                          }}
                        >
                          {phone_number(me.company.phone_number)}
                        </Text>
                      </View>
                    </View>
                    <View>
                      <Icon source="chevron-right" size={20} />
                    </View>
                  </Card.Content>
                </Card>
              </View>
            )}
          <Card
            style={{
              ...styles.dangerCard,
              backgroundColor: theme.colors.errorContainer,
            }}
          >
            <Card.Title title="Danger Area" titleStyle={{ color: "red" }} />
            <Card.Content>
              <Button
                style={styles.dangerBtn}
                mode="elevated"
                buttonColor={theme.colors.warningContainer}
                textColor="black"
              >
                Change Password
              </Button>
              <Button
                style={styles.dangerBtn}
                mode="elevated"
                buttonColor={theme.colors.warningContainer}
                textColor="black"
              >
                Change Access Pin
              </Button>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <Checkbox
                  status={confirmDelete ? "checked" : "unchecked"}
                  onPress={() => setConfirmDelete(!confirmDelete)}
                />
                <Text>I confirm my account deactivation</Text>
              </View>
              <Button
                style={styles.dangerBtn}
                mode="elevated"
                buttonColor={theme.colors.error}
                textColor="white"
                disabled={!confirmDelete}
              >
                Delete Account
              </Button>
            </Card.Content>
          </Card>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    paddingHorizontal: 23,
  },
  card: {
    marginTop: 16,
    borderRadius: 12,
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 10,
    paddingHorizontal: 5,
    paddingVertical: 5,
    marginHorizontal: 0,
  },
  dangerCard: {
    borderRadius: 12,
    borderColor: "red",
    borderWidth: 2,
    marginTop: 16,
  },
  imageContainer: {
    justifyContent: "center",
    flexDirection: "row",
    marginVertical: 5,
    borderRadius: 50,
    objectFit: "fill",
    width: 50,
    height: 50,
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
  saveButton: {
    marginTop: 10,
  },
  dangerBtn: {
    marginTop: 10,
  },
});
