import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
} from "react-native";
import {
  Text,
  useTheme,
  IconButton,
  TextInput,
  Surface,
} from "react-native-paper";

export default function SearchableDropdown({
  label,
  value,
  options = [],
  onValueChange,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  style,
  disabled = false,
  maxHeight = 300,
}) {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const selectedOption = options.find((option) => option.id === value);
  const filteredOptions = useMemo(
    () =>
      options.filter((option) =>
        option.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [options, searchQuery]
  );

  const handleSelect = (selectedValue) => {
    onValueChange(selectedValue);
    setVisible(false);
    setSearchQuery("");
  };

  const openDropdown = () => {
    if (!disabled) {
      setVisible(true);
    }
  };

  const closeDropdown = () => {
    setVisible(false);
    setSearchQuery("");
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.optionItem,
        {
          backgroundColor:
            item.id === value ? theme.colors.primaryContainer : "transparent",
        },
      ]}
      onPress={() => handleSelect(item.id)}
    >
      <Text
        style={[
          styles.optionText,
          {
            color:
              item.id === value
                ? theme.colors.onPrimaryContainer
                : theme.colors.onSurface,
          },
        ]}
      >
        {item.name}
      </Text>
      {item.id === value && (
        <IconButton
          icon="check"
          size={20}
          iconColor={theme.colors.onPrimaryContainer}
        />
      )}
    </TouchableOpacity>
  );
  return (
    <>
      <TouchableOpacity
        onPress={openDropdown}
        style={[
          styles.dropdownInput,
          {
            borderColor: disabled ? theme.colors.outline : theme.colors.outline,
            backgroundColor: disabled ? theme.colors.surfaceDisabled : "white",
            opacity: disabled ? 0.6 : 1,
          },
          style,
        ]}
        disabled={disabled}
      >
        {label && (
          <Text
            style={[
              styles.dropdownLabel,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {label}
          </Text>
        )}
        <View style={styles.dropdownContent}>
          <Text
            style={[
              styles.dropdownText,
              {
                color: value
                  ? theme.colors.onSurface
                  : theme.colors.onSurfaceVariant,
              },
            ]}
          >
            {selectedOption ? selectedOption.name : placeholder}
          </Text>
          <IconButton
            icon="chevron-down"
            size={20}
            iconColor={theme.colors.onSurfaceVariant}
          />
        </View>
      </TouchableOpacity>

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
                  backgroundColor: theme.colors.surface,
                  maxHeight: maxHeight,
                },
              ]}
              elevation={8}
            >
              <View style={styles.searchContainer}>
                <TextInput
                  mode="outlined"
                  placeholder={searchPlaceholder}
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
                data={filteredOptions}
                keyExtractor={(item, index) => `${item}_${index}`}
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
    </>
  );
}

const styles = StyleSheet.create({
  dropdownInput: {
    marginTop: 6,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
  },
  dropdownLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  dropdownContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
    flex: 1,
  },
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
});
