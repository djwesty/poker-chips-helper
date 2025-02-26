import React, { useState, useEffect } from "react";
import { ScrollView, Alert, Button } from "react-native";
import PlayerSelector from "@/components/PlayerSelector";
import BuyInSelector from "@/components/BuyInSelector";
import ChipsSelector from "@/components/ChipsSelector";
import ChipDistributionSummary from "@/components/ChipDistributionSummary";
import ChipDetection from "@/components/ChipDetection";
import { saveState, loadState } from "@/components/CalculatorState";

export enum COLORS {
  "white",
  "red",
  "green",
  "blue",
  "black",
}

const IndexScreen: React.FC = () => {
  const [playerCount, setPlayerCount] = useState(2);
  const [buyInAmount, setBuyInAmount] = useState<number>(20);
  const [numberOfChips, setNumberOfChips] = useState<number>(5);
  const [totalChipsCount, setTotalChipsCount] = useState<number[]>([]);

  useEffect(() => {
    const loadSavedState = async () => {
      const savedState = await loadState("SLOT1"); // Default loading from SLOT1
      if (savedState) {
        setPlayerCount(savedState.playerCount);
        setBuyInAmount(savedState.buyInAmount);
        setNumberOfChips(savedState.numberOfChips);
        setTotalChipsCount(savedState.totalChipsCount);
      }
    };
    loadSavedState();
  }, []);

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

  const updateChipCount = (chipData: { [color: string]: number }) => {
    const chipCountArray = Object.values(chipData);
    setTotalChipsCount(chipCountArray);
  };

  return (
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
      <Button title="Load from Slot 1" onPress={() => handleLoad("SLOT1")} />
      <Button title="Load from Slot 2" onPress={() => handleLoad("SLOT2")} />
    </ScrollView>
  );
};

export default IndexScreen;
