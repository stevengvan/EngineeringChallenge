import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useUserData = () => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = useCallback(async () => {
    try {
      const storedUserData = await AsyncStorage.getItem("userData");

      if (storedUserData) {
        // Parse stored machine data and set it in state
        const parsedUserData = JSON.parse(storedUserData);
        setUser(parsedUserData);
      } else {
        setUser(undefined);
      }
    } catch (error) {
      console.error(error);
      // Handle storage loading error
    }
  }, []);

  const resetUserData = useCallback(async () => {
    try {
      // Clear the machine data from local storage
      await AsyncStorage.removeItem("userData");
      setUser(undefined);
      // You can also clear other related data if needed
    } catch (error) {
      console.error(error);
      // Handle storage clearing error
    }
  }, []);

  const setUserInfo = useCallback(
    async (newUserInfo) => {
      try {
        if (!user) {
          return;
        }

        const newUserData = newUserInfo; // Deep copy machine parts

        // Update the state with the new machine data
        setUser(newUserData);

        // Persist the updated machine data to local storage
        await AsyncStorage.setItem("userData", JSON.stringify(newUserData));
      } catch (error) {
        console.error(error);
        // Handle storage saving error
      }
    },
    [user]
  );

  return {
    user,
    resetUserData,
    loadUserData,
    setUserInfo,
  };
};
