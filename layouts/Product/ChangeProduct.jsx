import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  useTheme,
  Button,
  TextInput,
  IconButton,
  SegmentedButtons,
  Surface,
  Badge,
  Appbar,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import {
  capitalizeFirstLetter,
  formatPrice,
} from "../../helpers/ConvertHelper";
import {
  downloadOrCacheFile,
  handleChange,
  httpHelper,
} from "../../helpers/HttpHelper";
import SearchableDropdown from "../../components/Dropdown/SearchableDropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CONFIG from "../../config";
import * as Yup from "yup";
import ErrorDisplay from "../../components/Error/ErrorDisplay";
import AnimatedButton from "../../components/Button/AnimatedButton";
import { FlatList } from "react-native";
import { now } from "moment";
export default function ChangeProduct({ route, navigation }) {
  const emptyArray = [];
  const emptyString = "";
  const { item } = route.params;
  const theme = useTheme();
  const [categories, setCategories] = useState(emptyArray);
  const [units, setUnits] = useState(emptyArray);
  const [temporaryProduct, setTemporaryProduct] = useState(emptyArray);
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorsMessage, setErrorsMessage] = useState(null);
  const [defaultPicture, setDefaultPicture] = useState(emptyString);
  const openDropdown = () => {
    setSearchQuery("");
    setVisible(true);
  };

  const closeDropdown = () => {
    setVisible(false);
    setSearchQuery("");
  };
  const productSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .min(6, "Name must be at least 6 characters")
      .max(40, "Name must be at most 40 characters"),
    stock: Yup.number()
      .required()
      .positive()
      .typeError("Stock must be a number")
      .max(9999, "Stock must be max 4 digits"),
    price: Yup.string()
      .required("Price is required")
      // .matches(/^Rp /, "Price is invalid")
      .max(16, "Price max length 16"),
    buyPrice: Yup.string()
      .required("Buy price is required")
      // .matches(/^Rp /, "Buy price is invalid")
      .max(16, "Buy price max length 16"),
    status: Yup.string()
      .required("Status is required")
      .oneOf(["archive", "draft", "publish"], "Invalid status"),
    unitId: Yup.number().required("Unit is required"),
    typeId: Yup.number().required("Category is required"),
  });
  const [formData, setFormData] = useState({
    id: item?.id || null,
    name: item?.name || "",
    stock: item?.stock || 0,
    buyPrice: item?.buyPrice?.toString() || "",
    price: item?.price?.toString() || "",
    unitId: item?.unitId || null,
    typeId: item?.typeId || null,
    status: item?.status || "publish",
    picture: item?.picture || null,
  });
  const getCategories = async () => {
    let result = await httpHelper("GET", "man/customer-product-type");
    setCategories(result.data.data);
  };
  const getUnits = async () => {
    let result = await httpHelper("GET", "dev/app-good-unit");
    setUnits(result.data.data);
  };
  const statusOptions = [
    {
      value: "publish",
      label: "Publish",
      icon: "monitor",
      checkedColor: theme.colors.onSuccessContainer,
      style: {
        borderRadius: 2,
      },
      uncheckedColor: theme.colors.onSuccessContainer,
    },
    {
      value: "draft",
      label: "Draft",
      icon: "clock",
      checkedColor: theme.colors.onWarningContainer,
      uncheckedColor: theme.colors.onWarningContainer,
    },
    {
      value: "archive",
      label: "Archive",
      icon: "archive",
      style: {
        borderRadius: 2,
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
  const handleStatusChange = (status) => {
    setFormData((prev) => ({
      ...prev,
      status: status,
    }));
  };
  const handleUpdateTemp = async (item) => {
    try {
      setFormData(item);
    } catch (error) {
      console.log("Error updating product:", error);
    } finally {
      closeDropdown();
    }
  };
  const handleAddMoreProduct = async () => {
    setErrorsMessage(null);
    try {
      productSchema.validateSync(formData, {
        abortEarly: false,
      });
      setTemporaryProduct((prev) => {
        const updated = prev
          ? [...prev, { ...formData, created_at: now() }]
          : [{ ...formData, created_at: now() }];

        AsyncStorage.setItem(
          CONFIG.STORAGE.PRODUCT_TEMPORARY,
          JSON.stringify(updated)
        ).catch((err) => console.error("AsyncStorage error:", err));

        return updated;
      });

      setTimeout(() => {
        setFormData({ status: "publish" });
      }, 2000);
    } catch (error) {
      console.log("Error adding more product:", error);
      if (error.name === "ValidationError") {
        setErrorsMessage(error.errors);
      }
    }
  };
  useEffect(() => {
    (async () => {
      await getCategories();
      await getUnits();
      try {
        const resultFile = await downloadOrCacheFile(
          `${CONFIG.API.ASSET_BASE_URL}/${CONFIG.FILE_SYSTEM.CACHE.PRODUCT_TEMP_PICTURE_CACHE}/${CONFIG.DEFAULT.FILE_SYSTEM.TEMP_PRODUCT_PICTURE}`,
          CONFIG.FILE_SYSTEM.CACHE.PRODUCT_TEMP_PICTURE_CACHE,
          CONFIG.DEFAULT.FILE_SYSTEM.TEMP_PRODUCT_PICTURE
        );
        setDefaultPicture(resultFile);
        console.log("finish try block");
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  useEffect(() => {
    (async () => {
      const tempProduct = JSON.parse(
        await AsyncStorage.getItem(CONFIG.STORAGE.PRODUCT_TEMPORARY)
      );
      let result = tempProduct ? tempProduct : emptyArray;
      setTemporaryProduct(result);
      console.log("triggered");
    })();
  }, [visible]);
  const renderItem = ({ item }) => {
    console.log(item);
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 12,
          borderBottomWidth: 1,
          borderBottomColor: "#eee",
          backgroundColor:
            item.status === "publish"
              ? "white"
              : item.status === "draft"
              ? theme.colors.warningContainer
              : theme.colors.errorContainer,
        }}
      >
        <Image
          source={{ uri: item.picture.uri || defaultPicture }}
          style={{
            width: 60,
            height: 60,
            filter: item.picture ? "grayscale(100%)" : "",
            borderRadius: 8,
            borderWidth: 2,
            borderColor: theme.colors.backdrop,
            marginRight: 12,
          }}
        />
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "600", flex: 1 }}>
              {item.name}
            </Text>
            <Badge
              size={20}
              style={{
                backgroundColor:
                  item.status === "publish"
                    ? theme.colors.successContainer
                    : item.status === "draft"
                    ? theme.colors.warningContainer
                    : theme.colors.errorContainer,
                paddingHorizontal: 10,
                fontSize: 10,
                fontWeight: "600",
                color:
                  item.status === "publish"
                    ? theme.colors.onSuccessContainer
                    : item.status === "draft"
                    ? theme.colors.onWarningContainer
                    : theme.colors.onErrorContainer,
              }}
            >
              {capitalizeFirstLetter(item.status)}
            </Badge>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: theme.colors.onSurface,
              }}
            >
              {formatPrice(item.price)}
            </Text>
            <Text style={{ fontSize: 12, marginRight: 4 }}>
              Stok: {item.stock}
            </Text>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <IconButton
                icon="pencil-outline"
                size={15}
                onPress={() => {
                  handleUpdateTemp(item);
                }}
                compact={true}
                iconColor={theme.colors.onWarningContainer}
                mode="contained"
                containerColor={theme.colors.warningContainer}
              />
              <IconButton
                icon="delete-outline"
                size={15}
                compact={true}
                iconColor={theme.colors.onErrorContainer}
                onPress={() => handleDelete(item)}
                mode="contained"
                containerColor={theme.colors.errorContainer}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  useEffect(() => {
    if (Object.keys(formData).length === 0) {
      setTimeout(() => {
        navigation.goBack();
      }, 500);
    }
  }, [formData]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Appbar
        theme={{ colors: { primary: theme.colors.background } }}
        style={{ backgroundColor: "primary" }}
      >
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content title={item?.id ? "Update Product" : "Add Product"} />
        {temporaryProduct.length > 0 && (
          <View
            style={{
              flex: 1,
              alignItems: "flex-end",
              paddingVertical: 2,
              marginBottom: 5,
              paddingHorizontal: 5,
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <View style={{ position: "relative" }}>
              <IconButton
                icon="format-list-numbered"
                mode="contained"
                onPress={openDropdown}
                iconColor={theme.colors.backdrop}
                size={22}
              />
              <Badge
                style={{
                  position: "absolute",
                  top: 1,
                  right: 1,
                  backgroundColor: theme.colors.primary,
                }}
              >
                {temporaryProduct.length}
              </Badge>
            </View>
          </View>
        )}
      </Appbar>
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeDropdown}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeDropdown}
        >
          <View style={styles.modalContainer}>
            <Surface
              style={[
                styles.dropdownModal,
                {
                  backgroundColor: theme.colors.background,
                  maxHeight: 300,
                },
              ]}
              elevation={8}
            >
              <View style={styles.searchContainer}>
                <TextInput
                  mode="outlined"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={styles.searchInput}
                  left={<TextInput.Icon icon="magnify" />}
                  right={
                    searchQuery ? (
                      <TextInput.Icon
                        icon="close"
                        onPress={() => setSearchQuery("")}
                      />
                    ) : null
                  }
                />
              </View>

              <FlatList
                data={temporaryProduct}
                keyExtractor={(item, index) => `_${index}`}
                renderItem={renderItem}
                style={styles.optionsList}
                showsVerticalScrollIndicator={true}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text
                      style={[
                        styles.emptyText,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      No options found
                    </Text>
                  </View>
                }
              />
            </Surface>
          </View>
        </TouchableOpacity>
      </Modal>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.container}>
          <View style={styles.formCard}>
            <View>
              <View>
                <View style={styles.imageSection}>
                  <View style={styles.imageContainer}>
                    {formData?.picture ? (
                      <Image
                        source={
                          typeof formData.picture === "string" &&
                          typeof formData.picture !== Object
                            ? { uri: item.picture }
                            : formData.picture
                            ? { uri: formData.picture.uri }
                            : ""
                        }
                        style={[
                          styles.productImage,
                          {
                            borderColor: theme.colors.primary,
                            filter: formData.picture ? "grayscale(100%)" : "",
                          },
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
                      onPress={() => handleChange(null, "picture", setFormData)}
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
                  theme={{
                    colors: {
                      outline: "transparent",
                      secondary: theme.colors.background,
                    },
                  }}
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderRadius: 2,
                  }}
                  value={formData.status}
                  onValueChange={(value) => handleStatusChange(value)}
                  buttons={statusOptions.map((opt) => ({
                    ...opt,
                    style: [
                      {
                        backgroundColor:
                          formData.status === opt.value
                            ? opt.value === "publish"
                              ? theme.colors.successContainer
                              : opt.value === "draft"
                              ? theme.colors.warningContainer
                              : theme.colors.errorContainer
                            : "white",
                      },
                      opt.style,
                    ],
                    checkedColor:
                      opt.value === "publish"
                        ? theme.colors.onSuccessContainer
                        : opt.value === "draft"
                        ? theme.colors.onWarningContainer
                        : theme.colors.onErrorContainer,
                    uncheckedColor:
                      opt.value === "publish"
                        ? theme.colors.onSuccessContainer
                        : opt.value === "draft"
                        ? theme.colors.onWarningContainer
                        : theme.colors.onErrorContainer,
                  }))}
                />
              </View>
            </View>
            <View>
              <TextInput
                label="Name"
                value={formData.name}
                onChangeText={(value) =>
                  handleChange(value, "name", setFormData)
                }
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="Stock"
                value={formData.stock}
                onChangeText={(value) =>
                  handleChange(value, "stock", setFormData)
                }
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
              />

              <TextInput
                label="Buy Price"
                value={formData.buyPrice}
                onChangeText={(value) =>
                  handleChange(value, "buyPrice", setFormData)
                }
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
                onChangeText={(value) =>
                  handleChange(value, "price", setFormData)
                }
                mode="outlined"
                keyboardType="numeric"
                right={
                  <TextInput.Affix text={formatPrice(formData.price ?? 0)} />
                }
                style={styles.input}
              />

              <SearchableDropdown
                label="Unit"
                value={formData.unitId}
                options={units}
                onValueChange={(value) =>
                  handleChange(value, "unitId", setFormData)
                }
                placeholder="Select unit"
                searchPlaceholder="Search units..."
              />
              <SearchableDropdown
                label="Category"
                value={formData.typeId}
                options={categories}
                onValueChange={(value) =>
                  handleChange(value, "typeId", setFormData)
                }
                placeholder="Select category"
                searchPlaceholder="Search categories..."
              />
            </View>
            {errorsMessage && (
              <ErrorDisplay
                title="Product Validation Error"
                errorMessages={errorsMessage}
              />
            )}
            <View>
              {item?.id ? (
                <AnimatedButton
                  handleClick={handleUpdate}
                  errorMessage={errorsMessage}
                  color={theme.colors.warningContainer}
                />
              ) : (
                <AnimatedButton
                  handleClick={handleAddMoreProduct}
                  errorMessage={errorsMessage}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 400,
  },
  dropdownModal: {
    borderRadius: 8,
    overflow: "hidden",
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchInput: {
    backgroundColor: "transparent",
  },
  optionsList: {
    maxHeight: 250,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    fontStyle: "italic",
  },
  container: {
    flex: 1,
  },
  formCard: {
    padding: 20,
  },
  section: {
    // marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
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
    marginBottom: 8,
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
    marginVertical: 8,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
    marginBottom: 8,
    borderColor: "#F44336",
  },
  updateButton: {
    borderColor: "#F44336",
  },
});
