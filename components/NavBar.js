import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { Avatar } from '../assets';
import { supabase } from '../supabase';

export default function NavBar() {
    const navigation = useNavigation();
    const cartItems = useSelector((state) => state.cartSlice.cart);
    const email = useSelector(state => state.authSlice.email)
    const [name, setName] = useState('')

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                let { data, error } = await supabase
                    .from('master_users')
                    .select('name')
                    .eq('email', email)
                    .single()

                if (error && error.code !== 'PGRST116') {
                    throw error
                }

                if (data) {
                    setName(data.name)
                } else {
                    setName('User') // Fallback name if no user found
                }
            } catch (error) {
                console.error('Error fetching user name:', error)
            }
        }

        if (email) {
            fetchUserName()
        }
    }, [email])

    // Function to truncate the name if it exceeds 15 characters
    const truncateName = (name) => {
        return name.length > 10 ? name.substring(0, 12) : name;
    }

    return (
        <View className="flex-row items-center justify-between w-full px-4 py-2">
            {/* <TouchableOpacity onPress={() => navigation.goBack()}>
                <Entypo name="chevron-left" size={32} color={"#555"} />
            </TouchableOpacity> */}

            <View className='flex-row space-x-2 items-center'>
                <View className="w-12 h-12 rounded-xl flex-row items-center justify-center relative">
                    <Image source={Avatar} className="w-12 h-12 rounded-xl" />
                </View>
                <View>
                    <Text className="text-xl font-semibold text-black">
                        Hello, {truncateName(name)}
                    </Text>
                    <Text className="text-xs font-semibold text-[#555]">How are you feeling today?</Text>
                </View>
            </View>

            <View className="w-12 h-12 rounded-xl bg-white flex items-center justify-center relative">
                <MaterialIcons name="shopping-cart" size={32} color={"#555"} />
                <View className="bg-black absolute w-5 h-5 top-0 right-0 rounded-full flex items-center justify-center">
                    <Text className="text-white text-xs font-bold">{cartItems?.length}</Text>
                </View>
            </View>
        </View>
    )
}
