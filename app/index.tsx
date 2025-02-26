import React, { useState } from "react";
import { ScrollView, Text, Alert, Button, View, StyleSheet } from "react-native";
import PlayerSelector from "@/components/PlayerSelector";
import BuyInSelector from "@/components/BuyInSelector";
import ChipsSelector from "@/components/ChipsSelector";
import ChipDistributionSummary from "@/components/ChipDistributionSummary";
import { saveState, loadState } from "../components/CalculatorState";

const IndexScreen = () => {
  const [playerCount, setPlayerCount] = useState(2);
  const [buyInAmount, setBuyInAmount] = useState<number | null>(null);
  const [numberOfChips, setNumberOfChips] = useState<number>(5);
  const [totalChipsCount, setTotalChipsCount] = useState<number[]>([]);

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
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20, flexGrow: 1 }}>
      <PlayerSelector playerCount={playerCount} setPlayerCount={setPlayerCount} />
      <BuyInSelector setBuyInAmount={setBuyInAmount} />
      <ChipDetection updateChipCount={updateChipCount} />
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
});

export default IndexScreen;
