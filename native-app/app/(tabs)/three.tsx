import { Button, Platform, StyleSheet } from "react-native";
import { Text, View } from "../../components/Themed";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function SettingScreen() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUser(user);
      else alert("Error accessing user");
    });
  }, []);

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(`Error message:\n${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.username}>User: {user && user.email}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  username: {
    fontSize: 25,
    fontWeight: "bold",
  },
});
