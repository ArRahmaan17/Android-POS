import React, { useCallback, useMemo, useState, useEffect } from "react";
import { FlatList, Image, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, useTheme, IconButton, Badge, Icon } from "react-native-paper";
import HeaderSearch from "../../components/HeaderSearch";
import { debounce, formatPrice } from "../../helpers/TextHelper";
import { LinearGradient } from "expo-linear-gradient";
import {
  httpHelper,
  downloadOrCahceFile,
  removeDuplicate,
} from "../../helpers/HttpHelper";
import CONFIG from "../../config";
import Fab from "../../components/Button/Fab";
export default function Product({ navigation }) {
  const [startId, setStartId] = useState(0);
  const [tempProduct, setTempProduct] = useState({ data: [] });
  const [product, setProduct] = useState({ data: [] });
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [clearFilter, setClearFilter] = useState(false);
  const [categories, setCategories] = useState(["All"]);
  const sortOptions = [
    { key: "name", label: "Name" },
    { key: "price", label: "Price" },
    { key: "stock", label: "Stock" },
    { key: "status", label: "Status" },
  ];
  const [productSelected, setProductSelected] = useState(null);
  function ProductItem({ item, theme }) {
    const getStatusColor = (status) => {
      return status === "publish"
        ? theme.colors.successContainer
        : status === "draft"
        ? theme.colors.warningContainer
        : theme.colors.errorContainer;
    };

    const getStockColor = (stock) => {
      if (stock === 0) return "#F44336";
      if (stock <= 10) return "#FF9800";
      return "#4CAF50";
    };
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
              ? "#fff"
              : item.status === "draft"
              ? theme.colors.warningContainer
              : theme.colors.errorContainer,
        }}
        onPress={() =>
          productSelected && productSelected.id === item.id
            ? setProductSelected(null)
            : setProductSelected(item)
        }
      >
        <Image
          source={{ uri: item.picture }}
          style={{
            width: 60,
            height: 60,
            borderRadius: 8,
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
              size={productSelected && productSelected.id !== item.id ? 20 : 15}
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
              {item.type}
            </Badge>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              justifyContent:
                productSelected && productSelected.id === item.id
                  ? "space-between"
                  : "flex-start",
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
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: getStatusColor(item.status),
                    marginRight: 6,
                  }}
                />
                <Text
                  style={{
                    fontSize: 8,
                    textTransform: "capitalize",
                  }}
                >
                  {item.status}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 8, color: "#666", marginRight: 4 }}>
                  Stok:
                </Text>
                <Text
                  style={{
                    fontSize: 8,
                    color: getStockColor(item.stock),
                    fontWeight: "600",
                  }}
                >
                  {item.stock}
                </Text>
              </View>
            </View>
            {productSelected && productSelected?.id === item.id && (
              <View
                style={{
                  flexDirection: "row",
                  marginRight: -10,
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                <IconButton
                  icon="pencil"
                  size={12}
                  onPress={() => navigation.navigate("ChangeProduct", { item })}
                  compact={true}
                  iconColor={theme.colors.onWarningContainer}
                  mode="contained"
                  containerColor={theme.colors.warningContainer}
                />
                <IconButton
                  icon="delete"
                  size={12}
                  compact={true}
                  iconColor={theme.colors.onErrorContainer}
                  onPress={() => handleDelete(item)}
                  mode="contained"
                  containerColor={theme.colors.errorContainer}
                />
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  function TemporaryProductItem({ item, theme }) {
    return (
      <View style={{ flex: 1, padding: 5 }}>
        <View
          style={{
            padding: 5,
            marginBottom: 16,
            borderRadius: 12,
          }}
        >
          <Text style={{ fontSize: 14, marginBottom: 2 }}>
            📅 Date: {item?.transaction_created}
          </Text>
          <Text style={{ fontSize: 15, fontWeight: "800", marginBottom: 2 }}>
            Changed Product:
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 5,
              padding: 5,
              backgroundColor: "#f9f9f9",
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#ddd",
            }}
          >
            <Text style={{ fontSize: 14 }}>
              <Icon
                source="database-plus-outline"
                size={15}
                color={theme.colors.success}
              />{" "}
              In: {item?.sum_product_in}
            </Text>
            <Text style={{ fontSize: 14 }}>
              <Icon
                source="database-sync-outline"
                size={15}
                color={theme.colors.warning}
              />{" "}
              Restock: {item?.sum_product_restock}
            </Text>
            <Text style={{ fontSize: 14 }}>
              <Icon
                source="database-minus-outline"
                size={15}
                color={theme.colors.error}
              />{" "}
              Remove: {item?.sum_product_remove}
            </Text>
          </View>
          {item?.changedProduct.map((prod) => (
            <LinearGradient
              colors={
                prod.status_transaction === "IN"
                  ? [theme.colors.success, theme.colors.successContainer]
                  : prod.status_transaction === "RESTOCK"
                  ? [theme.colors.warning, theme.colors.warningContainer]
                  : [theme.colors.error, theme.colors.errorContainer]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              key={prod.id}
              style={{
                padding: 2,
                marginBottom: 5,
                borderRadius: 12,
              }}
            >
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 10,
                  padding: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                  }}
                >
                  {prod.name}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    marginTop: 4,
                  }}
                >
                  Stock: {prod.stock}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                  }}
                >
                  Price: {formatPrice(prod.price)}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                  }}
                >
                  Unit: {prod.unit?.name}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                  }}
                >
                  👤 Created by: {prod.creater?.name}
                </Text>
                {prod.accepter && (
                  <Text
                    style={{
                      fontSize: 13,
                    }}
                  >
                    ✅ Accepted by: {prod.accepter?.name}
                  </Text>
                )}
              </View>
            </LinearGradient>
          ))}
        </View>
      </View>
    );
  }
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    if (!refreshing) {
      productView ? setProduct({ data: [] }) : setTempProduct({ data: [] });
      setRefreshing(true);
      await getProduct({
        start: 0,
        length: 5,
        order: { dir: "desc", name: "name" },
        search: "",
        firstRequest: true,
      });
      setRefreshing(false);
    }
  });
  const [search, setSearch] = useState(null);
  const [tempSearch, setTempSearch] = useState("");
  const filteredProduct = useMemo(() => {
    return (
      product.data &&
      product.data
        .filter((item) => {
          const categoryMatch =
            selectedCategory === "All" || item?.type === selectedCategory;
          const searchLower = tempSearch.toLowerCase();
          const nameMatch = item.name.toLowerCase().includes(searchLower);

          const statusMatch =
            (searchLower.includes("publish") && item.status === "publish") ||
            (searchLower.includes("draft") && item.status === "draft") ||
            (searchLower.includes("archive") && item.status === "archive");

          const priceMatch =
            item.price.toString().includes(tempSearch) ||
            formatPrice(item.price).toLowerCase().includes(searchLower) ||
            (searchLower.includes("rp") &&
              formatPrice(item.price).toLowerCase().includes(searchLower)) ||
            (searchLower.includes("rupiah") &&
              formatPrice(item.price).toLowerCase().includes(searchLower));

          const stockMatch =
            item.stock.toString().includes(tempSearch) ||
            (searchLower.includes("stok") &&
              item.stock
                .toString()
                .includes(tempSearch.replace(/[^0-9]/g, ""))) ||
            (searchLower.includes("habis") && item.stock === 0) ||
            (searchLower.includes("rendah") &&
              item.stock > 0 &&
              item.stock <= 10) ||
            (searchLower.includes("tersedia") && item.stock > 0);

          const categorySearchMatch = item.type
            .toLowerCase()
            .includes(searchLower);

          const searchMatch =
            nameMatch ||
            statusMatch ||
            priceMatch ||
            stockMatch ||
            categorySearchMatch;

          return categoryMatch && (tempSearch === "" || searchMatch);
        })
        .sort((a, b) => {
          let aValue, bValue;

          switch (sortBy) {
            case "name":
              aValue = a.name.toLowerCase();
              bValue = b.name.toLowerCase();
              break;
            case "price":
              aValue = a.price;
              bValue = b.price;
              break;
            case "stock":
              aValue = a.stock;
              bValue = b.stock;
              break;
            case "status":
              aValue = a.status;
              bValue = b.status;
              break;
            default:
              aValue = a.name.toLowerCase();
              bValue = b.name.toLowerCase();
          }

          if (sortOrder === "asc") {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        })
    );
  }, [
    productView,
    product,
    refreshing,
    tempSearch,
    selectedCategory,
    sortBy,
    sortOrder,
  ]);
  const filteredTempProduct = useMemo(() => {
    return (
      tempProduct.data &&
      tempProduct.data
        .map((prodChanged) => ({
          ...prodChanged,
          changedProduct: prodChanged.changedProduct.filter((item) => {
            // category filter
            const matchCategory =
              selectedCategory === "All" ||
              item.status_transaction === selectedCategory;

            // search filter (check in product name, creator, accepter)
            const search = tempSearch.toLowerCase();
            const matchSearch =
              item.name.toLowerCase().includes(search) ||
              prodChanged.transaction_created.toLowerCase().includes(search) ||
              item.creater?.name.toLowerCase().includes(search) ||
              item.creater?.email.toLowerCase().includes(search) ||
              item.accepter?.name?.toLowerCase().includes(search) ||
              item.accepter?.email?.toLowerCase().includes(search);

            return matchCategory && (tempSearch === "" || matchSearch);
          }),
        }))
        .filter((prodChanged) => prodChanged.changedProduct.length > 0)
    );
  }, [
    selectedCategory,
    productView,
    tempProduct,
    refreshing,
    tempSearch,
    sortBy,
    sortOrder,
  ]);
  const theme = useTheme();
  const debouncedSearch = useMemo(
    () =>
      debounce(
        (text) => setTempSearch(text),
        CONFIG.NUMBER.DEFAULT_DEBOUNCE_TIME
      ),
    []
  );
  const [productView, setProductView] = useState(true);
  const [visibleHeaderSearch, setVisibleHeaderSearch] = useState(false);
  const handleDelete = (item) => {
    console.log("Delete item:", item);
  };
  const clearAllFilter = () => {
    setClearFilter(false);
    setSelectedCategory("All");
    setSortBy(null);
    setSortOrder("asc");
    setTempSearch("");
    setSearch("");
  };
  async function getProduct({ start, length, order, search, firstRequest }) {
    setRefreshing(true);
    let result = null;
    if (productView) {
      result = await httpHelper("GET", "man/customer-company-good/data-table", {
        start: start,
        length: length,
        order: order,
        search: search,
      });
    } else {
      result = await httpHelper(
        "GET",
        "man/customer-temporary-product/data-table",
        {
          start: start,
          length: length,
          order: order,
          search: search,
        }
      );
    }
    if (productView) {
      result.data.data = await Promise.all(
        result.data.data.map(async (item) => {
          item.picture = await downloadOrCahceFile(
            CONFIG.API.ASSET_BASE_URL +
              `/${
                productView
                  ? CONFIG.FILE_SYSTEM.PRODUCT_PICTURE_CACHE
                  : CONFIG.FILE_SYSTEM.PRODUCT_TEMP_PICTURE_CACHE
              }/${item.picture}`,
            `${
              productView
                ? CONFIG.FILE_SYSTEM.PRODUCT_PICTURE_CACHE
                : CONFIG.FILE_SYSTEM.PRODUCT_TEMP_PICTURE_CACHE
            }`,
            item.picture
          );
          setStartId(item.id);
          return item;
        })
      );
    }
    if (firstRequest) {
      if (productView) {
        setProduct(result.data);
        setCategories(
          removeDuplicate([
            "All",
            ...Array.from(new Set(result.data.data.map((item) => item.type))),
          ])
        );
      } else {
        setTempProduct(result.data);
        setCategories([
          "All",
          ...Array.from(
            new Set(
              result.data.data.flatMap((trx) =>
                trx.changedProduct.map((p) => p.status_transaction)
              )
            )
          ),
        ]);
        console.log(categories, "categories");
      }
    } else {
      if (productView) {
        setProduct((prev) => ({
          ...prev,
          data: [...prev.data, ...result.data.data],
        }));
        setCategories((prev) => [
          ...prev,
          ...Array.from(new Set(result.data.data.map((item) => item.type))),
        ]);
      } else {
        setTempProduct((prev) => ({
          ...prev,
          data: [...prev.data, ...result.data.data],
        }));
        setCategories((prev) =>
          removeDuplicate([
            ...prev,
            ...Array.from(
              new Set(
                result.data.data.flatMap((trx) =>
                  trx.changedProduct.map((p) => p.status_transaction)
                )
              )
            ),
          ])
        );
      }
    }
    setRefreshing(false);
  }
  useEffect(() => {
    (async function () {
      await getProduct({
        start: 0,
        length: 5,
        order: { dir: "desc", name: "name" },
        search: "",
        firstRequest: true,
      });
    })();
  }, [productView]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, flexDirection: "column" }}>
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 10,
            marginVertical: 10,
            backgroundColor: "white",
            borderRadius: 12,
            elevation: 2,
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            padding: 4,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setProductView(true);
              setStartId(0);
              clearAllFilter();
            }}
            style={{
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: productView ? 14 : 12,
                fontWeight: productView ? "800" : "600",
                color: productView
                  ? theme.colors.primary
                  : theme.colors.onSurface,
                borderBottomWidth: 2,
                borderBottomColor: productView
                  ? theme.colors.primary
                  : "transparent",
              }}
            >
              Product View
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setProductView(false);
              setStartId(0);
              clearAllFilter();
            }}
            style={{
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: !productView ? 14 : 12,
                fontWeight: !productView ? "800" : "600",
                color: !productView
                  ? theme.colors.primary
                  : theme.colors.onSurface,
                borderBottomWidth: 2,
                borderBottomColor: !productView
                  ? theme.colors.primary
                  : "transparent",
              }}
            >
              Temp Product View
            </Text>
          </TouchableOpacity>
        </View>
        <HeaderSearch
          visible={visibleHeaderSearch}
          categories={categories}
          selectedCategory={selectedCategory}
          sortOptions={sortOptions}
          setVisibleHeaderSearch={setVisibleHeaderSearch}
          setSelectedCategory={setSelectedCategory}
          setSortBy={setSortBy}
          sortBy={sortBy}
          setSortOrder={setSortOrder}
          sortOrder={sortOrder}
          clearFilter={clearFilter}
          setClearFilter={setClearFilter}
          clearAllFilter={clearAllFilter}
          search={search}
          onChange={(text) => {
            debouncedSearch(text);
            setSearch(text);
            setClearFilter(true);
          }}
          setTempSearch={setTempSearch}
          setSearch={setSearch}
        />
        <View
          style={{
            flex: 1,
            marginHorizontal: 10,
            marginTop: 12,
            borderRadius: 12,
            backgroundColor: "white",
            overflow: "hidden",
            elevation: 2,
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}
        >
          <FlatList
            data={productView ? filteredProduct : filteredTempProduct}
            keyExtractor={(item, index) =>
              productView === true
                ? item?.id?.toString() + index.toString()
                : item?.date_transaction?.toString() + index.toString()
            }
            refreshing={refreshing}
            onRefresh={onRefresh}
            onEndReached={debounce(async () => {
              if (
                (productView
                  ? product?.recordsTotal < product?.recordsFiltered &&
                    startId !== product?.recordsFiltered
                  : tempProduct?.recordsTotal < tempProduct?.recordsFiltered &&
                    startId !== tempProduct?.recordsFiltered) &&
                !clearFilter
              ) {
                await getProduct({
                  start: startId,
                  length: 5,
                  order: { dir: "desc", name: "name" },
                  search: "",
                  firstRequest: false,
                });
              }
            }, CONFIG.NUMBER.DEFAULT_DEBOUNCE_TIME)}
            onEndReachedThreshold={0.1}
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    marginBottom: 16,
                    textAlign: "center",
                  }}
                >
                  Tidak ada produk ditemukan
                </Text>
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#666",
                      marginBottom: 8,
                      textAlign: "center",
                    }}
                  >
                    Coba gunakan kata kunci berikut:
                  </Text>
                  <View style={{ gap: 8 }}>
                    <Text
                      style={{
                        fontSize: 10,
                        color: theme.colors.onPrimaryContainer,
                        textAlign: "center",
                      }}
                    >
                      • <Text style={{ fontWeight: "600" }}>Nama:</Text>{" "}
                      "Laptop"
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        color: theme.colors.onPrimaryContainer,
                        textAlign: "center",
                      }}
                    >
                      • <Text style={{ fontWeight: "600" }}>Status:</Text>{" "}
                      "aktif"
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        color: theme.colors.onPrimaryContainer,
                        textAlign: "center",
                      }}
                    >
                      • <Text style={{ fontWeight: "600" }}>Harga:</Text> "Rp
                      15.000.000"
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        color: theme.colors.onPrimaryContainer,
                        textAlign: "center",
                      }}
                    >
                      • <Text style={{ fontWeight: "600" }}>Stok:</Text>{" "}
                      "rendah", "5"
                    </Text>
                  </View>
                </View>
              </View>
            }
            renderItem={({ item }) => {
              return productView ? (
                <ProductItem item={item} theme={theme} />
              ) : (
                <TemporaryProductItem item={item} theme={theme} />
              );
            }}
          />
        </View>
      </View>
      <Fab
        onPress={() => navigation.navigate("ChangeProduct", { item: null })}
        visible={refreshing}
      />
    </SafeAreaView>
  );
}
