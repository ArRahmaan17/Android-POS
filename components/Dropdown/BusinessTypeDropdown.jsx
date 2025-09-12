import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Icon, Text, TextInput, useTheme } from "react-native-paper";

const BusinessTypeDropdown = ({
  value,
  onSelect,
  options = [],
  placeholder = "Select business type",
}) => {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const filteredOptions = options.filter((option) => {
    return option.name.toLowerCase().includes(searchQuery.toLowerCase());
  });
  const selectedOption = options.find((option) => option.id === value);
  const handleSelect = (option) => {
    onSelect(option);
    setVisible(false);
    setSearchQuery("");
  };
  useEffect(() => {
    handleSelect(value);
  }, []);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.input,
          { borderColor: theme.colors.primary, borderWidth: 2 },
        ]}
        onPress={() => setVisible(true)}
      >
        <Text style={[styles.inputText, !value && styles.placeholder]}>
          {selectedOption ? selectedOption.name : placeholder}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search business types..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                mode="outlined"
                dense
              />
            </View>
            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    item.id === value && {
                      backgroundColor: theme.colors.primaryContainer,
                    },
                  ]}
                  onPress={() => {
                    handleSelect(item.id);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item.id === value && { color: theme.colors.primary },
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
              style={styles.optionsList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: "white",
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  placeholder: {
    color: "#000",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 8,
    width: "90%",
    maxHeight: "70%",
    elevation: 5,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  searchInput: {
    backgroundColor: "white",
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
});

export default BusinessTypeDropdown;
