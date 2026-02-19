import { ActivityIndicator, Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { useAppwrite } from '@/lib/useAppwrite';
import { getPropertyById } from '@/lib/appwrite';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '@/constants/icons';
import { facilities } from '@/constants/data';

const { width } = Dimensions.get('window');

const facilityIconMap: Record<string, any> = Object.fromEntries(facilities.map((f) => [f.title.toLowerCase(), f.icon]));

export default function Property() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: property, loading } = useAppwrite({
    fn: getPropertyById,
    params: { id: id! }
  });

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#0061FF" />
      </SafeAreaView>
    );
  }

  if (!property) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="font-rubik text-black-200">Property not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={{ width, height: 320 }}>
          <Image source={{ uri: property.image }} style={{ width, height: 320 }} resizeMode="cover" />
          <View className="absolute top-0 left-0 right-0 flex-row items-center justify-between px-5 pt-12">
            <TouchableOpacity onPress={() => router.back()} className="bg-white/80 rounded-full p-2.5">
              <Image source={icons.backArrow} className="size-5" />
            </TouchableOpacity>
            <TouchableOpacity className="bg-white/80 rounded-full p-2.5">
              <Image source={icons.heart} className="size-5" tintColor="#0061FF" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-5 mt-5">
          {/* Name + Type */}
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-rubik-bold text-black-300 flex-1 mr-3">{property.name}</Text>
            <View className="bg-primary-100 px-3 py-1 rounded-full">
              <Text className="text-primary-300 font-rubik-medium text-sm">{property.type}</Text>
            </View>
          </View>

          <View className="flex-row items-center mt-2 gap-3">
            <View className="flex-row items-center gap-1">
              <Image source={icons.star} className="size-4" />
              <Text className="text-black-200 font-rubik-medium text-sm">{property.rating}</Text>
            </View>
            <View className="flex-row items-center gap-1 flex-1">
              <Image source={icons.location} className="size-4" tintColor="#8C8E98" />
              <Text className="text-black-200 font-rubik text-sm flex-1" numberOfLines={1}>
                {property.address}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-center mt-5 bg-primary-100 rounded-2xl p-4 gap-8">
            <View className="flex-col items-center gap-1">
              <Image source={icons.bed} className="size-6" tintColor="#0061FF" />
              <Text className="text-black-300 font-rubik-bold text-base">{property.bedrooms}</Text>
              <Text className="text-black-200 font-rubik text-xs">Bedrooms</Text>
            </View>
            <View className="w-px h-12 bg-primary-200" />
            <View className="flex-col items-center gap-1">
              <Image source={icons.bath} className="size-6" tintColor="#0061FF" />
              <Text className="text-black-300 font-rubik-bold text-base">{property.bathrooms}</Text>
              <Text className="text-black-200 font-rubik text-xs">Bathrooms</Text>
            </View>
            <View className="w-px h-12 bg-primary-200" />
            <View className="flex-col items-center gap-1">
              <Image source={icons.area} className="size-6" tintColor="#0061FF" />
              <Text className="text-black-300 font-rubik-bold text-base">{property.area}</Text>
              <Text className="text-black-200 font-rubik text-xs">sqft</Text>
            </View>
          </View>

          {property.facilities?.length > 0 && (
            <View className="mt-6">
              <Text className="text-xl font-rubik-bold text-black-300 mb-3">Facilities</Text>
              <View className="flex-row flex-wrap gap-4">
                {property.facilities.map((name: string, i: number) => {
                  const icon = facilityIconMap[name.toLowerCase()];
                  return (
                    <View key={i} className="items-center gap-1.5 w-16">
                      <View className="bg-primary-100 rounded-full p-3">
                        <Image source={icon ?? icons.info} className="size-6" tintColor="#0061FF" />
                      </View>
                      <Text className="text-xs font-rubik text-black-200 text-center">{name}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          <View className="mt-6">
            <Text className="text-xl font-rubik-bold text-black-300 mb-2">Overview</Text>
            <Text className="text-black-200 font-rubik text-base leading-6">{property.description}</Text>
          </View>

          <View className="mt-6">
            <Text className="text-xl font-rubik-bold text-black-300 mb-2">Location</Text>
            <View className="flex-row items-center gap-2">
              <Image source={icons.location} className="size-5" tintColor="#0061FF" />
              <Text className="text-black-200 font-rubik text-base flex-1">{property.address}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-5 left-0 right-0 bg-white border-t border-primary-100 px-5 py-4 flex-row items-center justify-between">
        <View>
          <Text className="text-black-200 font-rubik text-xs">Price</Text>
          <Text className="text-primary-300 font-rubik-extrabold text-2xl">${property.price}</Text>
        </View>
        <TouchableOpacity className="bg-primary-300 rounded-full px-10 py-4">
          <Text className="text-white font-rubik-bold text-base">Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
