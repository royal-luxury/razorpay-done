import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { addToMyCart, decrementMyQuantity, incrementMyQuantity } from "../redux/cartSlice";
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const ProductScreen = ({ route }) => {
  const data = route.params;
  const cart = useSelector((state) => state.cartSlice.cart);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const screenHeight = Math.round(Dimensions.get("window").height);

  useEffect(() => {
    setIsLoading(true);
    if (data) {
      console.log(data);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  }, [data]);

  // Function to handle incrementing the quantity
  const incrementItemQuantity = () => {
    dispatch(incrementMyQuantity({ id: data.data.id }));
    console.log('Incremented quantity:', cart);
  };

  // Function to handle decrementing the quantity
  const decrementItemQuantity = () => {
    dispatch(decrementMyQuantity({ id: data.data.id }));
    console.log('Decremented quantity:', cart);
  };

  // Function to handle adding to cart
  const handlePressCart = () => {
    dispatch(addToMyCart(data.data)); // Ensure data.data is passed if this is the correct structure
    console.log('Added to cart:', cart);
  };

  return (
    <View className="flex-1 items-start justify-start bg-white">
      {isLoading ? (
        <View className="w-full flex-1 h-full items-center justify-center ">
          <ActivityIndicator size={"large"} color={"gray"} />
        </View>
      ) : (
        <>
          <SafeAreaView className="w-full">
            {/* Top section */}
            
            {/* Image section */}
            <View
              className="w-full flex items-center justify-center relative"
              style={{ height: screenHeight / 2 }}
            >
              <Image
                source={{ uri: 'https://butterflyayurveda.com/cdn/shop/files/BA-CoughSyrup.webp?v=1711716207&width=800' }}
                resizeMode="cover"
                className="w-full h-full opacity-30"
              />
              <View className="w-full h-full absolute top-0 left-0 flex items-center justify-center ">
                <Image
                  source={{ uri: 'https://butterflyayurveda.com/cdn/shop/files/BA-CoughSyrup.webp?v=1711716207&width=800' }}
                  resizeMode="cover"
                  className="w-80 h-60 rounded-2xl"
                />
              </View>
            </View>
          </SafeAreaView>

          <View className="w-full flex-1 h-full bg-white rounded-t-[36px] pt-6 px-6 mt-[-30]">
            <View className="flex-1 items-center flex-row w-full">
              <View className="items-start justify-center">
                <Text className="text-xl font-semibold">
                  {data?.data?.product_name}
                </Text>
                <Text className="font-semibold text-gray-400">
                  {data?.data?.marketed_by}
                </Text>
                <View className='flex-1'>
                  <ScrollView contentContainerStyle={{ paddingBottom: 10 }} className='py-2 space-y-2' showsVerticalScrollIndicator={false}>
                    {/* Container for the Pack of and SKU Qty details */}
                    <View className='mt-2'>
                      <View className='flex-row'>
                        {/* Pack of Section */}
                        <View className='flex-1 flex-row items-center space-x-1'>
                          <Feather name="layers" size={32} color="gray" />
                          <View>
                            <Text className='text-sm text-gray-400 font-semibold'>Pack of</Text>
                            <Text className='text-gray-500 font-semibold'>
                              {data?.data?.pack ?? 'N/A'}
                            </Text>
                          </View>
                        </View>

                        {/* SKU Qty Section */}
                        <View className='flex-1 flex-row items-center space-x-1'>
                          <Feather name="codesandbox" size={32} color="gray" />
                          <View>
                            <Text className='text-sm text-gray-400 font-semibold'>SKU Qty</Text>
                            <Text className='text-gray-500 font-semibold'>
                              {data?.data?.sku_description ?? 'N/A'}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Range and Weight Section */}
                      <View className='flex-row mt-2 justify-between'>
                        {/* Temperature Range */}
                        <View className='flex-1 flex-row items-center space-x-2'>
                          <FontAwesome6 name="temperature-high" size={30} color="gray" />
                          <View>
                            <Text className='text-sm text-gray-400 font-semibold'>Range</Text>
                            <Text className='text-gray-500 font-semibold'>
                              {data?.data?.temp_range ?? 'N/A'}
                            </Text>
                          </View>
                        </View>

                        {/* Weight */}
                        <View className='flex-1 flex-row items-center space-x-1'>
                          <FontAwesome name="balance-scale" size={30} color="gray" />
                          <View>
                            <Text className='text-sm text-gray-400 font-semibold'>Weight</Text>
                            <Text className='text-gray-500 font-semibold'>
                              {data?.data?.gross_weight ?? 'N/A'} {data?.data?.weight_unit ?? ''}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* Product Description and Dates */}
                    <Text className="text-sm font-light text-[#777]">
                      {data?.data?.product_description}
                    </Text>

                    <View>
                      <Text className='font-semibold text-gray-400'>
                        Manufacturing Date : {data?.data?.manufacturing_date}
                      </Text>
                      <Text className='font-semibold text-gray-400'>
                        Expiry Date : {data?.data?.expiry_date}
                      </Text>
                    </View>

                  </ScrollView>
                </View>
              </View>
            </View>

            {/* Bottom section */}
            <View className="flex-row w-full justify-between items-center">
              <View>
                <Text className="line-through text-gray-400 font-semibold">
                  MRP : ₹{data?.data?.product_mrp}
                </Text>
                <Text className="text-xl font-bold text-black">
                  ₹{data?.data?.product_selling_user}
                </Text>

                <Text className='text-xs font-semibold text-gray-500'>* inclusive of all taxes</Text>
              </View>
              
              {cart.some((item) => item.id === data.data.id) ? (
                <TouchableOpacity className="rounded-xl">
                  <View className="flex-row items-center justify-center rounded-xl border border-gray-200">
                    <TouchableOpacity onPress={decrementItemQuantity}>
                      <Text className="text-xl font-bold py-2 px-4">-</Text>
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-black px-2">
                      {
                        cart.find((item) => item.id === data.data.id)?.quantity ?? 0
                      }
                    </Text>
                    <TouchableOpacity onPress={incrementItemQuantity}>
                      <Text className="text-xl font-bold py-2 px-4">+</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={handlePressCart}
                  className="bg-black px-4 py-2 text-xl rounded-xl"
                >
                  <Text className="text-base font-semibold text-gray-50">
                    Add to Bag
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default ProductScreen;