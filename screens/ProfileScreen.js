import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../supabase';
import { removeAuthDetails } from '../redux/authSlice';

export default function ProfileScreen() {
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            dispatch(removeAuthDetails());

            // Reset the navigation stack and navigate to Login screen
            navigation.navigate('Login')
        } catch (error) {
            Alert.alert('Logout Failed', error.message);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#EBEAEF' }}>
            <TouchableOpacity
                onPress={handleLogout}
                style={{ paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, backgroundColor: 'black' }}
            >
                <Text style={{ fontSize: 18, color: 'white', fontWeight: '600' }}>Logout</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
