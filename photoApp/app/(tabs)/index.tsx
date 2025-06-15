import { Stack } from "expo-router";
import { Image } from "expo-image";
import { FlatList, Text} from 'react-native';
import { useMedia } from "@/Provider/Mediaprovider";

export default function HomeScreen() {
  const {localAssets, loading, loadAsset} = useMedia();

  return (
    <>
    <Stack.Screen options={{title: 'Photos', headerShown: true}}/>
      <FlatList 
      data={localAssets} 
      numColumns={4}
      columnWrapperStyle={{ gap: 1, justifyContent: 'space-between', marginBottom: 1 }} // horizontal + vertical gap
      contentContainerStyle={{ padding: 1 }} 
      onEndReached={loadAsset}
      onEndReachedThreshold={2}
      // refreshing ={true}
      renderItem={({item}) => 
                    // <Text>{item.uri}</Text>
                    <Image source={{uri: item.uri}} style ={{width: '25%', aspectRatio: 1}}/>
                  }
     />
     {/* {hasnextPage && <Text onPress={loadAsset} style ={{color: 'white', textAlign: 'center', padding: 10}}>Load next</Text>} */}
    </>
  );
}
