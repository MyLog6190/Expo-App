import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { Fontisto, MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { getWeatherInfo } from "@/api/api";

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
const icons: Record<WeatherCondition, keyof typeof Fontisto.glyphMap> = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Mist: "fog",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};
type ThemeColors = typeof Colors.light | typeof Colors.dark;

function Weather() {
  const colorScheme = useColorScheme() === "dark" ? "dark" : "light";
  const [city, setCity] = useState<string | null>("Loading...");
  const [weatherInfo, setWeather] = useState<WeatherInfo | null>(null); // 초기 상태를 빈 배열로 설정
  const [currentTime, setCurrentTime] = useState(new Date());

  const themeColors = Colors[colorScheme];
  const dynamicStyles = styles(themeColors);

  const month = currentTime.toLocaleString("default", { month: "long" }); // 월 이름 (예: "October")
  const day = currentTime.getDate(); // 일
  const dayOfWeek = currentTime.toLocaleString("default", { weekday: "long" }); // 요일 (예: "Saturday")

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
    <View style={dynamicStyles.weatherContainer}>
      <View style={dynamicStyles.local}>
        <Text style={dynamicStyles.cityName}>{city}</Text>
      </View>

      <View style={dynamicStyles.dayInfo}>
        <View style={dynamicStyles.clockContainer}>
          <Text style={dynamicStyles.clockText}>{formattedTime}</Text>
          <Text>{`${month} ${day}일 ${dayOfWeek}`}</Text>
        </View>
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
      </View>
    </View>
  );
}
const styles = (themeColors: ThemeColors) =>
  StyleSheet.create({
    weatherContainer: {
      padding: 25,
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
    dayInfo: {
      flexDirection: "row",
      justifyContent: "space-between",
    },

    weather: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 10, // Add some top margin
    },
    day: {
      justifyContent: "center",
      textAlign: "center",
      marginLeft: 15,
    },
    temp: {
      fontWeight: "700", // Bolder temperature font
      fontSize: 20, // Larger font for temperature
      color: themeColors.text,
    },
    description: {
      marginTop: 5,
      fontSize: 12, // Increased font size for better readability
      color: themeColors.text,
      textAlign: "center",
    },
    tinyText: {
      fontSize: 10, // Slightly larger than before for readability
      color: themeColors.text,
      textAlign: "center",
    },

    clockContainer: {
      alignItems: "center",
      backgroundColor: themeColors.background, // 기존 배경색 사용
      borderRadius: 15,
      marginTop: 8,
      marginBottom: 4,
    },
    clockText: {
      fontSize: 27, // 폰트 크기 조정
      fontWeight: "bold",
      color: themeColors.text, // 테마에 따라 텍스트 색상 변경
      textAlign: "center",
    },
  });

export default Weather;
