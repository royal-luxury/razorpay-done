import { View, Text, Image, ScrollView } from 'react-native';
import React from 'react';

export default function OrderCard({ data }) {
    return (
        <View className="flex-row py-2 px-2 items-center bg-white w-full rounded-xl mb-3">

            {/* Left Half: Prescription Image */}
            <View className="w-2/5 flex-1">
                <Image
                    source={{ uri: `data:image/png;base64,${data.prescription}` }}
                    style={{ width: '100%', height: 150, borderRadius: 8 }}
                    resizeMode="cover"
                />
            </View>

            {/* Right Half: Order Details */}
            <View className="w-3/5 px-4">
                <Text className="text-xl font-semibold text-black">Status: {data.status}</Text>
                <Text className="text-xs font-semibold text-gray-400">Order Date : {data.date}</Text>
                <Text className="text-xs font-semibold text-gray-400">Order Time : {data.time}</Text>
                {data.items.map((item, index) => (
                    <Text key={index} className="text-xs" numberOfLines={1}>
                        {item.quantity} x {item.name}
                    </Text>
                ))}

                <Text className="font-semibold text-sm text-gray-400">Subtotal: ₹{parseFloat(data.subtotal).toFixed(2)}</Text>
                <Text className="font-semibold text-sm text-gray-400">Discount: ₹{parseFloat(data.savings).toFixed(2)}</Text>
                <Text className="font-bold text-lg text-black">Paid: ₹{parseFloat(data.topay).toFixed(2)}</Text>
            </View>
        </View>
    );
}
