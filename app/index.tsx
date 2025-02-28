import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  Alert,
  Button,
  View,
  StyleSheet,
} from "react-native";
import PlayerSelector from "@/components/PlayerSelector";
import BuyInSelector from "@/components/BuyInSelector";
import ChipsSelector from "@/components/ChipsSelector";
import ChipDistributionSummary from "@/components/ChipDistributionSummary";
import ChipDetection from "@/components/ChipDetection";
import CurrencySelector from "@/components/CurrencySelector";
import { saveState, loadState } from "@/components/CalculatorState";
import {
  savePersistentState,
  loadPersistentState,
} from "@/components/PersistentState";

// Your existing states
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
  const [selectedCurrency, setSelectedCurrency] = useState<string>("$");
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  // Load persistent data on startup
  useEffect(() => {
    const loadPersistentData = async () => {
      try {
        console.log("Loading persistent game state...");
        const savedState = await loadPersistentState();
        if (savedState) {
          console.log("Persistent state restored:", savedState);
          setPlayerCount(savedState.playerCount || 2); // Use defaults if missing
          setBuyInAmount(savedState.buyInAmount || 20); // Use defaults if missing
          setNumberOfChips(savedState.numberOfChips || 5); // Use defaults if missing
          setTotalChipsCount(savedState.totalChipsCount || []); // Use defaults if missing
          setSelectedCurrency(savedState.selectedCurrency || "$"); // Restore the selected currency, defaulting to "$" if not available
        } else {
          console.log("No persistent state found, using defaults.");
        }
      } catch (error) {
        console.error("Error loading persistent state:", error);
      }
    };
    loadPersistentData();
  }, []);

  const handleSave = async (slot: "SLOT1" | "SLOT2") => {
    if (buyInAmount === null) {
      Alert.alert("Error", "Please select a valid buy-in amount");
      return;
    }
    const state = {
      playerCount,
      buyInAmount,
      numberOfChips,
      totalChipsCount,
      selectedCurrency,
    };
    try {
      await saveState(slot, state);
      await savePersistentState(state);
      console.log(`Game state saved to ${slot}:`, state);
      Alert.alert("Success", `State saved to ${slot}`);
    } catch (error) {
      console.error("Error saving state:", error);
      Alert.alert("Error", "Failed to save state.");
    }
  };

  const handleLoad = async (slot: "SLOT1" | "SLOT2") => {
    try {
      const loadedState = await loadState(slot);
      if (loadedState) {
        setPlayerCount(loadedState.playerCount);
        setBuyInAmount(loadedState.buyInAmount);
        setNumberOfChips(loadedState.numberOfChips);
        setTotalChipsCount(loadedState.totalChipsCount);
        setSelectedCurrency(loadedState.selectedCurrency || "$");
        await savePersistentState(loadedState);
        console.log(`Game state loaded from ${slot}:`, loadedState);
        Alert.alert("Success", `State loaded from ${slot}`);
      } else {
        Alert.alert("Info", "No saved state found.");
      }
    } catch (error) {
      console.error("Error loading state:", error);
      Alert.alert("Error", "Failed to load state.");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20, flexGrow: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Poker Chips Helper</Text>
        <Button
          title="Settings"
          onPress={() => setIsSettingsVisible(!isSettingsVisible)}
        />
      </View>

      {isSettingsVisible && (
        <View style={styles.settingsContainer}>
          <Text style={styles.settingTitle}>Currency Selector</Text>
          <CurrencySelector
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrency}
          />
        </View>
      )}

      <PlayerSelector
        playerCount={playerCount}
        setPlayerCount={setPlayerCount}
      />

      <BuyInSelector
        selectedCurrency={selectedCurrency}
        setBuyInAmount={setBuyInAmount}
      />

      <ChipDetection
        updateChipCount={(chipData) => {
          const chipCountArray = Object.values(chipData);
          setTotalChipsCount(chipCountArray);
        }}
      />
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
        selectedCurrency={selectedCurrency}
      />

      <Button
        title="Save to Slot 1"
        onPress={() => handleSave("SLOT1")}
        disabled={buyInAmount === null}
      />
      <Button
        title="Save to Slot 2"
        onPress={() => handleSave("SLOT2")}
        disabled={buyInAmount === null}
      />
      <Button title="Load from Slot 1" onPress={() => handleLoad("SLOT1")} />
      <Button title="Load from Slot 2" onPress={() => handleLoad("SLOT2")} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  settingsContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default IndexScreen;
