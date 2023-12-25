import "react-native-url-polyfill/auto";
import { supabase } from "../lib/supabase";
import { router } from "expo-router";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserData } from "./useUserData";

export default function App() {
  const { setUserInfo } = useUserData();
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && session.user) router.replace("/(tabs)/one");
      else "/(auth)/login";
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace("/(auth)/login");
    });

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        try {
          setUserInfo({ email: user.email, id: user.id });
        } catch (error) {
          console.error(error);
        }
      }
    });
  }, []);
}
