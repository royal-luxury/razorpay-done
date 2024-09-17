import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { supabase } from "../supabase";
import {
  AdsBanner,
  CategoryList,
  Feeds,
  MyLocation,
  NavBar,
  PhoneCall,
  Prescription,
} from "../components";
import RazorPay from "../components/RazorPay";

export default function HomeScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filtered, setFiltered] = useState(null);

  const handleSearchTerm = async (text) => {
    setSearchTerm(text);
    if (text.trim() === "") {
      setFiltered(null);
      return;
    }

    setIsLoading(true);

    try {
      let { data, error } = await supabase
        .from("master_dawabag")
        .select("*")
        .or(
          `product_name.ilike.%${text}%,category.ilike.%${text}%,generic_name.ilike.%${text}%`
        );
      if (error) throw error;
      setFiltered(data);
    } catch (error) {
      console.error("Error searching medicines:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Callback function to set the category name as the search term
  const handleCategorySelect = (categoryName) => {
    handleSearchTerm(categoryName);
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-start bg-[#EBEAEF]">
      <NavBar />
      {/* Search Box starts here */}
      <View className="flex-row items-center justify-between px-4 py-2 w-full space-x-4">
        <View className="px-4 py-2 bg-white rounded-xl flex-1 flex-row items-center justify-center space-x-2">
          <MaterialIcons name="search" size={24} color="#7f7f7f" />
          <TextInput
            className="text-base font-semibold text-[#555] flex-1 py-1 -mt-1"
            placeholder="Search Here..."
            value={searchTerm}
            onChangeText={handleSearchTerm}
          />
        </View>

        <TouchableOpacity
          className="w-12 h-12 rounded-xl flex items-center justify-center bg-white"
          onPress={() => handleSearchTerm("")}
        >
          <FontAwesome name="filter" size={24} color="#7f7f7f" />
        </TouchableOpacity>
      </View>
      {/* Search box ends here */}

      {/* Scrollable container starts */}
      <ScrollView className="flex1 w-full" showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View className="flex-1 h-80 items-center justify-center">
            <ActivityIndicator size={"large"} color={"teal"} />
          </View>
        ) : searchTerm.trim() === "" ? (
          <View className="flex-1 items-center justify-center">
            <MyLocation />
            <RazorPay />
            <Text className="text-xl font-semibold text-black mt-2">
              Shop by Category
            </Text>
            <CategoryList onSelectCategory={handleCategorySelect} />
            <Text className="text-xl font-semibold text-black mt-2">
              Place Order Using
            </Text>
            <PhoneCall />
            <Prescription />
            <Text className="text-xl font-semibold text-black mt-2">
              Todays Best Deals
            </Text>
            <AdsBanner />
          </View>
        ) : (
          <Feeds feeds={filtered || []} />
        )}
      </ScrollView>
      {/* Scrollable container ends */}
    </SafeAreaView>
  );
}
