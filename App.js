import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import { CartScreen, LoginScreen, OnBoardingScreen, OrderScreen, ProductScreen, ProfileScreen, RegisterScreen } from './screens';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import { BottomTab } from './components';
import { useEffect, useState } from 'react';
const Stack = createNativeStackNavigator();
const MyComponent = ({ setActiveScreen }) => {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener("state", () => {
      const currentScreen = navigation.getCurrentRoute().name;
      setActiveScreen(currentScreen);
      console.log("Active Screen : ", currentScreen);
    });

    return unsubscribe;
  }, [navigation]);
};

const App = () => {
  const [activeScreen, setActiveScreen] = useState("");
  return (
    <NavigationContainer>
      <MyComponent setActiveScreen={setActiveScreen} />
      <Provider store={store}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="OnBoarding" component={OnBoardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Product" component={ProductScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Order" component={OrderScreen} />
        </Stack.Navigator>
      </Provider>

      {activeScreen !== "OnBoarding" && activeScreen !== "Login" && activeScreen !== "Register" && (
        <BottomTab activeScreen={activeScreen} />
      )}
    </NavigationContainer>
  );
};
export default App;