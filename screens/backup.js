import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Image,
    ScrollView,
    TextInput,
    Pressable,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { Entypo, FontAwesome, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
  import { useNavigation } from "@react-navigation/native";
  import { useDispatch, useSelector } from "react-redux";
  import { EmptyCart } from "../assets";
  import Swipeable from "react-native-gesture-handler/Swipeable";
  import { GestureHandlerRootView } from "react-native-gesture-handler";
  import { removeFromMyCart } from "../redux/cartSlice";
  import { NavBar } from "../components";
  
  const CartScreen = () => {
    const navigation = useNavigation();
    const cartItems = useSelector((state) => state.cartSlice.cart);
    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [savings, setSavings] = useState(0);
    useEffect(() => {
      // Calculate subtotal, total, and savings using data from Redux
      let calculatedSubtotal = 0;
      let calculatedTotal = 0;
  
      cartItems.forEach(item => {
        calculatedSubtotal += item.product_mrp * item.quantity;
        calculatedTotal += item.product_selling_user * item.quantity;
      });
  
      const calculatedDeliveryFee = calculatedTotal > 1000 ? 0 : 100;
      const calculatedSavings = calculatedSubtotal - calculatedTotal;
  
      setSubtotal(calculatedSubtotal);
      setTotal(calculatedTotal);
      setDeliveryFee(calculatedDeliveryFee);
      setSavings(calculatedSavings);
    }, [cartItems]);
  
    return (
      <SafeAreaView className="flex-1 w-full items-start justify-start bg-[#EBEAEF] pt-10">
        {/* top section */}
  
        <NavBar />
        {cartItems.length === 0 || !cartItems ? (
          <View className='flex-1 w-full items-center justify-center'>
            <Image source={EmptyCart} className="w-64 h-64" resizeMode="contain" />
          </View>
        ) : (
          <View className='flex-1'>
            <ScrollView className="w-full flex-1">
              {/* promo code section */}
              <View className="w-full p-4">
                <View className="w-full px-2 py-2 h-16 rounded-xl bg-white flex-row justify-center">
                  <TextInput
                    placeholder="Promo Code"
                    className="text-base px-4 font-semibold text-[#555] flex-1 py-1 -mt-1"
                  />
                  <TouchableOpacity className="px-3 py-2 rounded-xl bg-black">
                    <Text className="text-white text-lg font-semibold">Apply</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View className="flex space-y-4">
                {cartItems.map((item, index) => (
                  <CartItemCard key={index} item={item} qty={item?.quantity} />
                ))}
              </View>
  
  
            </ScrollView>
            {/* total calculation */}
            <View className=" px-4 w-full">
              <View className="flex-row w-full items-center justify-between">
                <Text className="text-lg font-semibold text-[#555]">Subtotal</Text>
                <View className="flex-row items-center justify-center space-x-1">
                  <Text className="text-lg font-semibold text-[#555]">
                    ₹ {parseFloat(subtotal).toFixed(2)}
                  </Text>
                </View>
              </View>
  
              {/* savings */}
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-[#555]">Savings</Text>
                <View className="flex-row items-center justify-center space-x-1">
                  <Text className="text-lg font-semibold text-[#555]">₹ {parseFloat(savings).toFixed(2)}</Text>
                  <Text className="text-sm uppercase text-gray-500"></Text>
                </View>
              </View>
  
              {/* shipping */}
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-[#555]">Delivery</Text>
                <View className="flex-row items-center justify-center space-x-1">
                  <Text className="text-lg font-semibold text-[#555]">₹ {deliveryFee}</Text>
                  <Text className="text-sm uppercase text-gray-500"></Text>
                </View>
              </View>
  
              {/* grand total */}
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-black">To Pay</Text>
                <View className="flex-row items-center justify-center space-x-1">
                  <Text className="text-sm text-gray-500 mr-4">
                    ({cartItems?.length}) items
                  </Text>
                  <Text className="text-xl font-semibold text-black">
                    ₹ {parseFloat(total + 5.0).toFixed(2)}
                  </Text>
                  <Text className="text-sm uppercase text-gray-500"></Text>
                </View>
              </View>
              
            </View>
            <View className="px-4 my-4">
              <TouchableOpacity className="p-2 py-3 rounded-xl bg-black items-center justify-center">
                <Text className="text-lg text-white font-semibold">Proceed to checkout</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    );
  };
  
  export const CartItemCard = ({ item, qty }) => {
    const navigation = useNavigation()
  
    const handleClick = () => {
      navigation.navigate("Product", { data: item });
    };
    return (
      <View className="flex-row px-4 w-full items-center my-1">
        {/* Image */}
        <View className="bg-white rounded-xl flex items-center justify-center p-1 w-16 h-16 relative">
          <Image
            source={{ uri: item?.image }}
            resizeMode="cover"
            className="w-full h-full rounded-xl"
          />
        </View>
  
        {/* Text Section */}
        <View className="flex items-center space-y-1 ml-3">
          <View className="flex items-start justify-center">
            <Text className="text-lg font-semibold text-[#555]">
              {item?.product_name?.length > 11
                ? `${item?.product_name.slice(0, 12)}..`
                : item?.product_name}
            </Text>
            <Text className="text-lg font-bold text-black">
              ₹ {parseFloat(item?.product_selling_user).toFixed(2)}
            </Text>
          </View>
        </View>
  
        {/* Qty Section */}
        <Pressable onPress={handleClick} className="flex-row items-center justify-center space-x-4 rounded-xl border border-gray-400 px-3 py-1 ml-auto">
          <Text className="text-lg font-bold text-black"> Qty : {qty}</Text>
        </Pressable>
      </View>
    );
  };
  
  export default CartScreen;
  