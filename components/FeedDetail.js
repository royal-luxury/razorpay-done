import { View, Text, Dimensions, Image, TouchableOpacity } from "react-native";
import React from "react";
import { AntDesign, Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { addToMyCart } from "../redux/cartSlice";

const FeedDetail = ({ data }) => {
  const screenWidth = Math.round(Dimensions.get("window").width);
  const cardWidth = screenWidth / 2 - 20;

  const navigation = useNavigation();
  const cartItems = useSelector((state) => state.cartSlice.cart);
  const isInCart = cartItems.some((item) => item.id === data.id); 
  const handleClick = () => {
    navigation.navigate("Product", { data: data });
  };

  const dispatch = useDispatch()
  // Function to handle adding to cart
  const handlePressCart = () => {
    dispatch(addToMyCart(data)); // Ensure data.data is passed if this is the correct structure
  };

  return (
    <TouchableOpacity
      onPress={handleClick}
      className="p-3 m-2 rounded-xl bg-white flex items-center justify-center"
      style={{ width: cardWidth }}
    >
      <Image
        source={{ uri: 'https://butterflyayurveda.com/cdn/shop/files/BA-CoughSyrup.webp?v=1711716207&width=800' }}
        resizeMode="cover"
        className="w-full h-52 rounded-lg"
      />

      <View className="flex items-start justify-start space-y-1 w-full">
        <Text numberOfLines={2} className="text-base font-semibold text-[#555]">
          {data?.product_name}
        </Text>
      </View>

      <View className="flex-row items-center justify-between space-y-1 w-full">
        <View>
          <Text className="text-sm  text-[#777] line-through">₹ {data?.product_mrp}</Text>
          <Text className="text-base font-semibold text-[#555]">
            ₹ {data?.product_selling_user}
          </Text>
        </View>
        {isInCart ?
          (<TouchableOpacity className="bg-black w-8 h-8 rounded-full flex items-center justify-center" onPress={() => navigation.navigate("Cart")}>
            <MaterialIcons name="shopping-cart" size={20} color="white" />
          </TouchableOpacity>) :
          (<TouchableOpacity className="bg-black w-8 h-8 rounded-full flex items-center justify-center" onPress={handlePressCart}>
            <FontAwesome name="plus" size={20} color="white" />
          </TouchableOpacity>)
        }
      </View>

    </TouchableOpacity>
  );
};

export default FeedDetail;
