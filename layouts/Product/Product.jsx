import React, { useCallback, useMemo, useState, useEffect } from "react";
import { FlatList, Image, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, useTheme, IconButton, Badge, Icon } from "react-native-paper";
import HeaderSearch from "../../components/HeaderSearch";
import {
  debounce,
  formatPrice,
  removeTandaHubung,
  capitalizeFirstLetter,
  toKebabCase,
} from "../../helpers/ConvertHelper";
import { LinearGradient } from "expo-linear-gradient";
import {
  httpHelper,
  downloadOrCacheFile,
  removeDuplicate,
} from "../../helpers/HttpHelper";
import CONFIG from "../../config";
import Fab from "../../components/Button/Fab";
import { useFocusEffect } from "@react-navigation/native";
export default function Product({ navigation }) {
  const [startId, setStartId] = useState(0);
  const [tempProduct, setTempProduct] = useState({ data: [] });
  const [product, setProduct] = useState({ data: [] });
  const [selectedCategory, setSelectedCategory] = useState(
    CONFIG.DEFAULT.CATEGORY
  );
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");
  const [clearFilter, setClearFilter] = useState(false);
  const [categories, setCategories] = useState([
    {
      key: CONFIG.DEFAULT.CATEGORY.toLowerCase(),
      label: CONFIG.DEFAULT.CATEGORY,
    },
  ]);
  const [sortOptions, setSortOptions] = useState([
    { key: "name", label: "Name" },
    { key: "price", label: "Price" },
    { key: "stock", label: "Stock" },
    { key: "status", label: "Status" },
  ]);
  const [productSelected, setProductSelected] = useState(null);
  function ProductItem({ item, theme }) {
    const getStatusColor = (status) => {
      return status === "publish"
        ? theme.colors.successContainer
        : status === "draft"
        ? theme.colors.warningContainer
        : theme.colors.errorContainer;
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
              ? "white"
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
              gap: 8,
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
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
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
                    fontSize: 10,
                    textTransform: "capitalize",
                  }}
                >
                  {item.status}
                </Text>
              </View>
              <Text style={{ fontSize: 10, marginRight: 4 }}>
                Stok: {item.stock}
              </Text>
            </View>
            {productSelected && productSelected?.id === item.id && (
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <IconButton
                  icon="pencil-outline"
                  size={15}
                  onPress={() => navigation.navigate("ChangeProduct", { item })}
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
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  function TemporaryProductItem({ item, theme }) {
    return (
      <View
        style={{
          flex: 1,
          padding: 5,
          backgroundColor: theme.colors.background,
        }}
      >
        <View
          style={{
            padding: 5,
            marginBottom: 16,
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              marginBottom: 2,
            }}
            variant="titleMedium"
          >
            <Icon source="calendar" size={20} /> {item?.transaction_created}
          </Text>
          <Text style={{ marginBottom: 2 }} variant="titleMedium">
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
              backgroundColor: theme.colors.background,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: theme.colors.outline,
            }}
          >
            <Text style={{ fontSize: 14 }}>
              <Icon
                source="database-plus"
                size={15}
                color={theme.colors.success}
              />{" "}
              In: {item?.sum_product_in}
            </Text>
            <Text style={{ fontSize: 14 }}>
              <Icon
                source="database-sync"
                size={15}
                color={theme.colors.warning}
              />{" "}
              Restock: {item?.sum_product_restock}
            </Text>
            <Text style={{ fontSize: 14 }}>
              <Icon
                source="database-minus"
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
                  ? [theme.colors.primary, theme.colors.primaryContainer]
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
                borderRadius: 10,
              }}
            >
              <View
                style={{
                  backgroundColor: theme.colors.background,
                  borderTopRightRadius: 8,
                  borderTopLeftRadius: 8,
                  padding: 5,
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    height: 100,
                    width: 100,
                  }}
                >
                  <Image
                    source={{ uri: prod.picture }}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                    resizeMode="contain"
                  />
                </View>
                <View style={{ flex: 1 }}>
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
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 2,
                  backgroundColor: theme.colors.background,
                  borderBottomRightRadius: 8,
                  borderBottomLeftRadius: 8,
                  padding: 5,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Icon
                    source="plus-circle"
                    size={20}
                    color={theme.colors.success}
                  />
                  <Text
                    style={{
                      fontSize: 13,
                    }}
                  >
                    {capitalizeFirstLetter(prod.creater?.name)}
                  </Text>
                </View>
                {prod.accepter && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      // gap: 12,
                    }}
                  >
                    <Icon
                      source="check-circle"
                      size={20}
                      color={theme.colors.warning}
                    />
                    <Text
                      style={{
                        fontSize: 13,
                      }}
                    >
                      {capitalizeFirstLetter(prod.accepter?.name)}
                    </Text>
                  </View>
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
    if (
      !refreshing &&
      (productView ? product.data.length > 0 : tempProduct.data.length > 0)
    ) {
      productView ? setProduct({ data: [] }) : setTempProduct({ data: [] });
      setRefreshing(true);
      await getProduct({
        start: 0,
        length: 5,
        order: { dir: sortOrder, name: sortBy },
        search: tempSearch,
        firstRequest: true,
      });
      setRefreshing(false);
    }
  });
  const [search, setSearch] = useState(null);
  const [tempSearch, setTempSearch] = useState("");
  const theme = useTheme();
  const [productView, setProductView] = useState(true);
  const [visibleHeaderSearch, setVisibleHeaderSearch] = useState(false);
  const handleDelete = (item) => {
    console.log("Delete item:", item);
  };
  const clearAllFilter = () => {
    setClearFilter(false);
    setSelectedCategory(CONFIG.DEFAULT.CATEGORY.toLowerCase());
    setSortBy(null);
    setSortOrder("desc");
    setTempSearch("");
    setSearch("");
  };
  async function getProduct({
    start,
    length,
    order,
    search,
    firstRequest,
    category,
  }) {
    setRefreshing(true);
    let result = null;
    try {
      if (productView) {
        result = await httpHelper(
          "GET",
          "man/customer-company-good/data-table",
          {
            start: start,
            length: length,
            order: order,
            search: search,
            category: category,
          }
        );
      } else {
        result = await httpHelper(
          "GET",
          "man/customer-temporary-product/data-table",
          {
            start: start,
            length: length,
            order: order,
            search: search,
            category: category,
          }
        );
      }
      if (result.data.data) {
        if (productView) {
          result.data.data = await Promise.all(
            result.data.data.map(async (item) => {
              item.picture = await downloadOrCacheFile(
                CONFIG.API.ASSET_BASE_URL +
                  `/${
                    productView
                      ? CONFIG.FILE_SYSTEM.CACHE.PRODUCT_PICTURE_CACHE
                      : CONFIG.FILE_SYSTEM.CACHE.PRODUCT_TEMP_PICTURE_CACHE
                  }/${item.picture}`,
                `${
                  productView
                    ? CONFIG.FILE_SYSTEM.CACHE.PRODUCT_PICTURE_CACHE
                    : CONFIG.FILE_SYSTEM.CACHE.PRODUCT_TEMP_PICTURE_CACHE
                }`,
                item.picture
              );
              setStartId(item.id);
              return item;
            })
          );
        } else {
          result.data.data = await Promise.all(
            result.data.data.map(async (item) => {
              item.changedProduct = await Promise.all(
                item.changedProduct.map(async (changedProduct) => {
                  console.log(
                    CONFIG.API.ASSET_BASE_URL +
                      `/${
                        changedProduct.picture !== "default.png"
                          ? CONFIG.FILE_SYSTEM.CACHE.PRODUCT_TEMP_PICTURE_CACHE
                          : CONFIG.FILE_SYSTEM.CACHE.PRODUCT_PICTURE_CACHE
                      }/${changedProduct.picture}`
                  );
                  changedProduct.picture = await downloadOrCacheFile(
                    CONFIG.API.ASSET_BASE_URL +
                      `/${
                        changedProduct.picture !== "default-product.png"
                          ? CONFIG.FILE_SYSTEM.CACHE.PRODUCT_TEMP_PICTURE_CACHE
                          : CONFIG.FILE_SYSTEM.CACHE.PRODUCT_PICTURE_CACHE
                      }/${changedProduct.picture}`,
                    CONFIG.FILE_SYSTEM.PRODUCT_TEMP_PICTURE_CACHE,
                    changedProduct.picture
                  );
                  return changedProduct;
                })
              );
              setStartId(item.transaction_created);
              return item;
            })
          );
        }
      }
      if (firstRequest) {
        if (productView) {
          setProduct(result.data);
          setCategories(
            removeDuplicate([
              {
                key: CONFIG.DEFAULT.CATEGORY.toLowerCase(),
                label: CONFIG.DEFAULT.CATEGORY,
              },
              ...result.data.data.map((item) => ({
                key: item.typeId,
                label: item.type,
              })),
            ])
          );
          setSortOptions([
            ...Object.keys(result.data.data[0])
              .map((item) => {
                if (
                  ["picture", /Id$/i, /_at$/i].some((rule) =>
                    rule instanceof RegExp ? rule.test(item) : rule === item
                  )
                ) {
                  return null;
                }
                return {
                  key: item,
                  label: capitalizeFirstLetter(
                    removeTandaHubung(toKebabCase(item))
                  ),
                };
              })
              .filter((item) => item !== null),
          ]);
        } else {
          setTempProduct(result.data);
          setCategories(
            removeDuplicate(
              [
                {
                  key: CONFIG.DEFAULT.CATEGORY.toLowerCase(),
                  label: CONFIG.DEFAULT.CATEGORY,
                },
                ...result.data.data.flatMap((trx) =>
                  trx.changedProduct.map((p) => ({
                    key: p.status_transaction.toLowerCase(),
                    label: p.status_transaction,
                  }))
                ),
              ],
              "key" // dedupe by `key`
            )
          );
          setSortOptions([
            ...Array.from(
              new Set(
                Object.keys(result.data.data[0].changedProduct[0])
                  .map((item) => {
                    if (
                      [
                        "picture",
                        /Id$/i,
                        /_at$/i,
                        /ed$/,
                        /r$/,
                        /reference$/,
                        /by$/,
                      ].some((rule) =>
                        rule instanceof RegExp ? rule.test(item) : rule === item
                      )
                    ) {
                      return null;
                    }
                    return {
                      key: item,
                      label: capitalizeFirstLetter(
                        removeTandaHubung(toKebabCase(item))
                      ),
                    };
                  })
                  .filter((item) => item !== null)
              )
            ),
          ]);
        }
      } else {
        if (productView) {
          setProduct((prev) => ({
            ...prev,
            data: [...prev.data, ...result.data.data],
          }));
          setCategories((prev) =>
            removeDuplicate(
              [
                ...prev,
                ...result.data.data.map((item) => ({
                  key: item.typeId,
                  label: item.type.toLowerCase(),
                })),
              ],
              "key"
            )
          );
        } else {
          setTempProduct((prev) => ({
            ...prev,
            data: [...prev.data, ...result.data.data],
          }));
          setCategories((prev) =>
            removeDuplicate(
              [
                ...prev,
                ...result.data.data.flatMap((trx) =>
                  trx.changedProduct.map((p) => ({
                    key: p.status_transaction.toLowerCase(),
                    label: p.status_transaction,
                  }))
                ),
              ],
              "key"
            )
          );
        }
      }
    } catch (error) {}
    setRefreshing(false);
  }
  const debouncedSetTempSearch = useCallback(
    debounce((text) => {
      setTempSearch(text);
      const clearFilterDelayed = () => {
        setTimeout(() => {
          setClearFilter(true);
        }, CONFIG.NUMBER.DEFAULT_DEBOUNCE_TIME);
      };
      clearFilterDelayed();
    }, CONFIG.NUMBER.DEFAULT_DEBOUNCE_TIME),
    []
  );

  useFocusEffect(
    useCallback(() => {
      (async function () {
        await getProduct({
          start: 0,
          length: 5,
          order: { dir: sortOrder, name: sortBy },
          search: tempSearch,
          firstRequest: true,
          category: selectedCategory,
        });
      })();
      return () => {
        setProduct({ data: [] });
        setTempProduct({ data: [] });
        setCategories([
          {
            key: CONFIG.DEFAULT.CATEGORY.toLowerCase(),
            label: CONFIG.DEFAULT.CATEGORY,
          },
        ]);
        setSortOptions([]);
        setStartId(0);
        setSelectedCategory(CONFIG.DEFAULT.CATEGORY.toLowerCase());
        setSortBy(null);
        setSortOrder("desc");
        setTempSearch("");
        setSearch("");
      };
    }, [])
  );
  useEffect(() => {
    (async function () {
      await getProduct({
        start: 0,
        length: 5,
        order: { dir: sortOrder, name: sortBy },
        search: tempSearch,
        firstRequest: true,
        category: selectedCategory,
      });
    })();
  }, [tempSearch, sortOrder, sortBy]);
  useEffect(() => {
    (async function () {
      await getProduct({
        start: 0,
        length: 5,
        order: { dir: sortOrder, name: sortBy },
        search: tempSearch,
        firstRequest: true,
        category: selectedCategory,
      });
    })();
  }, [productView]);
  useEffect(() => {
    (async function () {
      await getProduct({
        start: 0,
        length: 5,
        order: { dir: sortOrder, name: sortBy },
        search: tempSearch,
        firstRequest: true,
        category: selectedCategory,
      });
    })();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, flexDirection: "column" }}>
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 10,
            marginVertical: 10,
            backgroundColor: theme.colors.background,
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
                fontWeight: productView ? "800" : "700",
                color: productView ? "black" : theme.colors.backdrop,
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
                fontWeight: !productView ? "800" : "700",
                color: !productView ? "black" : theme.colors.backdrop,
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
          setSearch={setSearch}
          onChange={(text) => {
            debouncedSetTempSearch(text);
            setSearch(text);
          }}
        />
        <View
          style={{
            flex: 1,
            marginHorizontal: 10,
            marginTop: 12,
            borderRadius: 12,
            backgroundColor: theme.colors.background,
            overflow: "hidden",
            elevation: 2,
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}
        >
          <FlatList
            data={productView ? product.data : tempProduct.data}
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
                  order: { dir: sortOrder, name: sortBy },
                  search: tempSearch,
                  firstRequest: false,
                  category: selectedCategory,
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
