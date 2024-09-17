import { View, Text, Alert, Pressable } from "react-native";
import React from "react";
import RazorpayCheckout from "react-native-razorpay";

export default function RazorPay() {
  const handlePayment = () => {
    const options = {
      currency: "INR",
      key: "rzp_test_JsZM8MqoPYrmAS",
      amount: 100,
      name: "DawaBag",
    };

    RazorpayCheckout.open(options)
      .then((data) => {
        // handle success
        Alert.alert(`Success: ${data.razorpay_payment_id}`);
      })
      .catch((error) => {
        // handle faliure
        Alert.alert(`Error : ${error.code} | ${error.description}`);
      });
  };
  return (
    <View>
      <Text>RazorPay</Text>
      <Pressable
        onPress={handlePayment}
        className="bg-green-300 rounded-lg p-4 m-3"
      >
        <Text>Pay Now </Text>
      </Pressable>
    </View>
  );
}
