import React, { useCallback, useState } from "react";
import { Button, Platform, StyleSheet, TextInput } from "react-native";
import { Text, View } from "../components/Themed";
import { useFocusEffect } from "expo-router";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Testing</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  title2: {
    fontSize: 17,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: "80%",
  },
  text: {},
  link: {
    paddingBottom: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
  resetButton: {
    marginTop: 10,
  },
});
