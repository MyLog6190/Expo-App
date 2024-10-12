import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  TextInputChangeEventData,
  NativeSyntheticEvent,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import { Fontisto, MaterialCommunityIcons } from "@expo/vector-icons";
import { getWeatherInfo } from "@/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeColors = typeof Colors.light | typeof Colors.dark;

const STORAGE_KEY = "@toDos";

export default function HomeScreen() {
  const colorScheme = useColorScheme() === "dark" ? "dark" : "light";
  const themeColors = Colors[colorScheme];
  const [city, setCity] = useState<string | null>("Loading...");
  const [weatherInfo, setWeather] = useState<WeatherInfo | null>(null); // 초기 상태를 빈 배열로 설정
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

  type WeatherCondition =
    | "Clouds"
    | "Clear"
    | "Mist"
    | "Snow"
    | "Rain"
    | "Drizzle"
    | "Thunderstorm";

  interface WeatherInfo {
    main: {
      temp: number;
    };
    weather: Array<{
      main: WeatherCondition;
      description: string;
    }>;
  }

  interface ToDos {
    [key: string]: {
      text: string;
      working: Boolean;
    };
  }

  const icons: Record<WeatherCondition, keyof typeof Fontisto.glyphMap> = {
    Clouds: "cloudy",
    Clear: "day-sunny",
    Mist: "fog",
    Snow: "snow",
    Rain: "rains",
    Drizzle: "rain",
    Thunderstorm: "lightning",
  };

  const getLocation = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      console.log("위치정보 접근 거부");
      return;
    }

    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({});

    const city = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );

    const { region, district } = city[0];
    setCity(`${region} ${district}`);

    return { latitude, longitude };
  };

  const getWeather = async () => {
    const result = await getLocation();

    if (result) {
      const { latitude, longitude } = result;
      const weatherData: WeatherInfo = await getWeatherInfo(
        latitude,
        longitude
      );
      setWeather(weatherData);
    } else {
      console.log("위치 정보를 찾을 수 없습니다.");
    }
  };

  useEffect(() => {
    getWeather();
  }, []);

  const dynamicStyles = styles(themeColors);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View style={dynamicStyles.container}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <View style={dynamicStyles.weatherContainer}>
        <View style={dynamicStyles.local}>
          <Text style={dynamicStyles.cityName}>{city}</Text>
        </View>
        <View style={dynamicStyles.dayInfo}>
          {weatherInfo ? (
            <View style={dynamicStyles.weather}>
              <Fontisto
                size={55}
                color={themeColors.icon}
                name={icons[weatherInfo.weather[0].main]}
              />
              <View style={dynamicStyles.day}>
                <Text style={dynamicStyles.temp}>
                  {weatherInfo.main.temp.toFixed(1)}
                  <MaterialCommunityIcons
                    name="temperature-celsius"
                    size={24}
                    color="black"
                  />
                </Text>
                <Text style={dynamicStyles.description}>
                  {weatherInfo.weather[0].main}
                </Text>
                <Text style={dynamicStyles.tinyText}>
                  {weatherInfo.weather[0].description}
                </Text>
              </View>
            </View>
          ) : (
            <View style={dynamicStyles.weather}>
              <ActivityIndicator
                color="white"
                style={{ marginTop: 10 }}
                size="large"
              />
            </View>
          )}
          <View style={dynamicStyles.clockContainer}>
            <Text style={dynamicStyles.clockText}>{formattedTime}</Text>
          </View>
        </View>
      </View>
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
    weatherContainer: {
      padding: 30,
      marginVertical: 20, // Use marginVertical for consistent spacing
      borderRadius: 15, // Rounded corners
      backgroundColor: themeColors.background,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 5,
    },
    local: {
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 15, // Increased margin for better spacing
    },
    cityName: {
      fontSize: 18, // Increased font size for visibility
      fontWeight: "bold",
      color: themeColors.text,
      textAlign: "center", // Center the text
    },
    weather: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 10, // Add some top margin
    },
    day: {
      textAlign: "center",
      marginLeft: 15,
    },
    temp: {
      fontWeight: "700", // Bolder temperature font
      fontSize: 28, // Larger font for temperature
      color: themeColors.text,
    },
    description: {
      marginTop: 5,
      fontSize: 16, // Increased font size for better readability
      color: themeColors.text,
      textAlign: "center",
    },
    tinyText: {
      fontSize: 12, // Slightly larger than before for readability
      color: themeColors.text,
      textAlign: "center",
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
      backgroundColor: themeColors.inputBackground || "#fff", // Optional input background color
      borderWidth: 1,
      borderColor: themeColors.border || "#ccc", // Optional border for the input
    },
    todo: {
      padding: 15,
      marginVertical: 5, // Space between to-do items
      borderRadius: 15,
      backgroundColor: themeColors.todoBackground || "#f9f9f9", // Optional background for to-do items
      shadowColor: "#000",
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

    dayInfo: {
      flexDirection: "row",
    },
    clockContainer: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: themeColors.background, // 기존 배경색 사용
      padding: 20,
      borderRadius: 15,

      marginTop: 20,
    },
    clockText: {
      fontSize: 30, // 폰트 크기 조정
      fontWeight: "bold",
      fontFamily: "Digital", // 디지털 스타일 폰트 사용
      color: themeColors.text, // 테마에 따라 텍스트 색상 변경
      textAlign: "center",
    },
  });
