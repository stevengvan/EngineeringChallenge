import "react-native-url-polyfill/auto";
import { supabase } from "../lib/supabase";
import { router } from "expo-router";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && session.user) router.replace("/(tabs)/one");
      else "/(auth)/login";
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace("/(auth)/login");
    });
  }, []);
}
