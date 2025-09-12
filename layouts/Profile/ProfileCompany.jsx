import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { TextInput, Button, useTheme, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import { handleChange, httpHelper } from "../../helpers/HttpHelper";
import { CONFIG, log } from "../../config";
import BusinessTypeDropdown from "../../components/Dropdown/BusinessTypeDropdown";

export default function ProfileCompany({ navigation }) {
  const theme = useTheme();
  const [company, setCompany] = useState({
    businessId: "",
    business_name: "",
    contact_number: "",
    email: "",
    building: "",
    address: "",
    city: "",
    province: "",
    postal_code: "",
    picture: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const pickLogo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaType: "photo",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        selectionLimit: 1,
      });

      if (!result.didCancel && result.assets?.length > 0) {
        const asset = result.assets[0];
        setCompany((prevState) => ({
          ...prevState,
          logo: {
            uri: asset.uri,
            fileName: asset.fileName || "company_logo.jpg",
            mimeType: asset.mimeType || "image/jpeg",
          },
        }));
        log("Logo selected:", asset);
      }
    } catch (error) {
      log("Error picking logo:", error, "error");
      setError("Failed to select logo. Please try again.");
    }
  };

  const refreshLogo = () => {
    setCompany((prevState) => ({
      ...prevState,
      logo: null,
    }));
    log("Logo refreshed");
  };

  const [businessTypes, setBusinessTypes] = useState();

  const loadCompanyData = async () => {
    try {
      const userData = await SecureStore.getItemAsync(CONFIG.STORAGE.USER);
      if (userData) {
        const userLogged = JSON.parse(userData);
        console.log("Company data:", userLogged.company);
        if (userLogged.company) {
          setCompany({
            businessId: userLogged.company.businessId || "",
            business_name: userLogged.company.name || "",
            contact_number: userLogged.company.phone_number || "",
            email: userLogged.company.email || "",
            place: userLogged.company.address.place || "",
            address: userLogged.company.address.address || "",
            city: userLogged.company.address.city || "",
            province: userLogged.company.address.province || "",
            postal_code: userLogged.company.address.zipCode || "",
            picture: userLogged.company.picture || null,
          });
        }
      }
    } catch (error) {
      console.error("Error loading company data:", error);
    }
  };

  const updateCompanyProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      let companyData = new FormData();
      companyData.append("businessId", company.businessId);
      companyData.append("business_name", company.business_name);
      companyData.append("contact_number", company.contact_number);
      companyData.append("email", company.email);
      companyData.append("building", company.building);
      companyData.append("address", company.address);
      companyData.append("city", company.city);
      companyData.append("province", company.province);
      companyData.append("postal_code", company.postal_code);
      if (company.logo && company.logo.uri) {
        companyData.append("logo", {
          uri: company.logo.uri,
          type: company.logo.mimeType || "image/jpg",
          name: company.logo.fileName || "company_logo.jpg",
        });
      }

      log(["Updating company profile with data:", companyData]);
      let result = await httpHelper(
        "POST",
        "company/update-profile",
        companyData,
        {
          "Content-Type": "multipart/form-data",
        }
      );

      if (result.code === 200) {
        log("Company profile updated successfully");
        // Update stored company data
        const userData = await SecureStore.getItemAsync(CONFIG.STORAGE.USER);
        if (userData) {
          const userLogged = JSON.parse(userData);
          userLogged.company = { ...userLogged.company, ...company };
          await SecureStore.setItemAsync(
            CONFIG.STORAGE.USER,
            JSON.stringify(userLogged)
          );
        }
      } else {
        setError(result.data?.message || "Failed to update company profile");
      }
    } catch (error) {
      log("Error updating company profile:", error, "error");
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
      navigation.goBack();
    }
    setTimeout(() => {
      setLoading(false);
      navigation.goBack();
    }, 5000);
  };

  useEffect(() => {
    loadCompanyData();
    (async () => {
      let dataCompanyType = await httpHelper("GET", "auth/company-types");
      setBusinessTypes(dataCompanyType.data.data);
    })();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <SafeAreaView style={styles.safeArea}>
          <View>
            <View style={styles.cardContent}>
              <View style={styles.logoSection}>
                <View style={styles.logoContainer}>
                  {company.picture ? (
                    <Image
                      source={{ uri: company.picture }}
                      style={styles.logoImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.placeholderContainer}>
                      <Text style={styles.placeholderIcon}>🏢</Text>
                      <Text style={styles.placeholderText}>Company Logo</Text>
                    </View>
                  )}
                </View>
                <View style={styles.logoButtons}>
                  <Button
                    mode="contained"
                    buttonColor={theme.colors.primary}
                    textColor="white"
                    icon="upload"
                    onPress={pickLogo}
                    style={styles.uploadButton}
                  >
                    Upload
                  </Button>
                  <Button
                    mode="outlined"
                    buttonColor="transparent"
                    textColor={theme.colors.primary}
                    icon="refresh"
                    onPress={refreshLogo}
                    style={styles.refreshButton}
                  >
                    Refresh
                  </Button>
                </View>
                <Text style={styles.uploadText}>
                  Allowed JPG, PNG. Max size of 800K
                </Text>
              </View>

              <View style={styles.formSection}>
                <BusinessTypeDropdown
                  value={company.businessId}
                  onSelect={(value) =>
                    handleChange(value, "businessId", setCompany)
                  }
                  options={businessTypes}
                  placeholder="Select business type"
                />
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    outlineColor={theme.colors.primary}
                    outlineStyle={{ borderWidth: 2 }}
                    value={company.business_name}
                    onChangeText={(e) =>
                      handleChange(e, "business_name", setCompany)
                    }
                    mode="outlined"
                    label="Business Name"
                    placeholder="Enter business name"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    outlineColor={theme.colors.primary}
                    outlineStyle={{ borderWidth: 2 }}
                    value={company.contact_number}
                    onChangeText={(e) =>
                      handleChange(e, "contact_number", setCompany)
                    }
                    mode="outlined"
                    label="Contact Number"
                    placeholder="Enter contact number"
                    keyboardType="phone-pad"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    outlineColor={theme.colors.primary}
                    outlineStyle={{ borderWidth: 2 }}
                    value={company.email}
                    onChangeText={(e) => handleChange(e, "email", setCompany)}
                    mode="outlined"
                    placeholder="Enter email address"
                    label="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    outlineColor={theme.colors.primary}
                    outlineStyle={{ borderWidth: 2 }}
                    value={company.place}
                    onChangeText={(e) => handleChange(e, "place", setCompany)}
                    mode="outlined"
                    label="Building"
                    placeholder="Enter building name"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    outlineColor={theme.colors.primary}
                    outlineStyle={{ borderWidth: 2 }}
                    value={company.address}
                    onChangeText={(e) => handleChange(e, "address", setCompany)}
                    mode="outlined"
                    placeholder="Enter address"
                    label="Address"
                    numberOfLines={4}
                    multiline={true}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    outlineColor={theme.colors.primary}
                    outlineStyle={{ borderWidth: 2 }}
                    value={company.city}
                    onChangeText={(e) => handleChange(e, "city", setCompany)}
                    mode="outlined"
                    label="City"
                    placeholder="Enter city"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    outlineColor={theme.colors.primary}
                    outlineStyle={{ borderWidth: 2 }}
                    value={company.province}
                    onChangeText={(e) =>
                      handleChange(e, "province", setCompany)
                    }
                    mode="outlined"
                    label="Province"
                    placeholder="Enter province"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    outlineColor={theme.colors.primary}
                    outlineStyle={{ borderWidth: 2 }}
                    value={company.postal_code}
                    onChangeText={(e) =>
                      handleChange(e, "postal_code", setCompany)
                    }
                    mode="outlined"
                    placeholder="Enter postal code"
                    label="Postal / Zip Code"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {error && <Text style={styles.errorText}>{error}</Text>}

              <Button
                mode="contained"
                buttonColor={theme.colors.infoContainer}
                textColor="black"
                icon="content-save"
                onPress={updateCompanyProfile}
                loading={loading}
                disabled={loading}
                style={[
                  styles.saveButton,
                  { borderColor: theme.colors.primary, borderWidth: 2 },
                ]}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingVertical: 0,
    paddingHorizontal: 10,
    marginTop: 16,
  },
  cardContent: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#dee2e6",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  placeholderContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  logoButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
    justifyContent: "center",
  },
  uploadButton: {
    borderRadius: 8,
    minWidth: 100,
  },
  refreshButton: {
    borderRadius: 8,
    borderColor: "#666",
    minWidth: 100,
  },
  uploadText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  formSection: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "white",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 16,
    fontSize: 14,
  },
  saveButton: {
    borderRadius: 8,
    paddingVertical: 1,
  },
});
