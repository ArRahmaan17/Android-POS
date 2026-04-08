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
import { debounce, wordBreak } from "../helpers/ConvertHelper";
import CONFIG from "../config";

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
        backgroundColor: theme.colors.background,
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
            <Text style={{ fontSize: 12, fontWeight: "700" }} textColor="black">
              Search Section
            </Text>
            <IconButton
              size={18}
              icon="chevron-up"
              iconColor="black"
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
                outlineStyle={{ borderWidth: 1.5 }}
                right={
                  search ? (
                    <TextInput.Icon
                      size={18}
                      iconColor="black"
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
                      iconColor="black"
                      style={{
                        alignItems: "flex-end",
                      }}
                    />
                  )
                }
                onChangeText={(e) => {
                  setSearch(e);
                  debounce(onChange(e), CONFIG.NUMBER.DEFAULT_DEBOUNCE_TIME);
                }}
                placeholderTextColor={theme.colors.onBackground}
                textColor={theme.colors.onBackground}
                style={{
                  flex: 1,
                  padding: 0,
                  margin: 0,
                  height: 40,
                  fontSize: 12,
                  fontWeight: "700",
                  backgroundColor: theme.colors.elevation.level0,
                }}
              />
            </View>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "700",
                marginBottom: 8,
                color: theme.colors.onPrimaryContainer,
              }}
            >
              Category:
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {categories.map((category) => (
                  <Chip
                    mode={"flat"}
                    showSelectedCheck={false}
                    compact={true}
                    key={category.key}
                    selected={selectedCategory === category.key}
                    onPress={() => {
                      setSelectedCategory(category.key);
                      setClearFilter(true);
                    }}
                    style={{
                      backgroundColor:
                        selectedCategory === category.key
                          ? theme.colors.primary
                          : theme.colors.primaryContainer,
                    }}
                    textStyle={{
                      color:
                        selectedCategory === category.key
                          ? theme.colors.onPrimary
                          : theme.colors.onPrimaryContainer,
                      fontSize: 10,
                    }}
                  >
                    {category.label}
                  </Chip>
                ))}
              </View>
            </ScrollView>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "700",
                marginVertical: 5,
                color: theme.colors.onPrimaryContainer,
              }}
            >
              Sort by:
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
                    mode={"flat"}
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
                          ? theme.colors.primary
                          : theme.colors.primaryContainer,
                    }}
                    textStyle={{
                      color:
                        sortBy === option.key
                          ? theme.colors.onPrimary
                          : theme.colors.onPrimaryContainer,
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
                  backgroundColor: theme.colors.primaryContainer,
                  borderRadius: 8,
                }}
                labelStyle={{ fontSize: 10, fontWeight: "700" }}
                textColor={theme.colors.onPrimaryContainer}
                contentStyle={{ padding: 0, margin: -2 }}
              >
                {sortOrder === "asc" ? "ASC" : "DESC"}
              </Button>
              {clearFilter && (
                <Button
                  mode="contained-tonal"
                  onPress={clearAllFilter}
                  style={{
                    backgroundColor: theme.colors.primaryContainer,
                    borderRadius: 8,
                  }}
                  labelStyle={{ fontSize: 10, fontWeight: "700" }}
                  textColor={theme.colors.onPrimaryContainer}
                  icon="close"
                  contentStyle={{ padding: 0, margin: -2 }}
                >
                  Clear Filter
                </Button>
              )}
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
              style={{ fontSize: 12, fontWeight: "700" }}
              textColor={theme.colors.onPrimaryContainer}
            >
              {clearFilter
                ? wordBreak(
                    `Filtering ${search ?? ""} Category ${
                      selectedCategory.label
                    } Sort by ${
                      sortBy &&
                      sortBy.slice(0, 1).toUpperCase() + sortBy.slice(1)
                        ? sortBy.slice(0, 1).toUpperCase() + sortBy.slice(1)
                        : "Created At"
                    } ${sortOrder.toUpperCase() ?? "ASC"}`,
                    50
                  ).trim()
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
