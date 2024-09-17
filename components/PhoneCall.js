import { View, Text, Pressable, Linking, Alert } from 'react-native';
import React from 'react';
import Feather from '@expo/vector-icons/Feather';

export default function PhoneCall() {
    const phoneNumber = 'tel:+918275980166'; // Replace with the desired phone number

    const handleCallNow = () => {
        Linking.openURL(phoneNumber).catch((err) => 
            Alert.alert('Error', 'Unable to make a call right now. Please try again later.')
        );
    };

    return (
        <View className='w-full px-4 py-1'>
            <View className='flex-row bg-white p-2 rounded-xl space-x-2 items-center justify-between'>
                <Text className='font-bold text-gray-500 pl-1'>Call for Enquiries / Order</Text>
                <Pressable 
                    className='bg-black p-2 rounded-lg flex-row space-x-2 items-center justify-center'
                    onPress={handleCallNow}
                >
                    <Feather name="phone-call" size={18} color="white" />
                    <Text className='text-white font-bold'>Call Now</Text>
                </Pressable>
            </View>
        </View>
    );
}
