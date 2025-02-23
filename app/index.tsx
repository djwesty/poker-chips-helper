import React, { useState } from "react";
import { ScrollView, Text, Alert, Button, View, StyleSheet } from "react-native";
import PlayerSelector from "@/components/PlayerSelector";
import BuyInSelector from "@/components/BuyInSelector";
import ChipsSelector from "@/components/ChipsSelector";
import ChipDistributionSummary from "@/components/ChipDistributionSummary";
import DarkModeToggle from "@/components/DarkModeToggle";
import { saveState, loadState } from "../components/CalculatorState";

const IndexScreen = () => {
  const [playerCount, setPlayerCount] = useState(2);
  const [buyInAmount, setBuyInAmount] = useState<number | null>(null);
  const [numberOfChips, setNumberOfChips] = useState<number>(5);
  const [totalChipsCount, setTotalChipsCount] = useState<number[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  const handleSave = async (slot: "SLOT1" | "SLOT2") => {
    if (buyInAmount === null) {
      Alert.alert("Error", "Please select a valid buy-in amount");
      return;
    }
    const state = { playerCount, buyInAmount, numberOfChips, totalChipsCount };
    const result = await saveState(slot, state);
    Alert.alert(result.success ? "Success" : "Error", result.message);
  };

  const handleLoad = async (slot: "SLOT1" | "SLOT2") => {
    const loadedState = await loadState(slot);
    if (loadedState) {
      setPlayerCount(loadedState.playerCount);
      setBuyInAmount(loadedState.buyInAmount);
      setNumberOfChips(loadedState.numberOfChips);
      setTotalChipsCount(loadedState.totalChipsCount);
      Alert.alert("Success", `State loaded from ${slot}`);
    } else {
      Alert.alert("Info", "No saved state found");
    }
  };

  return (
    <View style={[styles.container, darkMode ? styles.darkBackground : styles.lightBackground]}>
      <ScrollView contentContainerStyle={{ padding: 20, flexGrow: 1 }}>
        <Text style={[styles.title, darkMode ? styles.darkText : styles.lightText]}>
          Poker Chip Helper
        </Text>
        <DarkModeToggle darkMode={darkMode} onToggle={() => setDarkMode(!darkMode)} />
        <PlayerSelector playerCount={playerCount} setPlayerCount={setPlayerCount} />
        <BuyInSelector setBuyInAmount={setBuyInAmount} />
        <ChipsSelector
          totalChipsCount={totalChipsCount}
          setTotalChipsCount={setTotalChipsCount}
          numberOfChips={numberOfChips}
          setNumberOfChips={setNumberOfChips}
        />
        <ChipDistributionSummary
          playerCount={playerCount}
          buyInAmount={buyInAmount}
          totalChipsCount={totalChipsCount}
        />
        <Button title="Save to Slot 1" onPress={() => handleSave("SLOT1")} disabled={buyInAmount === null} />
        <Button title="Save to Slot 2" onPress={() => handleSave("SLOT2")} disabled={buyInAmount === null} />
        <Button title="Load from Slot 1" onPress={() => handleLoad("SLOT1")} />
        <Button title="Load from Slot 2" onPress={() => handleLoad("SLOT2")} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    marginTop: 50,
    textAlign: "center",
  },
  lightBackground: {
    backgroundColor: "#F0F0F0",
  },
  darkBackground: {
    backgroundColor: "#B0B0B0",
  },
  lightText: {
    color: "#000000",
  },
  darkText: {
    color: "#FFFFFF",
  },
});

export default IndexScreen;

