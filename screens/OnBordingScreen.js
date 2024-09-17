import { View, Text, Image } from "react-native";
import React, { useEffect } from "react";
import Swiper from "react-native-swiper";
import { Brand, DawaLogo, Screen1, Screen2, Screen3 } from "../assets";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OnBoardingScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem("@onboarding_complete");
        if (value === "true") {
          navigation.replace("Login"); // Replace with Login screen
        }
      } catch (error) {
        console.log("Error retrieving onboarding status: ", error);
      }
    };

    checkOnboardingStatus();
  }, [navigation]);

  const handleOnboardingComplete = async (index) => {
    console.log("Onboarding index changed to: ", index);
    if (index === 2) { // When the last screen is reached
      try {
        await AsyncStorage.setItem("@onboarding_complete", "true");
        navigation.replace("Login"); // Replace with Login screen
      } catch (error) {
        console.log("Error storing onboarding status: ", error);
      }
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Swiper onIndexChanged={handleOnboardingComplete} showsPagination={true}>
        <ScreenOne />
        <ScreenTwo />
        <ScreenThree />
      </Swiper>
    </View>
  );
};

const ScreenOne = () => {
  return (
    <View className="flex-1 items-center justify-center relative">
      <Image source={Screen1} className="w-full h-full" resizeMode="cover" />
    </View>
  );
};

const ScreenTwo = () => {
  return (
    <View className="flex-1  items-center justify-start ">
      <Image source={Screen1} className="w-full h-[70%] " resizeMode="cover" />
      <View className="w-full pt-5 rounded-t-3xl -mt-10 bg-white">
        <View className='px-6 flex items-center justify-center w-full space-y-6'>

        <Text className="text-2xl tracking-wider text-black font-bold">
          Find your Medicienes 1
        </Text>
        <Text className="text-xl tracking-wider text-[#777] text-center">
          At the best price over an other App or Marketplace ever!
        </Text>
        </View>
      </View>
    </View>
  );
};

const ScreenThree = () => {
  return (
    <View className="flex-1  items-center justify-start ">
      <Image source={Screen1} className="w-full h-[70%] " resizeMode="cover" />
      <View className="w-full pt-5 rounded-t-3xl -mt-10 bg-white">
        <View className='px-6 flex items-center justify-center w-full space-y-6'>

        <Text className="text-2xl tracking-wider text-black font-bold">
          Find your Medicienes 2
        </Text>
        <Text className="text-xl tracking-wider text-[#777] text-center">
          At the best price over an other App or Marketplace ever!
        </Text>
        </View>
      </View>
    </View>
  );
};

export default OnBoardingScreen;
