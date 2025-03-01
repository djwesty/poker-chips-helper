import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  Alert,
  Button,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
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

  useEffect(() => {
    const loadPersistentData = async () => {
      try {
        console.log("Loading persistent game state...");
        const savedState = await loadPersistentState();
        if (savedState) {
          console.log("Persistent state restored:", savedState);
          setPlayerCount(savedState.playerCount || 2);
          setBuyInAmount(savedState.buyInAmount || 20);
          setNumberOfChips(savedState.numberOfChips || 5);
          setTotalChipsCount(savedState.totalChipsCount || []);
          setSelectedCurrency(savedState.selectedCurrency || "$");
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
        <TouchableOpacity
          onPress={() => setIsSettingsVisible(!isSettingsVisible)}
        >
          <Text>
            <FontAwesome name="cog" size={30} color="black" />
          </Text>
        </TouchableOpacity>
      </View>

      {isSettingsVisible && (
        <View style={styles.settingsContainer}>
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

      <View style={styles.buttonContainer}>
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
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20,
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
  buttonContainer: {
    marginTop: 20,
  },
});

export default IndexScreen;
