import TodoList from "@/components/TodoList";
import Weather from "@/components/Weather";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

type ThemeColors = typeof Colors.light | typeof Colors.dark;

export default function HomeScreen() {
  const colorScheme = useColorScheme() === "dark" ? "dark" : "light";
  const themeColors = Colors[colorScheme];

  const dynamicStyles = styles(themeColors);

  return (
    <View style={dynamicStyles.container}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Weather />
      <TodoList />
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
  });
