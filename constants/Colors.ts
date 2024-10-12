/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4"; // Main accent color for light mode
const tintColorDark = "#fff"; // Main accent color for dark mode

export const Colors = {
  light: {
    text: "#11181C", // Main text color for light mode
    background: "#fff", // Background color for light mode
    tint: tintColorLight, // Tint color for elements like buttons and icons in light mode
    icon: "#687076", // Color for icons in light mode
    tabIconDefault: "#687076", // Default color for tab icons in light mode
    tabIconSelected: tintColorLight, // Color for selected tab icons in light mode
    todoBackground: "#f9f9f9", // Background color for To-Do items in light mode
    inputBackground: "#f0f0f0", // Background color for input fields in light mode
    border: "#ccc", // Border color for input fields in light mode
  },
  dark: {
    text: "#ECEDEE", // Main text color for dark mode
    background: "#151718", // Background color for dark mode
    tint: tintColorDark, // Tint color for elements like buttons and icons in dark mode
    icon: "#9BA1A6", // Color for icons in dark mode
    tabIconDefault: "#9BA1A6", // Default color for tab icons in dark mode
    tabIconSelected: tintColorDark, // Color for selected tab icons in dark mode
    todoBackground: "#222222", // Background color for To-Do items in dark mode
    inputBackground: "#2a2a2a", // Background color for input fields in dark mode
    border: "#444444", // Border color for input fields in dark mode
  },
};
