import React, { useEffect, useState, useRef } from 'react';
import { View, Image, ActivityIndicator, Text, ScrollView, Dimensions } from 'react-native';
import { supabase } from '../supabase';

const { width } = Dimensions.get('window');

export default function AdsBanner() {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollViewRef = useRef();
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // Fetch ads from Supabase
        const fetchAds = async () => {
            try {
                let { data, error } = await supabase
                    .from('master_ads')
                    .select('id, image'); // Select the id and image columns

                if (error) throw error;
                setAds(data);
            } catch (error) {
                console.error('Error fetching ads:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAds();
    }, []);

    useEffect(() => {
        if (ads.length > 0) {
            const interval = setInterval(() => {
                scrollToNext();
            }, 2000); // Change image every 2 seconds

            return () => clearInterval(interval);
        }
    }, [ads, currentIndex]);

    const scrollToNext = () => {
        const nextIndex = currentIndex === ads.length - 1 ? 0 : currentIndex + 1;
        scrollViewRef.current.scrollTo({ x: nextIndex * width, animated: true });
        setCurrentIndex(nextIndex);
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#00ff00" />;
    }

    if (ads.length === 0) {
        return <Text>No Ads Available</Text>;
    }

    return (
        <View className='w-full h-45 px-3 py-2'>
            <View style={{ backgroundColor: '#E6FFFA', padding: 0, borderRadius: 10, overflow: 'hidden' }}>
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    style={{ width: '100%', borderRadius: 10 }}
                >
                    {ads.map((ad) => (
                        <View key={ad.id} style={{ width, height: 200, borderRadius: 10, overflow: 'hidden' }}>
                            <Image
                                source={{ uri: ad.image }}
                                style={{ width: '100%', height: '100%', borderRadius: 10 }}
                                resizeMode="cover"
                            />
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}
