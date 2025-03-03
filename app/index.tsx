import React, { useState, useEffect, useContext, useMemo } from "react";
import { ScrollView, Alert } from "react-native";
import Button from "@/containers/Button";
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
import styles from "@/styles/styles";
import Section from "@/containers/Section";
import AppContext from "@/util/context";

const IndexScreen: React.FC = () => {
  const [playerCount, setPlayerCount] = useState(2);
  const [buyInAmount, setBuyInAmount] = useState<number>(20);
  const [numberOfChips, setNumberOfChips] = useState<number>(5);
  const [totalChipsCount, setTotalChipsCount] = useState<number[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("$");
  const context = useContext(AppContext);
  const isSettingsVisible = useMemo(() => context.showSettings, [context]);

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
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContent}
    >
      {isSettingsVisible && (
        <Section title={"Select Currency"} iconName={"attach-money"}>
          <CurrencySelector
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrency}
          />
        </Section>
      )}

      <Section
        title={"Select the number of players"}
        iconName={"people"}
        orientation="row"
      >
        <PlayerSelector
          playerCount={playerCount}
          setPlayerCount={setPlayerCount}
        />
      </Section>

      <Section title={"Select buy-in amount"} iconName={"monetization-on"}>
        <BuyInSelector
          selectedCurrency={selectedCurrency}
          setBuyInAmount={setBuyInAmount}
        />
      </Section>

      <Section title={"Automatic Chip Detection"} iconName={"camera-alt"}>
        <ChipDetection
          updateChipCount={(chipData) => {
            const chipCountArray = Object.values(chipData);
            setTotalChipsCount(chipCountArray);
          }}
        />
      </Section>

      <Section title={"Manual Chip Adjustment"} iconName={"account-balance"}>
        <ChipsSelector
          totalChipsCount={totalChipsCount}
          setTotalChipsCount={setTotalChipsCount}
          numberOfChips={numberOfChips}
          setNumberOfChips={setNumberOfChips}
        />
      </Section>

      <Section
        title={"Distribution & Denomination"}
        iconName={"currency-exchange"}
      >
        <ChipDistributionSummary
          playerCount={playerCount}
          buyInAmount={buyInAmount}
          totalChipsCount={totalChipsCount}
          selectedCurrency={selectedCurrency}
        />
      </Section>

      <Section title={"Save + Load"} iconName={"save"} orientation="row">
        <>
          <Button
            title={"Save\nSlot 1"}
            onPress={() => handleSave("SLOT1")}
            disabled={buyInAmount === null}
          />
          <Button
            title={"Save\nSlot 2"}
            onPress={() => handleSave("SLOT2")}
            disabled={buyInAmount === null}
          />
          <Button title={"Load\nSlot 1"} onPress={() => handleLoad("SLOT1")} />
          <Button title={"Load\nSlot 2"} onPress={() => handleLoad("SLOT2")} />
        </>
      </Section>
    </ScrollView>
  );
};

export default IndexScreen;
