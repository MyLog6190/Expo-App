import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputChangeEventData,
  TouchableOpacity,
  View,
} from "react-native";

const STORAGE_KEY = "@toDos";
type ThemeColors = typeof Colors.light | typeof Colors.dark;

function TodoList() {
  const colorScheme = useColorScheme() === "dark" ? "dark" : "light";
  const themeColors = Colors[colorScheme];
  const dynamicStyles = styles(themeColors);

  const [working, setWorking] = useState(true);
  const work = () => setWorking(true);
  const travel = () => setWorking(false);
  const [text, setText] = useState<string>("");

  const onChangeText = (
    e: NativeSyntheticEvent<TextInputChangeEventData>
  ): void => setText(e.nativeEvent.text);
  const [toDos, setToDos] = useState<ToDos>({});

  const saveToDos = async (data: ToDos) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const loadToDos = async () => {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (!data) return;
    setToDos(JSON.parse(data));
  };

  const deleteToDo = async (key: string) => {
    const newToDos = { ...toDos };
    delete newToDos[key];
    setToDos(newToDos);
    await saveToDos(newToDos);
  };

  useEffect(() => {
    loadToDos();
  }, []);

  const addToDo = async () => {
    if (text === "") {
      return;
    }
    const newToDos = Object.assign({}, toDos, {
      [Date.now()]: { text, working: working },
    });
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };

  interface ToDos {
    [key: string]: {
      text: string;
      working: Boolean;
    };
  }

  return (
    <View style={dynamicStyles.todoContainer}>
      <View style={dynamicStyles.todoHeader}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{
              ...dynamicStyles.tap,
              color: working ? themeColors.tint : themeColors.text,
            }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...dynamicStyles.tap,
              color: working
                ? (themeColors.text as string)
                : (themeColors.tint as string),
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          onChange={onChangeText}
          onSubmitEditing={addToDo}
          value={text}
          placeholder={working ? "Add a To Do" : "Where do you want go"}
          style={dynamicStyles.input}
        />
        <ScrollView>
          {Object.keys(toDos).map((key) =>
            toDos[key].working === working ? (
              <View key={key} style={dynamicStyles.todo}>
                <Text>{toDos[key].text}</Text>
              </View>
            ) : null
          )}
        </ScrollView>
      </View>
    </View>
  );
}
const styles = (themeColors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
      padding: 20, // Add some padding to the main container
    },

    todoContainer: {
      flex: 4,
      backgroundColor: themeColors.background,
      padding: 20,
      borderRadius: 15,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
    todoHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 15, // Spacing below the header
    },
    tap: {
      fontSize: 24, // Adjusted font size for balance
      fontWeight: "600",
      padding: 10, // Added padding for touchable area
    },
    input: {
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 30,
      fontSize: 18, // Adjusted font size
      marginTop: 20,
      backgroundColor: themeColors.inputBackground,
      borderWidth: 1,
      borderColor: themeColors.border,
    },
    todo: {
      padding: 15,
      marginVertical: 5,
      borderRadius: 15,
      backgroundColor: themeColors.todoBackground,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 2,
    },
    todoText: {
      color: themeColors.text,
      fontSize: 16,
      fontWeight: "500",
    },
  });

export default TodoList;
