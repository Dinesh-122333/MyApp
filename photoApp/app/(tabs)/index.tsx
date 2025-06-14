import { Stack } from "expo-router";
import { Image } from "expo-image";
import { FlatList, Text} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useState } from "react";

export default function HomeScreen() {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const [hasnextPage, sethasnextPage] = useState(true);
  const[endCursor, setendCursor] = useState<string>();
  const[loading, setLoading] = useState(false);

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
    if (loading || !hasnextPage){
      return;
    }

    setLoading(true);
    const assetPage = await MediaLibrary.getAssetsAsync({after: endCursor}); // FIXED here
    console.log(JSON.stringify(assetPage, null, 2));

    setlocalAssets((existingitem) => [...existingitem, ...assetPage.assets]);
    sethasnextPage(assetPage.hasNextPage);
    setendCursor(assetPage.endCursor);
    setLoading(false);
  };

  console.log(permissionResponse);

  return (
    <>
      <FlatList 
      data={localAssets} 
      numColumns={4}
      columnWrapperStyle={{ gap: 1, justifyContent: 'space-between', marginBottom: 1 }} // horizontal + vertical gap
      contentContainerStyle={{ padding: 1 }} 
      onEndReached={loadAsset}
      onEndReachedThreshold={2}
      refreshing={loading}
      renderItem={({item}) => 
                    // <Text>{item.uri}</Text>
                    <Image source={{uri: item.uri}} style ={{width: '25%', aspectRatio: 1}}/>
                  }
     />
     {/* {hasnextPage && <Text onPress={loadAsset} style ={{color: 'white', textAlign: 'center', padding: 10}}>Load next</Text>} */}
    </>
  );
}
