import { supabase } from "@/utils/supabase";
import { StatusBar } from "expo-status-bar";
import { Button, Platform } from "react-native";

export default function Modal(){
    return(
        <>
            <Button title="Sign out" onPress={() => supabase.auth.signOut()}/>
            <StatusBar style={Platform.OS === 'android' ? 'dark' : 'auto'} />
        </>
    )
}