import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, TextInput, Image, TouchableOpacity, Text, Alert, ActivityIndicator, BackHandler } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { addAuthDetails } from '../redux/authSlice';
import { supabase } from '../supabase'; // Ensure this is properly configured
import { DawaLogo } from '../assets';
import RazorPay from '../components/RazorPay';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.authSlice.isAuthenticated);

    useEffect(() => {
        const onBackPress = () => {
            console.log('isAuth123:', isAuthenticated);
            if (isAuthenticated) {
                // If the user is authenticated, prevent going back to the login screen
                return true;
            }
            return false;
        };

        BackHandler.addEventListener('hardwareBackPress', onBackPress);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        };
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            console.log('isAuth:', isAuthenticated);
            navigation.navigate('Home');
        }
    }, [isAuthenticated, navigation]);

    const handleLogin = async () => {
        setLoading(true);
        const { data: { session }, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        setLoading(false);

        if (error) {
            Alert.alert('Login Failed', error.message);
            return;
        }

        // Clear textboxes on successful login
        setEmail('');
        setPassword('');

        dispatch(addAuthDetails({
            id: session.user.id,
            email: session.user.email
        }));
    };

    return (
        <SafeAreaView className="flex-1 items-center justify-center bg-[#EBEAEF] px-6">
            <View className="flex-row items-center justify-center px-4 py-2 w-full mb-4">
                <Image source={DawaLogo} className="h-28 w-full" resizeMode='contain' />
            </View>
            <RazorPay/>
            <Text className="text-2xl font-semibold text-black mb-3">Login to your Account</Text>
            <View className="w-full mb-3">
                <View className="bg-white rounded-xl flex-row items-center px-3 py-2">
                    <MaterialIcons name="email" size={24} color="black" />
                    <TextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize='none'
                        keyboardType='email-address'
                        className="flex-1 text-base text-[#6B7280] ml-2"
                    />
                </View>
            </View>
            <View className="w-full mb-4">
                <View className="bg-white rounded-xl flex-row items-center px-3 py-2">
                    <MaterialIcons name="lock" size={24} color="black" />
                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        className="flex-1 text-base text-[#6B7280] ml-2"
                    />
                </View>
            </View>
            <TouchableOpacity
                className="w-full py-3 rounded-xl bg-black items-center justify-center"
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                    <Text className="text-lg text-white font-semibold">Login</Text>
                )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Register')} className="mt-4">
                <Text className="font-semibold text-[#9CA3AF]">Don't have an Account? Click Here</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
