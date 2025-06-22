import { PropsWithChildren, createContext, useContext, useState, useEffect } from "react";
import * as MediaLibrary from 'expo-media-library';
import {  } from "react";

interface MediaContextType {
    localAssets: MediaLibrary.Asset[];
    loading: boolean;
    loadAsset: () => void;
    getAssetByid: (id: string) => MediaLibrary.Asset | undefined;
  }
const MediaContext = createContext<MediaContextType | undefined>(undefined);

export function MediaContextProvider({children}: PropsWithChildren){

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
    
      let isFetching = false;

      const loadAsset = async () => {
        if (loading || isFetching || !hasnextPage) return;
        isFetching = true;

        setLoading(true);
        const assetPage = await MediaLibrary.getAssetsAsync({ after: endCursor });

        console.log(JSON.stringify(assetPage, null, 2));
        setlocalAssets((prev) => [...prev, ...assetPage.assets]);
        sethasnextPage(assetPage.hasNextPage);
        setendCursor(assetPage.endCursor);
        setLoading(false);

        isFetching = false;
      };


      const getAssetByid = (id: string) => {
        return localAssets.find((asset) => asset.id === id);
      }
    return <MediaContext.Provider value={{ localAssets, loading, loadAsset, getAssetByid }}>{children}</MediaContext.Provider>   
}

export const useMedia = () => {
    const context = useContext(MediaContext);
    if (!context) {
      throw new Error("useMedia must be used within a MediaContextProvider");
    }
    return context;
  };
  