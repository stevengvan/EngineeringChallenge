import { Link, Stack } from "expo-router";
import { StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";
import { useUserData } from "./useUserData";
import { useCallback } from "react";
import { useFocusEffect } from "expo-router";

export default function NotFoundScreen() {
  const { user, loadUserData } = useUserData();

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [])
  );

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Text style={styles.title}>This screen doesn't exist.</Text>

        <Link href={user ? "/(tabs)/one" : "/(auth)/login"} style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
});
