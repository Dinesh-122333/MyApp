import { Link, Stack } from "expo-router";
import { Image } from "expo-image";
import { FlatList, Pressable, Text, Alert } from 'react-native';
import { useEffect } from "react";
import { useMedia } from "@/Provider/Mediaprovider";
import { MaterialIcons } from '@expo/vector-icons'
import { supabase } from "@/utils/supabase";

function handleSignOut() {
  supabase.auth.signOut()
    .then(() => {
      console.log('Signed out')
    })
    .catch((error) => {
      Alert.alert('Error', error.message)
    })
}
export default function HomeScreen() {
  const { localAssets, loading, loadAsset } = useMedia();
  // console.log(loading);

  useEffect(() => {
    loadAsset();
  }, []);

  return (
    <>
      <Stack.Screen 
        options={{ title: 'Photos', 
                  headerShown: true, 
                  headerTitleAlign: 'center', 
                  headerRight: () => (
                  <Pressable onPress={handleSignOut} style={{ marginRight: 10 }}>
                    <MaterialIcons name="logout" size={24} color="black" />
                  </Pressable>
                ),}} />

      <FlatList
      data={localAssets}
      keyExtractor={(item, index) => item.id + '-' + index} // Make sure it's unique
      numColumns={4}
      columnWrapperStyle={{ gap: 1, justifyContent: 'space-between', marginBottom: 1 }}
      contentContainerStyle={{ padding: 1 }}
      onEndReached={loadAsset}
      onEndReachedThreshold={0.3}
      refreshing={loading}
      ListFooterComponent={
        loading ? <Text style={{ textAlign: 'center', padding: 10 }}>Loading...</Text> : null
      }
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
