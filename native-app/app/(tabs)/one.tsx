import { Button, Platform, StyleSheet } from "react-native";
import { Text, View } from "../../components/Themed";
import { Link, useFocusEffect } from "expo-router";
import axios from "axios";
import { useMachineData } from "../useMachineData";
import { useCallback, useState } from "react";
import { PartsOfMachine } from "../../components/PartsOfMachine";
import { MachineScore } from "../../components/MachineScore";
import { supabase } from "../../lib/supabase";
// import { HOST } from "@env";
import { useUserData } from "../useUserData";

let apiUrl: string =
  "https://fancy-dolphin-65b07b.netlify.app/api/machine-health";

if (__DEV__) {
  apiUrl = `http://${
    Platform?.OS === "android" ? "10.0.2.2" : "localhost"
  }:3001/`;
}

export default function StateScreen() {
  const { machineData, resetMachineData, loadMachineData, setScores } =
    useMachineData();
  const { user, loadUserData } = useUserData();

  //Doing this because we're not using central state like redux
  useFocusEffect(
    useCallback(() => {
      loadMachineData();
      loadUserData();
    }, [])
  );

  const calculateHealth = useCallback(async () => {
    try {
      const response = await axios.post(apiUrl + "machine-health", {
        machines: machineData?.machines,
      });

      if (response.data?.factory) {
        setScores(response.data);
      }
    } catch (error) {
      console.error(error);
      console.log(
        `There was an error calculating health. ${
          error.toString() === "AxiosError: Network Error"
            ? "Is the api server started?"
            : error
        }`
      );
    }
  }, [machineData]);

  const SaveMachineState = async () => {
    try {
      const { machines, scores } = machineData;
      const factoryInsertResponse = await supabase
        .from("Factory")
        .insert({
          score: scores.factory,
          user_id: user?.id,
        })
        .select();

      if (factoryInsertResponse.error) throw factoryInsertResponse.error;

      const factoryID = factoryInsertResponse.data[0].id;
      for (const machine in scores.machineScores) {
        const machineInsertResponse = await supabase.from("Machine").insert({
          name: machine,
          score: scores.machineScores[machine],
          parts: JSON.stringify(machines[machine]),
          factory_id: factoryID,
        });
        if (machineInsertResponse.error) throw machineInsertResponse.error;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.separator} />
      {!machineData && (
        <Link href="/two" style={styles.link}>
          <Text style={styles.linkText}>
            Please log a part to check machine health
          </Text>
        </Link>
      )}
      {machineData && (
        <>
          <PartsOfMachine
            machineName={"Welding Robot"}
            parts={machineData?.machines?.weldingRobot}
          />
          <PartsOfMachine
            machineName={"Assembly Line"}
            parts={machineData?.machines?.assemblyLine}
          />
          <PartsOfMachine
            machineName={"Painting Station"}
            parts={machineData?.machines?.paintingStation}
          />
          <PartsOfMachine
            machineName={"Quality Control Station"}
            parts={machineData?.machines?.qualityControlStation}
          />
          <View
            style={styles.separator}
            lightColor="#eee"
            darkColor="rgba(255,255,255,0.1)"
          />
          <Text style={styles.title}>Factory Health Score</Text>
          <Text style={styles.text}>
            {machineData?.scores?.factory
              ? machineData?.scores?.factory
              : "Not yet calculated"}
          </Text>
          {machineData?.scores?.machineScores && (
            <>
              <Text style={styles.title2}>Machine Health Scores</Text>
              {Object.keys(machineData?.scores?.machineScores).map((key) => (
                <MachineScore
                  key={key}
                  machineName={key}
                  score={machineData?.scores?.machineScores[key]}
                />
              ))}
            </>
          )}
        </>
      )}
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Button title="Calculate Health" onPress={calculateHealth} />
      <View style={styles.saveButton}>
        <Button title="Save Machine state" onPress={SaveMachineState} />
      </View>
      <View style={styles.resetButton}>
        <Button
          title="Reset Machine Data"
          onPress={async () => await resetMachineData()}
          color="#FF0000"
        />
      </View>
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
  saveButton: {
    marginTop: 10,
  },
  resetButton: {
    marginTop: 10,
  },
});
