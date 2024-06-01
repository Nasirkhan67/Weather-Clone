// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   Alert,
//   StyleSheet,
//   ActivityIndicator,
//   ScrollView,
//   RefreshControl,
//   SafeAreaView,
//   Image,
//   FlatList,
//   TextInput,
//   TouchableOpacity,
//   ImageBackground,
//   Modal,
//   Pressable
// } from 'react-native';
// import * as Location from 'expo-location';

// const API_KEY = '2a0235b040231eceb04be90d42cb634a';

// const Weather = () => {
//   const [forecast, setForecast] = useState(null);
//   const [refreshing, setRefreshing] = useState(false);
//   const [locationName, setLocationName] = useState('');
//   const [searchText, setSearchText] = useState('');
//   const [currentDateTime, setCurrentDateTime] = useState(new Date());
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedWeather, setSelectedWeather] = useState(null);

//   const loadForecast = async (latitude, longitude) => {
//     setRefreshing(true);
//     try {
//       const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
//       const response = await fetch(apiUrl);
//       const data = await response.json();

//       if (response.status >= 200 && response.status < 300) {
//         setForecast(data);
//         const locationNameResponse = await Location.reverseGeocodeAsync({ latitude, longitude });
//         const { city, country } = locationNameResponse[0];
//         setLocationName(`${city}, ${country}`);
//       } else {
//         throw new Error('Failed to fetch weather data. Please check your internet connection and try again.');
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       Alert.alert('Error', error.message);
//     }

//     setRefreshing(false);
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentDateTime(new Date());
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     (async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission to access location was denied');
//         return;
//       }

//       const location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
//       if (location) {
//         loadForecast(location.coords.latitude, location.coords.longitude);
//       }
//     })();
//   }, []);

//   const handleSearch = async () => {
//     if (!searchText.trim()) {
//       Alert.alert('Invalid Input', 'Please enter a valid location.');
//       return;
//     }

//     setRefreshing(true);

//     try {
//       const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${searchText}&appid=${API_KEY}&units=metric`);
//       const data = await response.json();

//       if (response.status >= 200 && response.status < 300) {
//         setForecast(data);
//         setLocationName(searchText);
//         setSearchText('');
//       } else {
//         throw new Error('Failed to fetch weather data. Please check your internet connection and try again.');
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error.message);
//       Alert.alert('Error', error.message);
//     }

//     setRefreshing(false);
//   };

//   const handleWeatherIconPress = (weather) => {
//     setSelectedWeather(weather);
//     setModalVisible(true);
//   };

//   if (!forecast || !forecast.list) {
//     return (
//       <SafeAreaView style={styles.loading}>
//         <ActivityIndicator size="large" />
//       </SafeAreaView>
//     );
//   }

//   const currentWeatherData = forecast.list.find(item => new Date(item.dt * 1000) > new Date());
//   const currentWeather = currentWeatherData && currentWeatherData.weather[0];
//   const currentTemperature = currentWeatherData ? Math.round(currentWeatherData.main.temp) : null;
//   const dailyForecasts = forecast.list.filter((item, index) => index % 8 === 0 && index < 10 * 8);

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.backgroundContainer}>
//         <ImageBackground
//           source={require('./sunny.png')}
//           style={styles.backgroundImage}
//           resizeMode="cover"
//         >
//           <ScrollView
//             refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadForecast(forecast.city.coord.lat, forecast.city.coord.lon)} />}
//           >
//             <Text style={styles.title}>Current Weather</Text>
//             <View style={styles.searchContainer}>
//               <TextInput
//                 style={styles.searchInput}
//                 value={searchText}
//                 onChangeText={setSearchText}
//                 placeholder="Enter location"
//               />
//               <TouchableOpacity onPress={handleSearch}>
//                 <Image source={require('./icon.png')} style={{ width: 24, height: 24 }} />
//               </TouchableOpacity>
//             </View>
//             <Text style={styles.locationText}>Location: {locationName}</Text>
//             {currentWeather && (
//               <>
//                 <Text style={styles.weatherText}>
//                   {currentWeather.description.charAt(0).toUpperCase() + currentWeather.description.slice(1)}
//                 </Text>
//                 <TouchableOpacity onPress={() => handleWeatherIconPress(currentWeather)}>
//                   <Image
//                     style={styles.weatherIcon}
//                     source={{ uri: `http://openweathermap.org/img/wn/${currentWeather.icon}.png` }}
//                   />
//                 </TouchableOpacity>
//               </>
//             )}
//             {currentTemperature !== null && <Text style={styles.tempText}>{currentTemperature}°C</Text>}
//             <View style={styles.weatherInfoContainer}>
//               <View style={styles.weatherInfo}>
//                 {/* <FontAwesome5 name="temperature-high" size={24} color="black" /> */}
//                 <Image source={require('./temperature.png')}style={{height:27,width:27,}}/>
//                 <Text style={styles.feelsLikeText}>Feels like: {currentWeatherData && Math.round(currentWeatherData.main.feels_like)}°C</Text>
//               </View>
//               <View style={styles.weatherInfo}>
//                 {/* <MaterialCommunityIcons name="water-percent" size={24} color="black" /> */}
//                 <Image source={require('./weather.png')}style={{height:28,width:24}}/>
//                 <Text style={styles.feelsLikeText}>Humidity: {currentWeatherData && Math.round(currentWeatherData.main.humidity)}%</Text>
//               </View>
//               <View style={styles.weatherInfo}>
//                  <Image source={require('./chance.png')}style={{height:28,width:28}}/>
//                 <Text style={styles.feelsLikeText}>Rain Chance: {currentWeatherData && currentWeatherData.pop}%</Text>
//               </View>
//               <View style={styles.weatherInfo}>
//                <Image source={require('./speeds.jpg')} style={{height:28,width:27,backgroundColor:'rgba(255, 255, 255, 0.5)'}}/>
//                 <Text style={styles.feelsLikeText}>Wind Speed: {currentWeatherData && currentWeatherData.wind.speed} m/s</Text>
//               </View>
//               <View style={styles.weatherInfo}>
//                 <Image source={require('./visibility 3.png')} style={styles.iconImage}/>
//                 <Text style={styles.feelsLikeText}>Visibility: {currentWeatherData && currentWeatherData.visibility} m</Text>
//               </View>
//             </View>
//             <Text style={styles.submit}>Hourly Forecast</Text>
//             <FlatList
//               data={dailyForecasts}
//               keyExtractor={(item) => item.dt.toString()}
//               renderItem={({ item }) => {
//                 const weather = item.weather[0];
//                 const dt = new Date(item.dt * 1000);
//                 const dayName = dt.toLocaleDateString('en-US', { weekday: 'short' });
//                 return (
//                   <View style={styles.dailyForecast}>
//                     <Text style={styles.dayText}>
//                       {dayName}
//                     </Text>
//                     <TouchableOpacity onPress={() => handleWeatherIconPress(weather)}>
//                       <Image style={styles.weatherIcon} source={{ uri: `http://openweathermap.org/img/wn/${weather.icon}.png` }} />
//                       <Text style={styles.temperatureText}>{Math.round(item.main.temp)}°C</Text>
//                     </TouchableOpacity>
//                   </View>
//                 );
//               }}
//               horizontal
//             />
//           </ScrollView>
//         </ImageBackground>
//       </View>
//       <View style={styles.dateTimeContainer}>
//         <Text style={styles.dateTimeText}>{currentDateTime.toLocaleDateString()} {currentDateTime.toLocaleTimeString()}</Text>
//       </View>
//       <Pressable onPress={() => setModalVisible(false)}>
//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={modalVisible}
//           onRequestClose={() => {
//             Alert.alert('Modal has been closed.');
//             setModalVisible(false);
//           }}>
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <Text style={styles.modalTitle}>Weather Details</Text>
//               {selectedWeather && (
//                 <>
//                   <Text style={styles.modalText}>Description: {selectedWeather.description}</Text>
//                   <Text style={styles.modalText}>Icon: {selectedWeather.icon}</Text>
//                 </>
//               )}
//               <TouchableOpacity onPress={() => setModalVisible(false)}>
//                 <Text style={styles.closeButton}>Close</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>
//       </Pressable>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ECDBBA',
//   },
//   backgroundContainer: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   backgroundImage: {
//     flex: 1,
//   },
//   loading: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#ECDBBA',
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: 'white',
//     textAlign: 'center',
//     marginTop: 20,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginHorizontal: 20,
//     marginTop: 20,
//     marginBottom: 10,
//     paddingHorizontal: 10,
//     backgroundColor: 'white',
//     borderRadius: 25,
//     borderWidth: 1,
//     height: 50,
//   },
//   searchInput: {
//     flex: 1,
//     padding: 10,
//   },
//   locationText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: 'black',
//     textAlign: 'center',
//     marginTop: 10,
//   },
//   weatherText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: 'white',
//     textAlign: 'center',
//   },
//   weatherIcon: {
//     width: 100,
//     height: 100,
//     alignSelf: 'center',
//     marginBottom: 15,

//   },
//   tempText: {
//     fontSize: 50,
//     fontWeight: 'bold',
//     color: 'black',
//     textAlign: 'center',

//   },
//   feelsLikeText: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: 'black',
//     textAlign: 'center',
//   },
//   weatherInfoContainer: {
//     flexDirection: "row",
//     marginTop: 20,
//     borderRadius: 15,
//     justifyContent: "space-between",
//     padding: 10,
//   },
//   weatherInfo: {
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.5)',
//     padding: 10,
//     borderRadius: 15,
//     flex: 1,
//     marginHorizontal: 5
//   },
//   submit: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: 'red',
//     marginTop: 10,
//     padding: 10,
//     textAlign: 'center'
//   },
//   dailyForecast: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//     height: 170,
//     width: 140,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255, 255, 255, 0.5)',
//     marginHorizontal: 10,

//   },
//   dayText: {
//     fontSize: 15,
//     fontWeight: 'bold',
//     color: 'black',
//     textAlign: 'center',
//     marginTop: 46,
//   },
//   temperatureText: {
//     fontSize: 17,
//     fontWeight: 'bold',
//     color: 'black',
//     textAlign: 'center',
//     marginBottom: 40,
//   },
//   dateTimeContainer: {
//     padding: 15,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   dateTimeText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: 'white',
//     textAlign: 'center',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   modalText: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
//   closeButton: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: 'red',
//     marginTop: 10,
//   },
//   iconImage: {
//     width: 30,
//     height: 30,
//   },
// });

// export default Weather;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Modal,
  Pressable,
} from "react-native";
import * as Location from "expo-location";

const API_KEY = "2a0235b040231eceb04be90d42cb634a";

const Weather = () => {
  const [forecast, setForecast] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWeather, setSelectedWeather] = useState(null);

  const loadForecast = async (latitude, longitude) => {
    setRefreshing(true);
    try {
      const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (response.status >= 200 && response.status < 300) {
        setForecast(data);
        const locationNameResponse = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        const { city, country } = locationNameResponse[0];
        setLocationName(`${city}, ${country}`);
      } else {
        throw new Error(
          "Failed to fetch weather data. Please check your internet connection and try again."
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", error.message);
    }

    setRefreshing(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
      });
      if (location) {
        loadForecast(location.coords.latitude, location.coords.longitude);
      }
    })();
  }, []);

  const handleSearch = async () => {
    if (!searchText.trim()) {
      Alert.alert("Invalid Input", "Please enter a valid location.");
      return;
    }

    setRefreshing(true);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${searchText}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();

      if (response.status >= 200 && response.status < 300) {
        setForecast(data);
        setLocationName(searchText);
        setSearchText("");
      } else {
        throw new Error(
          "Failed to fetch weather data. Please check your internet connection and try again."
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      Alert.alert("Error", error.message);
    }

    setRefreshing(false);
  };

  const handleWeatherIconPress = (weather) => {
    setSelectedWeather(weather);
    setModalVisible(true);
  };

  if (!forecast || !forecast.list) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const currentWeatherData = forecast.list.find(
    (item) => new Date(item.dt * 1000) > new Date()
  );
  const currentWeather = currentWeatherData && currentWeatherData.weather[0];
  const currentTemperature = currentWeatherData
    ? Math.round(currentWeatherData.main.temp)
    : null;
  const dailyForecasts = forecast.list.filter(
    (item, index) => index % 8 === 0 && index < 10 * 8
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundContainer}>
        <ImageBackground
          source={require("./sunny.png")}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() =>
                  loadForecast(forecast.city.coord.lat, forecast.city.coord.lon)
                }
              />
            }
          >
            <Text style={styles.title}>Current Weather</Text>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Enter location"
              />
              <TouchableOpacity onPress={handleSearch}>
                <Image
                  source={require("./icon.png")}
                  style={{ width: 24, height: 24 }}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.locationText}>Location: {locationName}</Text>
            {currentWeather && (
              <>
                <Text style={styles.weatherText}>
                  {currentWeather.description.charAt(0).toUpperCase() +
                    currentWeather.description.slice(1)}
                </Text>
                <TouchableOpacity
                  onPress={() => handleWeatherIconPress(currentWeather)}
                >
                  <Image
                    style={styles.weatherIcon}
                    source={{
                      uri: `http://openweathermap.org/img/wn/${currentWeather.icon}.png`,
                    }}
                  />
                </TouchableOpacity>
              </>
            )}
            {currentTemperature !== null && (
              <Text style={styles.tempText}>{currentTemperature}°C</Text>
            )}
            <View style={styles.weatherInfoContainer}>
              <View style={styles.weatherInfo}>
                <Image
                  source={require("./temperature.png")}
                  style={{ height: 27, width: 27 }}
                />
                <Text style={styles.feelsLikeText}>
                  Feels like:{" "}
                  {currentWeatherData &&
                    Math.round(currentWeatherData.main.feels_like)}
                  °C
                </Text>
              </View>
              <View style={styles.weatherInfo}>
                <Image
                  source={require("./weather.png")}
                  style={{ height: 28, width: 24 }}
                />
                <Text style={styles.feelsLikeText}>
                  Humidity:{" "}
                  {currentWeatherData &&
                    Math.round(currentWeatherData.main.humidity)}
                  %
                </Text>
              </View>
              <View style={styles.weatherInfo}>
                <Image
                  source={require("./chance.png")}
                  style={{ height: 28, width: 28 }}
                />
                <Text style={styles.feelsLikeText}>
                  Rain Chance: {currentWeatherData && currentWeatherData.pop}%
                </Text>
              </View>
              <View style={styles.weatherInfo}>
                <Image
                  source={require("./speeds.jpg")}
                  style={{
                    height: 28,
                    width: 27,
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                  }}
                />
                <Text style={styles.feelsLikeText}>
                  Wind Speed:{" "}
                  {currentWeatherData && currentWeatherData.wind.speed} m/s
                </Text>
              </View>
              <View style={styles.weatherInfo}>
                <Image
                  source={require("./visibility 3.png")}
                  style={styles.iconImage}
                />
                <Text style={styles.feelsLikeText}>
                  Visibility:{" "}
                  {currentWeatherData && currentWeatherData.visibility} m
                </Text>
              </View>
            </View>
            <Text style={styles.submit}>Hourly Forecast</Text>
            <FlatList
              data={dailyForecasts}
              keyExtractor={(item) => item.dt.toString()}
              renderItem={({ item }) => {
                const weather = item.weather[0];
                const dt = new Date(item.dt * 1000);
                const dayName = dt.toLocaleDateString("en-US", {
                  weekday: "short",
                });
                return (
                  <View style={styles.dailyForecast}>
                    <Text style={styles.dayText}>{dayName}</Text>
                    <TouchableOpacity
                      onPress={() => handleWeatherIconPress(weather)}
                    >
                      <Image
                        style={styles.weatherIcon}
                        source={{
                          uri: `http://openweathermap.org/img/wn/${weather.icon}.png`,
                        }}
                      />
                      <Text style={styles.temperatureText}>
                        {Math.round(item.main.temp)}°C
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
              horizontal
            />
          </ScrollView>
        </ImageBackground>
      </View>
      <View style={styles.dateTimeContainer}>
        <Text style={styles.dateTimeText}>
          {currentDateTime.toLocaleDateString()}{" "}
          {currentDateTime.toLocaleTimeString()}
        </Text>
      </View>
      <Pressable onPress={() => setModalVisible(false)}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(false);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Weather Details</Text>
              {selectedWeather && (
                <>
                  <Text style={styles.modalText}>
                    Description: {selectedWeather.description}
                  </Text>
                  <Text style={styles.modalText}>
                    Icon: {selectedWeather.icon}
                  </Text>
                </>
              )}
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECDBBA",
  },
  backgroundContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  backgroundImage: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ECDBBA",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginTop: 20,
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 25,
    borderWidth: 1,
    height: 50,
  },
  searchInput: {
    flex: 1,
    padding: 10,
  },
  locationText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginTop: 10,
  },
  weatherText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  weatherIcon: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 15,
  },
  tempText: {
    fontSize: 50,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  feelsLikeText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  weatherInfoContainer: {
    flexDirection: "row",
    marginTop: 20,
    borderRadius: 15,
    justifyContent: "space-between",
    padding: 10,
  },
  weatherInfo: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    padding: 10,
    borderRadius: 15,
    flex: 1,
    marginHorizontal: 5,
  },
  submit: {
    fontSize: 24,
    fontWeight: "bold",
    color: "red",
    marginTop: 10,
    padding: 10,
    textAlign: "center",
  },
  dailyForecast: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    height: 170,
    width: 140,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 10,
  },
  dayText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginTop: 46,
  },
  temperatureText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 40,
  },
  dateTimeContainer: {
    padding: 15,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  dateTimeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
  },
  closeButton: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
    marginTop: 10,
  },
  iconImage: {
    width: 30,
    height: 30,
  },
});

export default Weather;
