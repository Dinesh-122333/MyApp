import { Stack } from "expo-router";
import { Image } from "expo-image";
import { FlatList, Text} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useState } from "react";

export default function HomeScreen() {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const[localAssets, setlocalAssets] = useState<MediaLibrary.Asset[]>([]);
  useEffect(() => {
    if (permissionResponse?.status !== 'granted') {
      requestPermission();
    }
  }, []);

  useEffect(() => {
    if (permissionResponse?.status === 'granted') {
      loadAsset();
    }
  }, [permissionResponse]);

  const loadAsset = async () => {
    const assetPage = await MediaLibrary.getAssetsAsync(); // FIXED here
    console.log(JSON.stringify(assetPage, null, 2));

    setlocalAssets(assetPage.assets);
  };

  console.log(permissionResponse);

  return (
    <>
      <FlatList 
      data={localAssets} 
      numColumns={4}
      columnWrapperStyle={{ gap: 1, justifyContent: 'space-between', marginBottom: 1 }} // horizontal + vertical gap
      contentContainerStyle={{ padding: 1 }} 
      renderItem={({item}) => 
                    // <Text>{item.uri}</Text>
                    <Image source={{uri: item.uri}} style ={{width: '25%', aspectRatio: 1}}/>
                  } />
    </>
  );
}
