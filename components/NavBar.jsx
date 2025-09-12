import React, { useEffect, useState } from "react";
import { FlatList, Image, Pressable, View } from "react-native";
import {
  Card,
  Icon,
  IconButton,
  Modal,
  Portal,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import { buatSingkatan } from "../helpers/TextHelper";
import { CONFIG } from "../config";
import * as SecureStore from "expo-secure-store";
import { downloadOrCahceFile, httpHelper } from "../helpers/HttpHelper";
import { useNavigation } from "@react-navigation/native";
export default function NavBar() {
  const theme = useTheme();
  const navigation = useNavigation();
  const [companyUser, setCompanyUser] = useState([]);
  const [user, setUser] = useState(
    JSON.parse(SecureStore.getItem(CONFIG.STORAGE.USER))
  );
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const CompanyItem = ({ data }) => {
    return (
      <Pressable
        style={{
          flex: 1,
          flexDirection: "column",
        }}
      >
        <Image
          source={{
            uri: data.item.picture,
          }}
          style={{
            height: 150,
            maxWidth: "100%",
            marginTop: 10,
            borderRadius: 16,
            resizeMode: "cover",
            borderTopColor: theme.colors.onPrimaryContainer,
            borderRightColor: theme.colors.onPrimaryContainer,
            borderLeftColor: theme.colors.onPrimaryContainer,
            borderBottomColor: theme.colors.elevation.level0,
            borderWidth: 2,
          }}
        />
        <View
          style={{
            marginTop: -69.5,
            paddingHorizontal: 20,
            paddingVertical: 5,
            borderBottomRightRadius: 16,
            borderBottomLeftRadius: 16,
            borderBottomColor: theme.colors.onPrimaryContainer,
            borderRightColor: theme.colors.onPrimaryContainer,
            borderLeftColor: theme.colors.onPrimaryContainer,
            borderTopColor: theme.colors.elevation.level0,
            borderWidth: 2,
            backgroundColor: theme.colors.elevation.level5,
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text variant="titleMedium">{data.item.name}</Text>
            <Text variant="labelSmall">{data.item.type.name}</Text>
            <Text variant="bodySmall" style={{ textWrap: "wrap" }}>
              {data.item.address.place}, {data.item.address.address},{" "}
              {data.item.address.city}, {data.item.address.province},{" "}
              {data.item.address.zipCode}
            </Text>
          </View>
          <View>
            <IconButton
              rippleColor={theme.colors.primaryContainer}
              disabled={user?.company?.id === data.item.id}
              mode="elevated"
              containerColor={theme.colors.onPrimary}
              onPress={() => {
                selectCompany(data);
              }}
              icon={
                user?.company?.id === data.item.id
                  ? "chevron-left"
                  : "chevron-right"
              }
              compact={true}
            />
          </View>
        </View>
      </Pressable>
    );
  };
  async function getCompanyUser() {
    hideModal();
    let resultCompanyUser = await httpHelper("GET", "auth/customer-companies");
    resultCompanyUser.data.data.forEach(async (company, index) => {
      resultCompanyUser.data.data[index].picture = await downloadOrCahceFile(
        CONFIG.API.ASSET_BASE_URL +
          "/" +
          CONFIG.FILE_SYSTEM.COMPANY_PICTURE_CACHE +
          "/" +
          company.picture,
        CONFIG.FILE_SYSTEM.COMPANY_PICTURE_CACHE,
        company.picture
      );
    });
    setCompanyUser(resultCompanyUser.data.data);
    setTimeout(() => {
      showModal();
    }, 1000);
  }
  async function selectCompany(data) {
    let userUpdate = null;
    try {
      await SecureStore.deleteItemAsync(CONFIG.STORAGE.USER);
      await SecureStore.setItemAsync(
        CONFIG.STORAGE.USER,
        JSON.stringify({ ...user, company: data.item })
      );
      userUpdate = await SecureStore.getItemAsync(CONFIG.STORAGE.USER);
    } catch (error) {
      console.log("ERROR SELECT COMPANY", error);
    }
    hideModal();
    setUser(JSON.parse(userUpdate));
  }
  useEffect(() => {
    if (!user.company) {
      getCompanyUser();
    }
  }, []);
  return (
    <View>
      <Portal>
        <Modal
          visible={visible}
          dismissable={user.company ? true : false}
          onDismiss={() => {
            if (user.company) {
              hideModal();
            }
          }}
          contentContainerStyle={{
            backgroundColor: theme.colors.inverseOnSurface,
            padding: 20,
            height: "max-content",
            borderRadius: 12,
            marginHorizontal: 10,
          }}
        >
          <Text variant="titleMedium">
            {user?.company ? "Ganti Perusahaan" : "Pilih Perusahaan"}
          </Text>
          <FlatList
            data={companyUser}
            renderItem={(item) => <CompanyItem data={item} />}
            keyExtractor={(item) => item.id}
          />
        </Modal>
      </Portal>
      <Card
        style={{
          elevation: 2,
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          backgroundColor: theme.colors.primaryContainer,
        }}
      >
        <Card.Content
          style={{
            flexDirection: "row",
            justifyContent: "center",
            columnGap: 10,
            alignItems: "center",
          }}
        >
          <TouchableRipple
            borderless={true}
            rippleColor={theme.colors.primaryContainer}
            onPress={() => {
              navigation.navigate("ProfileUser");
            }}
            style={{ flexGrow: 1 }}
          >
            <Text variant="labelSmall" style={{ textTransform: "capitalize" }}>
              {user?.user?.name?.replace(/\ [\a-zA-z]{0,}/s, "")}
            </Text>
          </TouchableRipple>
          <Text
            variant="titleLarge"
            style={{ fontVariant: "bold", flexGrow: 1 }}
          >
            {CONFIG.APP.NAME}
          </Text>
          <TouchableRipple
            borderless={true}
            rippleColor={theme.colors.primaryContainer}
            onLongPress={() => {
              getCompanyUser();
            }}
            onPress={() => {
              navigation.navigate("ProfileCompany");
            }}
            style={{ padding: 0, margin: 0 }}
          >
            <View
              style={{
                textTransform: "capitalize",
                flexGrow: 1,
                flex: 1,
                flexDirection: "row",
                justifyContent: "start",
                padding: 0,
                margin: 0,
                alignItems: "center",
              }}
            >
              <Text variant="labelSmall" style={{ textAlign: "right" }}>
                {buatSingkatan(user?.company?.name || "")}
              </Text>
              <Icon source="chevron-right" size={20} />
            </View>
          </TouchableRipple>
        </Card.Content>
      </Card>
    </View>
  );
}
