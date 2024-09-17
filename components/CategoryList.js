import { View, Text, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';

export default function CategoryList({ onSelectCategory }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch categories from Supabase
        const fetchCategories = async () => {
            try {
                let { data, error } = await supabase
                    .from('master_categories')
                    .select('*'); // Adjust the columns you want to fetch

                if (error) throw error;
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#00ff00" />;
    }

    const handlePress = (categoryName) => {
        onSelectCategory(categoryName); // Pass the selected category name to HomeScreen
    };

    return (
        <View className='w-full px-4 py-2'>
            <ScrollView horizontal className='space-x-4'>
                {categories.map((category) => (
                    <Pressable
                        key={category.id}
                        className='items-center justify-center bg-white p-2 rounded-xl'
                        onPress={() => handlePress(category.name)}
                    >
                        <View className='bg-white rounded-2xl px-2'>
                            <Image source={{ uri: category.image }} height={60} width={60} />
                        </View>
                        <Text className='font-semibold text-gray-500'>{category.name}</Text>
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    )
}
