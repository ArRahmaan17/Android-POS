import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import {
  Text,
  useTheme,
  TextInput,
  Chip,
  Button,
  IconButton,
} from "react-native-paper";

export default function HeaderSearch({
  visible,
  onChange,
  search,
  categories,
  selectedCategory,
  sortOptions,
  sortBy,
  sortOrder,
  setSortOrder,
  clearFilter,
  setClearFilter,
  setSortBy,
  setSelectedCategory,
  setTempSearch,
  setSearch,
  setVisibleHeaderSearch,
  clearAllFilter,
}) {
  const theme = useTheme();
  return (
    <View
      style={{
        marginHorizontal: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: "white",
        elevation: 2,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        borderRadius: 12,
      }}
    >
      {visible ? (
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: 12, fontWeight: "600" }}
              textColor={theme.colors.onSurface}
            >
              Search Section
            </Text>
            <IconButton
              size={18}
              icon="chevron-up"
              onPress={() => setVisibleHeaderSearch(false)}
            />
          </View>
          <View>
            <View
              style={{
                flexDirection: "row",
                marginBottom: 5,
              }}
            >
              <TextInput
                placeholder={`Cari nama, status, harga, atau stok...`}
                mode="outlined"
                outlineColor={theme.colors.primary}
                value={search}
                outlineStyle={{ borderWidth: 2 }}
                right={
                  search ? (
                    <TextInput.Icon
                      size={18}
                      icon="close"
                      onPress={() => {
                        onChange("");
                      }}
                      style={{
                        alignItems: "flex-end",
                      }}
                    />
                  ) : (
                    <TextInput.Icon
                      size={18}
                      icon="magnify"
                      style={{
                        alignItems: "flex-end",
                      }}
                    />
                  )
                }
                onChangeText={(e) => {
                  onChange(e);
                }}
                placeholderTextColor={theme.colors.onBackground}
                textColor={theme.colors.onBackground}
                style={{
                  flex: 1,
                  padding: 0,
                  margin: 0,
                  height: 40,
                  fontSize: 11,
                  backgroundColor: theme.colors.elevation.level0,
                }}
              />
            </View>
            <Text
              style={{
                fontSize: 12,
                marginBottom: 8,
                color: "#333",
              }}
            >
              Kategori:
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {categories.map((category) => (
                  <Chip
                    mode={selectedCategory === category ? "outlined" : "flat"}
                    icon={""}
                    showSelectedCheck={false}
                    compact={true}
                    key={category}
                    selected={selectedCategory === category}
                    onPress={() => {
                      setSelectedCategory(category);
                      setClearFilter(true);
                    }}
                    style={{
                      backgroundColor:
                        selectedCategory === category
                          ? theme.colors.primaryContainer
                          : theme.colors.surface,
                    }}
                    textStyle={{
                      color:
                        selectedCategory === category
                          ? theme.colors.onPrimaryContainer
                          : theme.colors.onSurface,
                      fontSize: 10,
                    }}
                  >
                    {category}
                  </Chip>
                ))}
              </View>
            </ScrollView>
            <View>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  marginBottom: 8,
                  color: theme.colors.onSurface,
                }}
              >
                Urutkan berdasarkan:
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  {sortOptions.map((option) => (
                    <Chip
                      mode={sortBy === option.key ? "outlined" : "flat"}
                      key={option.key}
                      showSelectedCheck={false}
                      selected={sortBy === option.key}
                      onPress={() => {
                        setSortBy(option.key);
                        setClearFilter(true);
                      }}
                      icon={""}
                      style={{
                        backgroundColor:
                          sortBy === option.key
                            ? theme.colors.primaryContainer
                            : theme.colors.surface,
                      }}
                      textStyle={{
                        color:
                          sortBy === option.key
                            ? theme.colors.onPrimaryContainer
                            : theme.colors.onSurface,
                        fontSize: 10,
                      }}
                    >
                      {option.label}
                    </Chip>
                  ))}
                </View>
              </ScrollView>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  onPress={() => {
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    setClearFilter(true);
                  }}
                  mode="contained-tonal"
                  icon={sortOrder === "asc" ? "arrow-up" : "arrow-down"}
                  style={{
                    alignSelf: "flex-start",
                    backgroundColor: theme.colors.primaryContainer,
                    borderRadius: 8,
                  }}
                  contentStyle={{
                    padding: 0,
                    margin: 0,
                  }}
                  labelStyle={{ fontSize: 8, fontWeight: "600" }}
                  textColor={theme.colors.onPrimaryContainer}
                >
                  {sortOrder === "asc" ? "ASC" : "DESC"}
                </Button>
                {clearFilter && (
                  <Button
                    mode="contained-tonal"
                    onPress={clearAllFilter}
                    contentStyle={{
                      padding: 0,
                      margin: 0,
                    }}
                    style={{
                      alignSelf: "flex-start",
                      backgroundColor: theme.colors.primaryContainer,
                      fontWeight: "600",
                      borderRadius: 8,
                    }}
                    labelStyle={{ fontSize: 8, fontWeight: "600" }}
                    textColor={theme.colors.onPrimaryContainer}
                    icon="close"
                  >
                    Clear Filter
                  </Button>
                )}
              </View>
            </View>
          </View>
        </>
      ) : (
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: 11, fontWeight: "600" }}
              textColor={theme.colors.onSurface}
            >
              {clearFilter
                ? ` Filtering ${
                    search ?? ""
                  } Category ${selectedCategory} Sort by ${
                    sortBy && sortBy.slice(0, 1).toUpperCase() + sortBy.slice(1)
                      ? sortBy.slice(0, 1).toUpperCase() + sortBy.slice(1)
                      : "Name"
                  } ${sortOrder.toUpperCase() ?? "ASC"}`.trim()
                : "Search Section"}
            </Text>
            <IconButton
              size={18}
              icon="chevron-down"
              onPress={() => setVisibleHeaderSearch(true)}
            />
          </View>
        </>
      )}
    </View>
  );
}
