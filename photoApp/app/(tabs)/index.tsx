import { Link, Stack } from "expo-router";
import { Image } from "expo-image";
import { FlatList, Pressable, Text } from 'react-native';
import { useEffect } from "react";
import { useMedia } from "@/Provider/Mediaprovider";

export default function HomeScreen() {
  const { localAssets, loading, loadAsset } = useMedia();
  console.log(loading);

  useEffect(() => {
    loadAsset();
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: 'Photos', headerShown: true, headerTitleAlign: 'center' }} />

      <FlatList
      data={localAssets}
      keyExtractor={(item, index) => item.id + '-' + index} // Make sure it's unique
      numColumns={4}
      columnWrapperStyle={{ gap: 1, justifyContent: 'space-between', marginBottom: 1 }}
      contentContainerStyle={{ padding: 1 }}
      onEndReached={loadAsset}
      onEndReachedThreshold={2}
      refreshing={loading}
      ListFooterComponent={loading ? <Text style={{ textAlign: 'center', padding: 10 }}>Loading...</Text> : null}
      renderItem={({ item }) => (
        <Link href={`/asset?id=${item.id}`} asChild>
          <Pressable style={{ flex: 1 }}>
            <Image source={{ uri: item.uri }} style={{ aspectRatio: 1 }} />
          </Pressable>
        </Link>
      )}
    />
    </>
  );
}
