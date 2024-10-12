# React Native 및 Expo 이벤트 처리 및 개발 개요

## 이벤트 처리 흐름

### 1. Event, Collect data and notify (Native)

iOS와 Android에서 발생하는 이벤트를 리스닝하고 해당 이벤트를 JavaScript로 전달합니다.  
**예시**: 버튼을 누르면 "버튼이 눌렸다는" 메시지를 전달.

### 2. Serialized payload (Bridge)

이벤트 메시지를 네이티브 브리지(Bridge)를 통해 JavaScript로 전달합니다.

### 3. Process event (JavaScript)

iOS 또는 Android에서 전달된 이벤트를 처리합니다.  
**예시**: "버튼이 눌렸습니다" 메시지를 수신하면 배경색을 빨간색으로 변경하는 코드를 실행.

### 4. Call native methods or update UI (JavaScript)

JavaScript에서 처리한 결과를 네이티브에 다시 전달하여 UI를 업데이트하거나 네이티브 메서드를 호출합니다.  
**예시**: 배경색을 빨간색으로 변경하라고 OS에 요청.

### 5. Serialized batched response

실행된 네이티브 요청에 대한 결과를 다시 JavaScript로 전달합니다.

### 6. Process commands, Update UI

메시지를 처리하고 결과를 사용자에게 보여줍니다.

---

## Expo 개요

Expo는 Android Studio나 Xcode와 같은 네이티브 개발 도구 없이 앱을 쉽게 개발하고 테스트할 수 있는 플랫폼입니다. iOS와 Android를 동시에 지원하며, **동일한 코드베이스**로 두 플랫폼에서 앱을 실행할 수 있습니다.

### Expo의 주요 장점:

- **손쉬운 설치 및 설정**: Java나 Xcode 없이 앱을 실행 가능.
- **동일한 코드베이스**: iOS 및 Android 앱을 동시에 개발 가능.
- **Expo Go 앱**을 통한 빠른 테스트: 앱을 빌드하지 않고 바로 실행 및 테스트.

---

## Expo 설치 및 설정

### 1. 프로젝트에 Expo 설치:

글로벌 설치 대신 프로젝트 내에서 Expo를 사용합니다.

```bash
npx create-expo-app@latest [파일이름]
```

### 2. Expo 로그인 및 실행:

로그인 후 앱을 실행합니다.

```bash
# 로그인
expo login
# 실행
npx expo start --tunnel
```

### 3. Expo Go 연동:

Expo Go 앱을 통해 코드를 연동하고 테스트합니다. 터미널에서 \`r\`을 눌러 앱을 리로드할 수 있습니다.

---

## 주요 컴포넌트 및 API

### 1. **View**

HTML의 \`div\`와 유사하게 화면의 뷰를 구성하는 데 사용.

### 2. **Text**

텍스트 표시를 위한 컴포넌트.

### 3. **StyleSheet**

컴포넌트에 CSS 스타일을 적용.

### 4. **StatusBar**

앱 상단의 상태바(시간, 배터리 상태 등)를 설정.

### 5. **AsyncStorage**

웹의 Local Storage와 유사한 데이터 저장소.

### 6. **ScrollView**

스크롤 가능한 뷰:

- \`horizontal\`: 가로 스크롤 설정.
- \`pagingEnabled\`: 페이지 단위 스크롤.
- \`showHorizontalScrollIndicator\`: 스크롤바 표시 여부.
- \`contentContainerStyle\`: ScrollView의 CSS 스타일 적용.

### 7. **Location API**

- \`requestForegroundPermissionsAsync()\`: 위치 정보 접근 요청.
- \`getCurrentPositionAsync({})\`: 현재 위치 정보 가져오기.
- \`reverseGeocodeAsync({latitude, longitude})\`: 위도와 경도를 주소로 변환.

### 8. **Dimension**

화면 크기를 가져오는 API.

---

## 아이콘 사용

Expo에서는 **Vector Icons** 라이브러리를 사용하여 아이콘을 추가할 수 있습니다.  
**사용 예시**:

```javascript
import * as Icon from "@expo/vector-icons";
```

아이콘 검색: [Expo Icons](https://icons.expo.fyi/)

---

## 터치 가능한 컴포넌트

### 1. **TouchableOpacity**

애니메이션 효과가 있는 터치 가능한 뷰.

### 2. **TouchableHighlight**

클릭 시 배경색 변화 등 더 많은 속성을 제공.

### 3. **TouchableWithoutFeedback**

애니메이션 효과가 없는 터치 가능한 뷰.

## pressable : TouchableOpacity 대체하기 위해 나옴 많은 속성을 가지고 있다.

error

Expo Go 강제 종료 Error

```

fontWeight: "600", 문자열이 아니라 숫자 600을 사용해서 Expo Go가 강제 종료됨
StyleSheet로 에러 내면 Expo Go 강제 종료

tap: {
      fontSize: 30,
      fontWeight: "600",
      color: themeColors.text,
    }
```

타입 Error

```
Type 'string' is not assignable to type '"cloudy" | "day-sunny" | "snow" | "rains" | "rain" | "lightning" | "bold" | "medium" | "justify" | "key" | "map" | "filter" | "at" | "search" | "anchor" | "link" | "code" | "picture" | ... 599 more ... | undefined'.ts(2322)


// 타입을 string으로 했을 때 Fontisto name에서 타입 오류가 나옴
// 타입을 keyof typeof Fontisto.glyphMap 변경함
// keyof typeof Fontisto.glyphMap 실제 아이콘으로 사용 가능한 이름만 허용

 const icons: Record<WeatherCondition, keyof typeof Fontisto.glyphMap> = {
    Clouds: "cloudy",
    Clear: "day-sunny",
    Snow: "snow",
    Rain: "rains",
    Drizzle: "rain",
    Thunderstorm: "lightning",
  };

<Fontisto size={65} color={themeColors.icon}
     name={icons[weatherInfo.weather[0].main]} />
```

```
   Type '(payload: string) => void' is not assignable to type 'void'.ts(2322)
    index.tsx(29, 30): Did you mean to call this expression

    No overload matches this call.
  Overload 1 of 2, '(props: TextInputProps): TextInput', gave the following error.

  Argument of type 'NativeSyntheticEvent<TextInputChangeEventData>' is not assignable to parameter of type 'SetStateAction<string>'
```
