import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import * as Location from 'expo-location';
import { FontAwesome5 } from '@expo/vector-icons';

const MyLocation = forwardRef((props, ref) => {
    const [location, setLocation] = useState(null);
    const [address, setAddress] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [isEditable, setIsEditable] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                setIsFetching(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);

            let reverseGeocode = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });

            if (reverseGeocode.length > 0) {
                const { name, street, city, region, postalCode, country } = reverseGeocode[0];
                const addressArray = [name, street, city, region, postalCode, country].filter(Boolean);
                setAddress(addressArray.join(', '));
            }

            setIsFetching(false);
        })();
    }, []);

    useImperativeHandle(ref, () => ({
        getAddress: () => {
            const trimmedAddress = (address || '').trim();
            return (trimmedAddress && trimmedAddress !== 'Location Pending') ? trimmedAddress : null;
        }
    }));

    const displayText = isFetching ? 'Fetching location...' : address || '';

    return (
        <View className='w-full items-center px-3 py-2'>
            <View
                className='flex-row w-full items-center justify-center space-x-3 bg-white p-3 rounded-xl'
                onTouchStart={() => setIsEditable(true)}
            >
                {/* <Entypo name="location" size={25} color="green" /> */}
                <FontAwesome5 name="location-arrow" size={24} color="black" />
                <TextInput
                    className='text-gray-500 font-bold w-[90%]'
                    value={displayText}
                    editable={isEditable}
                    onChangeText={(newText) => setAddress(newText)}
                    onBlur={() => setIsEditable(false)}
                    placeholder={isFetching ? 'Fetching location...' : 'Enter address'}
                    multiline
                    numberOfLines={2}
                    style={styles.textInput}
                />
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    textInput: {
        flex: 1,
        textAlignVertical: 'top',
    },
});

export default MyLocation;
