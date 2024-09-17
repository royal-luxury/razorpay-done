import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'
import * as ImagePicker from 'expo-image-picker'
import { useDispatch, useSelector } from 'react-redux'
import Entypo from '@expo/vector-icons/Entypo';
import { setImageBase64 } from '../redux/prescriptionSlice';

export default function Prescription() {
    const dispatch = useDispatch()
    const imageBase64 = useSelector(state => state.prescriptionSlice.imageBase64)

    const pickImage = async (source) => {
        try {
            let result;
            if (source === 'camera') {
                result = await ImagePicker.launchCameraAsync({
                    base64: true,
                    quality: 0.5,
                });
            } else {
                result = await ImagePicker.launchImageLibraryAsync({
                    base64: true,
                    quality: 0.5,
                });
            }
    
            if (!result.canceled) {
                dispatch(setImageBase64(result.assets[0].base64));
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Something went wrong while picking the image.');
        }
    };
    

    return (
        <View className='w-full h-40  px-4 py-2 '>
            <View className='flex-row bg-white p-2 rounded-xl'>
                <View className='flex-1 bg-white rounded-xl'>
                    {imageBase64 ? (
                        <Image
                            source={{ uri: `data:image/jpeg;base64,${imageBase64}` }}
                            style={{ width: '100%', height: '100%' }}
                            className='rounded-lg'
                            resizeMode='cover'
                        />
                    ) : (
                        <Image
                            source={{ uri: `https://img.freepik.com/premium-vector/3d-medical-prescription-recomendation-with-medicine-pills-green-leaves-healthcare-medicine_313242-1262.jpg` }}
                            style={{ width: '100%', height: '100%'}}
                            className='rounded-lg bg-gray-100'
                            resizeMode='cover'
                        />
                    )}
                </View>
                <View className='flex-1 justify-start items-center space-y-3'>
                    <View className='w-full flex-row px-3 justify-center'>
                        <Text className='font-bold text-black'>Upload Prescription</Text>
                    </View>
                    <View className='w-full flex-row px-3'>
                        <Pressable onPress={() => pickImage('camera')} className='flex-row bg-gray-400 w-full p-2 items-center justify-center space-x-2 rounded-lg'>
                            <Entypo name="camera" size={16} color="white" />
                            <Text className='font-semibold text-white'>Camera</Text>
                        </Pressable>
                    </View>
                    <View className='w-full flex-row px-3'>
                        <Pressable onPress={() => pickImage('gallery')} className='flex-row bg-gray-400 w-full p-2 items-center justify-center space-x-2 rounded-lg'>
                            <Entypo name="images" size={16} color="white" />
                            <Text className='font-semibold text-white'>Images</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    )
}
