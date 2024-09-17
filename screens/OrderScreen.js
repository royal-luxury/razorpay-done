import { View, Text, SafeAreaView, Alert, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { supabase } from '../supabase';
import { NavBar, OrderCard } from '../components';

export default function OrderScreen() {

  const [orders, setOrders] = useState([]);

  // Get the email of the logged-in user from Redux
  const userEmail = useSelector((state) => state.authSlice.email);

  useEffect(() => {
    // Function to fetch orders from Supabase
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('dawabag_orders')
          .select('*')
          .eq('email', userEmail); // Filter orders by email

        if (error) {
          throw error;
        }

        setOrders(data);
      } catch (error) {
        Alert.alert('Error fetching orders', error.message);
      }
    };

    if (userEmail) {
      fetchOrders();
    } else {
      Alert.alert('Error', 'User email not found.');
    }
  }, [userEmail]);

  return (
    <View className="flex-1 items-center justify-start bg-[#EBEAEF]">
      <NavBar/>
      <ScrollView className='w-full flex-1 px-4' showsVerticalScrollIndicator={false}>
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <OrderCard key={index} data={order} />
          ))
        ) : (
          <View className="flex-row py-2 px-2 items-center bg-white w-full rounded-xl mb-3">
            <Text className='text-gray-500 font-bold p-2'>No Orders Found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}