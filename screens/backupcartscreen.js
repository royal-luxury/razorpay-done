// Cart Screen
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { EmptyCart } from "../assets";
import { cleanMyCart } from "../redux/cartSlice";
import { resetPrescription } from "../redux/prescriptionSlice";
import { supabase } from "../supabase";
import { NavBar, Prescription } from "../components";

const CartScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const cartItems = useSelector((state) => state.cartSlice.cart);
  const userEmail = useSelector((state) => state.authSlice.email);
  const imageBase64 = useSelector(
    (state) => state.prescriptionSlice.imageBase64
  );
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [savings, setSavings] = useState(0);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false); // State to track if order is being placed
  const locationRef = useRef(null);

  useEffect(() => {
    // Calculate subtotal, total, and savings using data from Redux
    let calculatedSubtotal = 0;
    let calculatedTotal = 0;

    cartItems.forEach((item) => {
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

  const getCurrentDateTime = () => {
    const now = new Date();
    return {
      date: now.toLocaleDateString("en-GB"),
      time: now.toLocaleTimeString("en-GB", { hour12: false }),
    };
  };

  const placeOrder = async () => {
    if (isPlacingOrder) return; // Prevent multiple submissions
    setIsPlacingOrder(true); // Set the flag to true to prevent re-submission

    try {
      const address = locationRef.current?.getAddress() || "Default Address";

      if (cartItems.length === 0) {
        Alert.alert("Error", "Add items to cart before placing an order.");
        setIsPlacingOrder(false);
        return;
      }
      if (!imageBase64) {
        Alert.alert("Error", "Prescription is required to place the order.");
        setIsPlacingOrder(false);
        return;
      }

      const { date, time } = getCurrentDateTime();

      const items = cartItems.map((item) => ({
        name: item.product_name,
        price: item.product_selling_user,
        quantity: item.quantity,
      }));

      const subtotal = items.reduce(
        (total, item) => total + item.quantity * item.price,
        0
      );
      const calculatedSubtotal = cartItems.reduce(
        (acc, item) => acc + item.product_mrp * item.quantity,
        0
      );
      const deliveryFee = calculatedSubtotal > 500 ? 0 : 50;
      const savings = calculatedSubtotal - subtotal;

      const order = {
        email: userEmail,
        date,
        time,
        items,
        subtotal: calculatedSubtotal,
        deliveryFee,
        savings,
        topay: subtotal + deliveryFee,
        coupon: null,
        prescription: imageBase64,
        deliveryAddress: address,
        status: "Pending",
      };

      const { data: newOrder, error: orderError } = await supabase
        .from("dawabag_orders")
        .insert([order]);

      if (orderError) {
        console.error("Error inserting order:", orderError);
        Alert.alert("Error", "Unable to place order. Please try again.");
        setIsPlacingOrder(false);
      } else {
        console.log("Order placed successfully:", newOrder);
        dispatch(cleanMyCart());
        dispatch(resetPrescription());
        Alert.alert("Success", "Order placed successfully!");
        setIsPlacingOrder(false);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
      setIsPlacingOrder(false);
    }
  };

  const getStatusMessage = () => {
    if (cartItems.length === 0) return "Add Items to Cart";
    if (!imageBase64) return "Prescription Pending";
    return null;
  };

  const statusMessage = getStatusMessage();

  return (
    <SafeAreaView className="flex-1 w-full items-start justify-start bg-[#EBEAEF]">
      <NavBar />
      {cartItems.length === 0 || !cartItems ? (
        <View className="flex-1 w-full items-center justify-center">
          <Image
            source={EmptyCart}
            className="w-64 h-64"
            resizeMode="contain"
          />
        </View>
      ) : (
        <View className="flex-1 w-full space">
          <ScrollView className="w-full flex-1">
            <Prescription />
            <View className="w-full p-2 px-4">
              <View className="w-full px-2 py-2 h-16 rounded-xl bg-white flex-row justify-center">
                <TextInput
                  placeholder="Promo Code"
                  className="text-base px-4 font-semibold text-[#555] flex-1 py-1 -mt-1"
                />
                <TouchableOpacity className="px-3 py-2 rounded-xl bg-black">
                  <Text className="text-white text-lg font-semibold">
                    Apply
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex space-y-4">
              {cartItems.map((item, index) => (
                <CartItemCard key={index} item={item} qty={item?.quantity} />
              ))}
            </View>
          </ScrollView>
          <View className=" px-4 w-full">
            <View className="flex-row w-full items-center justify-between">
              <Text className="text-lg font-semibold text-[#555]">
                Subtotal
              </Text>
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
                <Text className="text-lg font-semibold text-[#555]">
                  ₹ {parseFloat(savings).toFixed(2)}
                </Text>
              </View>
            </View>

            {/* shipping */}
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-[#555]">
                Delivery
              </Text>
              <View className="flex-row items-center justify-center space-x-1">
                <Text className="text-lg font-semibold text-[#555]">
                  ₹ {deliveryFee}
                </Text>
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
                  ₹ {parseFloat(total + deliveryFee).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
          <View className="px-4 my-4">
            {statusMessage ? (
              <Pressable className="w-full">
                <View className="w-full px-3 py-4 rounded-xl bg-gray-300 flex-row items-center justify-center">
                  <Text className="text-lg text-white font-semibold">
                    {statusMessage}
                  </Text>
                </View>
              </Pressable>
            ) : (
              <TouchableOpacity onPress={placeOrder}>
                <View className="w-full px-3 py-4 rounded-xl bg-black flex-row items-center justify-center">
                  <Text className="text-lg text-white font-semibold">
                    Proceed to Checkout
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export const CartItemCard = ({ item, qty }) => {
  const navigation = useNavigation();

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
      <Pressable
        onPress={handleClick}
        className="flex-row items-center justify-center space-x-4 rounded-xl border border-gray-400 px-3 py-1 ml-auto"
      >
        <Text className="text-lg font-bold text-black"> Qty : {qty}</Text>
      </Pressable>
    </View>
  );
};

export default CartScreen;
