import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ekwpmtnwjosyhnoqyxms.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrd3BtdG53am9zeWhub3F5eG1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDMxMDE1NzgsImV4cCI6MjAxODY3NzU3OH0.1l25m6I3KDrwfB0Bo7EdZ51bJOTj9Age4u_FF4-nsX0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
