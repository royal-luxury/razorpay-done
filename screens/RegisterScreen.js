import React, { useState } from 'react';
import { View, SafeAreaView, TextInput, Image, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../supabase'; // Ensure this is properly configured
import { DawaLogo } from '../assets';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigation = useNavigation();

    const validateName = (name) => name.length >= 5;
    const validateEmail = async (email) => {
        const isValidDomain = email.endsWith('.com');
        if (!isValidDomain) return false;

        const { data, error } = await supabase
            .from('master_users')
            .select('email')
            .eq('email', email);

        if (error) {
            console.error('Database query error:', error.message);
            return false;
        }

        return data.length === 0;
    };
    const validatePhone = (phone) => phone.length === 10 && /^\d{10}$/.test(phone);
    const validatePassword = (password) => password.length >= 8;

    const handleRegister = async () => {
        setErrors({});
        let isValid = true;

        if (!name) {
            setErrors(prev => ({ ...prev, name: 'Name is required.' }));
            isValid = false;
        }
        if (!email) {
            setErrors(prev => ({ ...prev, email: 'Email is required.' }));
            isValid = false;
        }
        if (!phone) {
            setErrors(prev => ({ ...prev, phone: 'Phone number is required.' }));
            isValid = false;
        }
        if (!password) {
            setErrors(prev => ({ ...prev, password: 'Password is required.' }));
            isValid = false;
        }

        if (isValid) {
            if (!validateName(name)) {
                setErrors(prev => ({ ...prev, name: 'Name must be at least 5 characters long.' }));
                isValid = false;
            }
            if (!(await validateEmail(email))) {
                setErrors(prev => ({ ...prev, email: 'This email is already taken or invalid.' }));
                isValid = false;
            }
            if (!validatePhone(phone)) {
                setErrors(prev => ({ ...prev, phone: 'Phone number must be exactly 10 digits.' }));
                isValid = false;
            }
            if (!validatePassword(password)) {
                setErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters long.' }));
                isValid = false;
            }
        }

        if (!isValid) return;

        setLoading(true);
        const { data: { user }, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) {
            setLoading(false);
            Alert.alert('Registration Failed', error.message);
            return;
        }

        const { error: insertError } = await supabase
            .from('master_users')
            .insert([{ id: user.id, name, email, phone, password }]);

        setLoading(false);

        if (insertError) {
            Alert.alert('Error', insertError.message);
            return;
        }

        setName('');
        setEmail('');
        setPhone('');
        setPassword('');

        Alert.alert('Success', 'Account created successfully. Please log in.');
        navigation.navigate('Login');
    };

    return (
        <SafeAreaView className="flex-1 items-center justify-center bg-[#EBEAEF] px-6">
            <View className="flex-row items-center justify-center px-4 py-2 w-full mb-4">
                <Image source={DawaLogo} className="h-28 w-full" resizeMode='contain' />
            </View>
            <Text className="text-2xl font-semibold text-black mb-3">Register for an Account</Text>
            <View className="w-full mb-3">
                <View className="bg-white rounded-xl flex-row items-center px-3 py-2">
                    <MaterialIcons name="person" size={24} color="black" />
                    <TextInput
                        placeholder="Name"
                        value={name}
                        onChangeText={setName}
                        className={`flex-1 text-base text-[#6B7280] ml-2 ${errors.name ? 'border-red-500' : 'border-teal-300'}`}
                        style={{ borderColor: errors.name ? 'red' : 'teal' }}
                    />
                </View>
                {errors.name && <Text className="text-red-500 mb-4">{errors.name}</Text>}
            </View>
            <View className="w-full mb-3">
                <View className="bg-white rounded-xl flex-row items-center px-3 py-2">
                    <MaterialIcons name="email" size={24} color="black" />
                    <TextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize='none'
                        keyboardType='email-address'
                        className={`flex-1 text-base text-[#6B7280] ml-2 ${errors.email ? 'border-red-500' : 'border-teal-300'}`}
                        style={{ borderColor: errors.email ? 'red' : 'teal' }}
                    />
                </View>
                {errors.email && <Text className="text-red-500 mb-4">{errors.email}</Text>}
            </View>
            <View className="w-full mb-3">
                <View className="bg-white rounded-xl flex-row items-center px-3 py-2">
                    <MaterialIcons name="phone" size={24} color="black" />
                    <TextInput
                        placeholder="Phone"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType='phone-pad'
                        className={`flex-1 text-base text-[#6B7280] ml-2 ${errors.phone ? 'border-red-500' : 'border-teal-300'}`}
                        style={{ borderColor: errors.phone ? 'red' : 'teal' }}
                    />
                </View>
                {errors.phone && <Text className="text-red-500 mb-4">{errors.phone}</Text>}
            </View>
            <View className="w-full mb-4">
                <View className="bg-white rounded-xl flex-row items-center px-3 py-2">
                    <MaterialIcons name="lock" size={24} color="black" />
                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        className={`flex-1 text-base text-[#6B7280] ml-2 ${errors.password ? 'border-red-500' : 'border-teal-300'}`}
                        style={{ borderColor: errors.password ? 'red' : 'teal' }}
                    />
                </View>
                {errors.password && <Text className="text-red-500 mb-4">{errors.password}</Text>}
            </View>
            <TouchableOpacity
                className="w-full py-3 rounded-xl bg-black items-center justify-center"
                onPress={handleRegister}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                    <Text className="text-lg text-white font-semibold">Register</Text>
                )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} className="mt-4">
                <Text className="font-semibold text-[#9CA3AF]">Already have an Account? Sign In</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
