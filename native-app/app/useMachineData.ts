import { useState, useEffect, useMemo, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabase";
import { useFocusEffect } from "expo-router";
import { useUserData } from "./useUserData";
import axios from "axios";
import { Platform } from "react-native";

let apiUrl: string =
  "https://fancy-dolphin-65b07b.netlify.app/api/machine-health";

if (__DEV__) {
  apiUrl = `http://${
    Platform?.OS === "android" ? "10.0.2.2" : "localhost"
  }:3001/`;
}

export const useMachineData = () => {
  const [machineData, setMachineData] = useState(undefined);
  const { loadUserData } = useUserData();

  useEffect(() => {
    // Load machine data from local storage when the hook initializes
    loadUserData();
    loadMachineData();
  }, []);

  const loadMachineData = useCallback(async () => {
    try {
      const storedMachineData = await AsyncStorage.getItem("machineData");

      // request last machine state calculated from supabase
      let storedMachineData2 = undefined;
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        storedMachineData2 = await axios.get(apiUrl + "machine-state/latest", {
          params: {
            user: user.id,
          },
        });
      }

      // TODO: parse machine parts in storedMachineData2 to get part values extracted
      //       and used along with factory score and machines' scores

      console.log(storedMachineData);
      if (storedMachineData2) {
        // Parse stored machine data and set it in state
        const parsedMachineData = JSON.parse(storedMachineData);
        setMachineData(parsedMachineData);
      } else {
        setMachineData(undefined);
      }
    } catch (error) {
      console.error(error);
      // Handle storage loading error
    }
  }, []);

  const resetMachineData = useCallback(async () => {
    try {
      // Clear the machine data from local storage
      await AsyncStorage.removeItem("machineData");
      setMachineData(undefined);
      // You can also clear other related data if needed
    } catch (error) {
      console.error(error);
      // Handle storage clearing error
    }
  }, []);

  const updateMachineData = useCallback(async (newMachineData) => {
    try {
      // Update the state with the new machine data
      setMachineData(newMachineData);

      // Persist the updated machine data to local storage
      await AsyncStorage.setItem("machineData", JSON.stringify(newMachineData));
    } catch (error) {
      console.error(error);
      // Handle storage saving error
    }
  }, []);

  const setScores = useCallback(
    async (newScores) => {
      try {
        if (!machineData) {
          return;
        }

        const newMachineData = JSON.parse(JSON.stringify(machineData)); // Deep copy machine parts

        newMachineData.scores = newScores;

        // Update the state with the new machine data
        setMachineData(newMachineData);

        // Persist the updated machine data to local storage
        await AsyncStorage.setItem(
          "machineData",
          JSON.stringify(newMachineData)
        );
      } catch (error) {
        console.error(error);
        // Handle storage saving error
      }
    },
    [machineData]
  );

  return {
    machineData,
    updateMachineData,
    resetMachineData,
    loadMachineData,
    setScores,
  };
};
