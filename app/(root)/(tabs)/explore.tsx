import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '@/components/Cards';
import { router, useLocalSearchParams } from 'expo-router';
import { useAppwrite } from '@/lib/useAppwrite';
import { getProperties } from '@/lib/appwrite';
import { useEffect } from 'react';
import Search from '@/components/Search';
import Filters from '@/components/Filters';
import icons from '@/constants/icons';
import NoResults from '@/components/NoResults';

export default function Explore() {
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  const {
    data: properties,
    loading,
    refetch
  } = useAppwrite({
    fn: getProperties,
    params: {
      filter: params.filter!,
      query: params.query!,
      limit: 6
    },
    skip: true
  });
  const handleCardPress = (id: string) => {
    router.push(`/properties/${id}`);
  };
  useEffect(() => {
    refetch({
      filter: params.filter!,
      query: params.query!,
      limit: 12
    });
  }, [params.filter, params.query]);
  return (
    <SafeAreaView className="bg-white">
      {/*<Button title="seed" onPress={seed} />*/}
      <FlatList
        data={properties}
        renderItem={({ item }) => (
          <Card
            item={item}
            onPress={() => {
              handleCardPress(item.$id);
            }}
          />
        )}
        keyExtractor={(item) => item.$id}
        numColumns={2}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View className="px-5">
              <View className="flex flex-row items-center justify-between mt-5">
                <TouchableOpacity
                  onPress={() => router.back()}
                  className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center"
                >
                  <Image source={icons.backArrow} className="size-5" />
                </TouchableOpacity>
                <Text className="text-base mr-2 text-center font-rubik-medium text-black-300">
                  Search for your ideal home
                </Text>
                <Image source={icons.bell} className="w-6 h-6" />
              </View>
              <Search />
              <View className="mt-3">
                <Text className="text-xl font-rubik-bold text-black-300">
                  Found {properties?.length} Properties
                </Text>
              </View>
            </View>
            <Filters />
          </View>
        }
        ListEmptyComponent={
          loading ? null : <NoResults />
        }
      />
    </SafeAreaView>
  );
}
