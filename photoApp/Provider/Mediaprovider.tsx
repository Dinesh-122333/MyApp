import { PropsWithChildren, createContext, useContext, useState, useEffect } from "react";
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import {decode} from 'base64-arraybuffer'
import {  } from "react";
import { supabase } from "@/utils/supabase";
import { useAuth } from "./Authprovider";

interface MediaContextType {
    localAssets: MediaLibrary.Asset[];
    loading: boolean;
    loadAsset: () => void;
    getAssetByid: (id: string) => MediaLibrary.Asset | undefined;
    syncToCloud: (asset: MediaLibrary.Asset) => Promise<void>;
  }
const MediaContext = createContext<MediaContextType | undefined>(undefined);

export function MediaContextProvider({children}: PropsWithChildren){

      const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
    
      const [hasnextPage, sethasnextPage] = useState(true);
      const[endCursor, setendCursor] = useState<string>();
      const[loading, setLoading] = useState(false);

      const {user} = useAuth();
    
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

      const syncToCloud = async (asset: MediaLibrary.Asset) => {
        console.warn("Syncing...", asset);
        const info = await MediaLibrary.getAssetInfoAsync(asset);
        // console.log(JSON.stringify(info, null, 2));
        // console.log(info.localUri);
        if (!info.localUri || !user){
          return;
        }
        const base64String = await FileSystem.readAsStringAsync(info.localUri, {encoding: 'base64'});
        // console.log(base64String);

        const extension = asset.filename.split('.').pop()?.toLowerCase();
        const arrayBuffer = decode(base64String);
        const {data, error} = await supabase.storage
          .from ('assets')
          .upload(`${user?.id}/${asset.filename}`, arrayBuffer,{
            contentType: `image/${extension}`,
            upsert: true, 
          });
        // console.log(arrayBuffer);
        console.log(data, error);
        
      }
    return <MediaContext.Provider value={{ localAssets, loading, loadAsset, getAssetByid, syncToCloud }}>{children}</MediaContext.Provider>   
}

export const useMedia = () => {
    const context = useContext(MediaContext);
    if (!context) {
      throw new Error("useMedia must be used within a MediaContextProvider");
    }
    return context;
  };

function lookup(filename: string): string | undefined {
  throw new Error("Function not implemented.");
}
  