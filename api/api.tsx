import Constants from "expo-constants";

const apiKey: string | undefined = Constants.expoConfig?.extra?.apiKey;
const OPEN_WEATHER_DOMAIN = `https://api.openweathermap.org/data/2.5`;
const API_DOMIN = (lat: number, lon: number) =>
  `${OPEN_WEATHER_DOMAIN}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

export const getWeatherInfo = async (latitude: number, longitude: number) => {
  const response = await fetch(API_DOMIN(latitude, longitude));
  return response.json();
};
