import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  useTheme,
  Button,
  TextInput,
  IconButton,
  SegmentedButtons,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { formatPrice } from "../../helpers/TextHelper";
import SearchableDropdown from "../../components/Dropdown/SearchableDropdown";

export default function ChangeProduct({ route, navigation }) {
  const { item } = route.params;
  const theme = useTheme();

  // State untuk form
  const [formData, setFormData] = useState({
    id: item?.id || null,
    name: item?.name || "",
    stock: item?.stock?.toString() || "",
    buyPrice: item?.buyPrice?.toString() || "",
    price: item?.price?.toString() || "",
    unit: "Gram (g)",
    category: item?.category || "Beverages",
    status: item?.status || "publish",
    picture: item?.picture || null,
  });

  const [loading, setLoading] = useState(false);
  const unitOptions = [
    "Gram (g)",
    "Kilogram (kg)",
    "Liter (L)",
    "Milliliter (ml)",
    "Piece (pcs)",
    "Box",
    "Pack",
  ];
  const categoryOptions = [
    "Beverages",
    "Food",
    "Electronics",
    "Clothing",
    "Books",
    "Health",
    "Beauty",
    "Sports",
    "Home",
    "Other",
  ];
  const statusOptions = [
    {
      value: "publish",
      label: "Publish",
      icon: "monitor",
      checkedColor: theme.colors.onSuccessContainer,
      style: {
        backgroundColor:
          formData.status === "publish"
            ? theme.colors.successContainer
            : theme.colors.surface,
        borderRadius: 8,
      },
      uncheckedColor: theme.colors.onSuccessContainer,
    },
    {
      value: "draft",
      label: "Draft",
      icon: "clock",
      checkedColor: theme.colors.onWarningContainer,
      style: {
        backgroundColor:
          formData.status === "draft"
            ? theme.colors.warningContainer
            : theme.colors.surface,
      },
      uncheckedColor: theme.colors.onWarningContainer,
    },
    {
      value: "archive",
      label: "Archive",
      icon: "archive",
      style: {
        backgroundColor:
          formData.status === "archive"
            ? theme.colors.errorContainer
            : theme.colors.surface,
        borderRadius: 8,
      },
      checkedColor: theme.colors.onErrorContainer,
      uncheckedColor: theme.colors.onErrorContainer,
    },
  ];
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaType: "photo",
        selectionLimit: 1,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.didCancel && result.assets?.length > 0) {
        setFormData((prev) => ({
          ...prev,
          picture: result.assets[0],
        }));
      }
    } catch (error) {
      console.log("Error picking image:", error);
    }
  };
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleStatusChange = (status) => {
    setFormData((prev) => ({
      ...prev,
      status: status,
    }));
  };
  const handleUpdate = async () => {
    setLoading(true);
    try {
      console.log("Updating product:", formData);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.log("Error updating product:", error);
    } finally {
      setLoading(false);
      setFormData({});
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    }
  };
  const handleCreate = async () => {
    setLoading(true);
    try {
      console.log("Creating product:", formData);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.log("Error creating product:", error);
    } finally {
      setLoading(false);
      setFormData({});
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.container}>
          <View style={styles.formCard}>
            <View style={styles.section}>
              <View style={styles.section}>
                <View style={styles.imageSection}>
                  <View style={styles.imageContainer}>
                    {item?.picture ? (
                      <Image
                        source={
                          typeof item.picture === "string"
                            ? { uri: item.picture }
                            : { uri: item.picture.uri }
                        }
                        style={[
                          styles.productImage,
                          { borderColor: theme.colors.primary },
                        ]}
                      />
                    ) : (
                      <View
                        style={[
                          styles.imagePlaceholder,
                          { borderColor: theme.colors.primary },
                        ]}
                      >
                        <IconButton
                          icon="package-variant"
                          size={40}
                          iconColor="#9E9E9E"
                        />
                      </View>
                    )}
                  </View>
                  <View style={styles.imageButtons}>
                    <Button
                      mode="contained"
                      onPress={pickImage}
                      icon="upload"
                      style={styles.uploadButton}
                      buttonColor={theme.colors.primary}
                    >
                      Upload
                    </Button>
                    <Button
                      mode="outlined"
                      onPress={() => handleInputChange("picture", null)}
                      icon="refresh"
                      style={styles.refreshButton}
                    >
                      Refresh
                    </Button>
                  </View>
                </View>
                <Text style={styles.imageHint}>
                  Allowed JPG or PNG and Square Ratio Photo Max size 800KB
                </Text>
              </View>

              <Text style={styles.sectionLabel}>Status</Text>
              <View style={styles.statusContainer}>
                <SegmentedButtons
                  style={{
                    flex: 1,
                  }}
                  value={formData.status}
                  onValueChange={(value) => handleStatusChange(value)}
                  buttons={statusOptions}
                />
              </View>
            </View>
            <View style={styles.section}>
              <TextInput
                label="Name"
                value={formData.name}
                onChangeText={(value) => handleInputChange("name", value)}
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="Stock"
                value={formData.stock}
                onChangeText={(value) => handleInputChange("stock", value)}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
              />

              <TextInput
                label="Buy Price"
                value={formData.buyPrice}
                onChangeText={(value) => handleInputChange("buyPrice", value)}
                mode="outlined"
                keyboardType="numeric"
                right={
                  <TextInput.Affix text={formatPrice(formData.buyPrice ?? 0)} />
                }
                style={styles.input}
              />

              <TextInput
                label="Price"
                value={formData.price}
                onChangeText={(value) => handleInputChange("price", value)}
                mode="outlined"
                keyboardType="numeric"
                right={
                  <TextInput.Affix text={formatPrice(formData.price ?? 0)} />
                }
                style={styles.input}
              />

              <SearchableDropdown
                label="Unit"
                value={formData.unit}
                options={unitOptions}
                onValueChange={(value) => handleInputChange("unit", value)}
                placeholder="Select unit"
                searchPlaceholder="Search units..."
              />

              <SearchableDropdown
                label="Category"
                value={formData.category}
                options={categoryOptions}
                onValueChange={(value) => handleInputChange("category", value)}
                placeholder="Select category"
                searchPlaceholder="Search categories..."
              />
            </View>
            <View>
              {item?.id ? (
                <Button
                  mode="contained"
                  onPress={handleUpdate}
                  loading={loading}
                  disabled={loading}
                  style={[styles.actionButton, styles.updateButton]}
                  buttonColor={theme.colors.warning}
                  textColor="white"
                >
                  {loading ? "Updating..." : "Update changes"}
                </Button>
              ) : (
                <Button
                  mode="contained"
                  onPress={handleCreate}
                  loading={loading}
                  disabled={loading}
                  style={[styles.actionButton, styles.updateButton]}
                  buttonColor={theme.colors.primary}
                  textColor="white"
                >
                  {loading ? "Creating..." : "Create product"}
                </Button>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  formCard: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: "row",
    gap: 12,
  },
  statusButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "white",
  },
  imageSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#F5F5F5",
  },
  productImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    borderWidth: 1.5,
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderWidth: 1.5,
    borderRadius: 8,
  },
  imageButtons: {
    flex: 1,
    gap: 8,
  },
  uploadButton: {
    borderRadius: 6,
  },
  refreshButton: {
    borderRadius: 6,
  },
  imageHint: {
    fontSize: 12,
    color: "#999",
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
  },
  updateButton: {
    borderColor: "#F44336",
  },
});
