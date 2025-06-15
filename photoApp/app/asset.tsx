import { useMedia } from "@/Provider/Mediaprovider";
import { FlatList, Modal, Pressable, Text, View, Dimensions } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { Image } from "expo-image";
import { useState, useRef } from "react";
import Entypo from "@expo/vector-icons/Entypo";

const { width, height } = Dimensions.get("window");

export default function AssetPage() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { localAssets } = useMedia();

  const startIndex = localAssets.findIndex((item) => item.id === id);
  const flatListRef = useRef<FlatList>(null);

  const [showDetails, setShowDetails] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  if (startIndex === -1) return <Text>Asset not found</Text>;

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const currentAsset = localAssets[currentIndex];

  return (
    <>
      <Stack.Screen
        options={{
          title: "Photos",
          headerTitleAlign: "center",
          headerRight: () => <Entypo name="upload" size={24} color="black" />,
        }}
      />

      <FlatList
        ref={flatListRef}
        data={localAssets}
        horizontal
        pagingEnabled
        initialScrollIndex={startIndex}
        keyExtractor={(item) => item.id}
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        renderItem={({ item }) => (
          <Pressable style={{ width, height }} onPress={() => setShowDetails(true)}>
            <Image
              source={{ uri: item.uri }}
              style={{ width: "100%", height: "100%" }}
              contentFit="contain"
            />
          </Pressable>
        )}
      />

      <Modal visible={showDetails} transparent={true} animationType="slide">
        <View style={{ flex: 1, backgroundColor: "#000000aa", justifyContent: "center", padding: 20 }}>
          <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}>
            <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}>Image Details</Text>
            <Text>Filename: {currentAsset.filename}</Text>
            <Text>Width x Height: {currentAsset.width} x {currentAsset.height}</Text>
            <Text>Media Type: {currentAsset.mediaType}</Text>
            <Text>Date: {new Date(currentAsset.modificationTime).toLocaleString()}</Text>

            <Text
              onPress={() => setShowDetails(false)}
              style={{ marginTop: 20, color: "blue", textAlign: "right" }}
            >
              Close
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
}
