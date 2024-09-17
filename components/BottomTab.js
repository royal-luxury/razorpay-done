import { View, Text, TouchableOpacity, Linking } from "react-native";
import React from "react";
import { FontAwesome, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const BottomTab = () => {
  const navigation = useNavigation();
  const phoneNumber = 'tel:+918275980166'; // Replace with the desired phone number

  const handleCallNow = () => {
      Linking.openURL(phoneNumber).catch((err) => 
          Alert.alert('Error', 'Unable to make a call right now. Please try again later.')
      );
  };
  return (
    <View className="bg-white w-full">
      <View className="px-4 py-4 w-full flex-row items-center justify-around">
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <FontAwesome5 name="home" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCallNow}>
          <MaterialIcons name="wifi-calling-3" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <FontAwesome name="user" size={32} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Order")}>
          <FontAwesome6 name="list-check" size={32} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
          <MaterialIcons name="shopping-cart" size={32} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BottomTab;
