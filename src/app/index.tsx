import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState("");
  const [checkedItems, setCheckedItems] = useState<boolean[]>([]);

  const saveItemsToStorage = async () => {
    try {
      await AsyncStorage.setItem("@items", JSON.stringify(items));
    } catch (e) {
      console.error("Erro ao salvar itens", e);
    }
  };

  const loadItemsFromStorage = async () => {
    try {
      const storedItems = await AsyncStorage.getItem("@items");
      if (storedItems) {
        const parsedItems = JSON.parse(storedItems);
        setItems(parsedItems);
        setCheckedItems(new Array(parsedItems.length).fill(false));
      }
    } catch (e) {
      console.error("Erro ao carregar itens", e);
    }
  };

  useEffect(() => {
    loadItemsFromStorage();
  }, []);

  useEffect(() => {
    saveItemsToStorage();
  }, [items]);

  const handleAddItem = () => {
    if (newItem.trim()) {
      setItems([...items, newItem]);
      setCheckedItems([...checkedItems, false]);
      setNewItem("");
    }
  };

  const handleDeleteItem = () => {
    const remainingItems = items.filter((_, i) => !checkedItems[i]);
    setItems(remainingItems);
    setCheckedItems(checkedItems.filter(item => !item));
  };

  const handleDeleteItemByIndex = (index: number) => {
    const remainingItems = items.filter((_, i) => i !== index);
    setItems(remainingItems);
    setCheckedItems(checkedItems.filter((_, i) => i !== index));
  };

  const toggleCheck = (index: number) => {
    const updatedCheckedItems = [...checkedItems];
    updatedCheckedItems[index] = !updatedCheckedItems[index];
    setCheckedItems(updatedCheckedItems);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Lista de tarefas</Text>

      <TextInput
        style={styles.input}
        placeholder="Adicione um novo item"
        placeholderTextColor="#9CA3AF"
        value={newItem}
        onChangeText={setNewItem}
      />

      <TouchableOpacity onPress={handleAddItem} style={styles.button}>
        <Text style={styles.textButton}>Adicionar item</Text>
      </TouchableOpacity>

      <View style={{ width: "100%" }}>
        {items.map((item, index) => (
          <View key={index} style={[styles.card, checkedItems[index] && styles.checkedCard]}>
            <View style={styles.infoCard}>
              <TouchableOpacity onPress={() => toggleCheck(index)}>
                <MaterialIcons
                  name={checkedItems[index] ? "check-box" : "check-box-outline-blank"}
                  size={16}
                  color={checkedItems[index] ? "#10B981" : "black"}
                />
              </TouchableOpacity>
              <Text style={[styles.textItem, checkedItems[index] && styles.checkedText]}>
                {item}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                const selectedItems = checkedItems.filter(checked => checked);
                if (selectedItems.length > 1 && checkedItems[index]) {
                  handleDeleteItem();
                } else {
                  handleDeleteItemByIndex(index);
                }
              }}
            >
              <MaterialIcons name="delete-outline" size={24} color="#6B6671" style={styles.checkedText} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 30,
    paddingTop: 60,
    backgroundColor: "#F4F5FB",
    alignItems: "center",
  },
  title: {
    color: "#111827",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 50,
  },
  input: {
    width: "100%",
    height: 44,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    width: "100%",
    height: 44,
    backgroundColor: "#CA3884",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  textButton: {
    fontWeight: "600",
    color: "#FFFFFF",
    fontSize: 16,
  },
  card: {
    width: "100%",
    height: 57,
    backgroundColor: "#FFFFFF",
    elevation: 15,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  checkedCard: {
    backgroundColor: "#CA3884",
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  textItem: {
    color: "#374151",
    fontSize: 17,
  },
  checkedText: {
    color: "black",
  },
});
