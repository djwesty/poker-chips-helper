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
import { Picker } from "@react-native-picker/picker";
import i18n from "@/i18n/i18n";

const IndexScreen: React.FC = () => {
  const [playerCount, setPlayerCount] = useState(2);
  const [buyInAmount, setBuyInAmount] = useState<number>(20);
  const [numberOfChips, setNumberOfChips] = useState<number>(5);
  const [totalChipsCount, setTotalChipsCount] = useState<number[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("$");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
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
      Alert.alert(i18n.t("error"), i18n.t("please_select_valid_buyin"));
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
      Alert.alert(i18n.t("success"), i18n.t("state_saved", { slot })); // Fixed interpolation
    } catch (error) {
      console.error("Error saving state:", error);
      Alert.alert(i18n.t("error"), i18n.t("failed_to_save_state"));
    }
  };

  const handleLoad = async (slot: "SLOT1" | "SLOT2") => {
    try {
      const loadedState = await loadState(slot);
      if (loadedState) {
        setPlayerCount(loadedState.playerCount);
        setBuyInAmount(loadedState.buyInAmount ?? 20);
        setNumberOfChips(loadedState.numberOfChips);
        setTotalChipsCount(loadedState.totalChipsCount);
        setSelectedCurrency(loadedState.selectedCurrency || "$");
        await savePersistentState(loadedState);
        console.log(`Game state loaded from ${slot}:`, loadedState);
        Alert.alert(i18n.t("success"), i18n.t("state_loaded_from", { slot })); // Fixed interpolation
      } else {
        Alert.alert(i18n.t("info"), i18n.t("no_saved_state_found"));
      }
    } catch (error) {
      console.error("Error loading state:", error);
      Alert.alert(i18n.t("error"), i18n.t("failed_to_load_state"));
    }
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    i18n.changeLanguage(language);
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContent}
    >
      {isSettingsVisible && (
        <Section
          title={i18n.t("select_language")}
          iconName={"language"}
          orientation="row"
        >
          <Picker
            selectedValue={selectedLanguage}
            onValueChange={handleLanguageChange}
            style={styles.picker}
          >
            <Picker.Item label={i18n.t("english")} value="en" />
            <Picker.Item label={i18n.t("spanish")} value="es" />
          </Picker>
        </Section>
      )}

      {isSettingsVisible && (
        <Section
          title={i18n.t("select_currency")}
          iconName={"attach-money"}
          orientation="row"
        >
          <CurrencySelector
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrency}
          />
        </Section>
      )}

      <Section
        title={i18n.t("select_number_of_players")}
        iconName={"people"}
        orientation="row"
      >
        <PlayerSelector
          playerCount={playerCount}
          setPlayerCount={setPlayerCount}
        />
      </Section>

      <Section
        title={i18n.t("select_buyin_amount")}
        iconName={"monetization-on"}
      >
        <BuyInSelector
          selectedCurrency={selectedCurrency}
          setBuyInAmount={setBuyInAmount}
        />
      </Section>

      <Section
        title={i18n.t("automatic_chip_detection")}
        iconName={"camera-alt"}
      >
        <ChipDetection
          updateChipCount={(chipData) => {
            const chipCountArray = Object.values(chipData);
            setTotalChipsCount(chipCountArray);
          }}
        />
      </Section>

      <Section
        title={i18n.t("manual_chip_adjustment")}
        iconName={"account-balance"}
      >
        <ChipsSelector
          totalChipsCount={totalChipsCount}
          setTotalChipsCount={setTotalChipsCount}
          numberOfChips={numberOfChips}
          setNumberOfChips={setNumberOfChips}
        />
      </Section>

      <Section
        title={i18n.t("distribution_and_denomination")}
        iconName={"currency-exchange"}
      >
        <ChipDistributionSummary
          playerCount={playerCount}
          buyInAmount={buyInAmount}
          totalChipsCount={totalChipsCount}
          selectedCurrency={selectedCurrency}
        />
      </Section>

      <Section
        title={i18n.t("save_and_load")}
        iconName={"save"}
        orientation="row"
      >
        <>
          <Button
            title={i18n.t("save_slot_1")}
            onPress={() => handleSave("SLOT1")}
            disabled={buyInAmount === null}
          />
          <Button
            title={i18n.t("save_slot_2")}
            onPress={() => handleSave("SLOT2")}
            disabled={buyInAmount === null}
          />
          <Button
            title={i18n.t("load_slot_1")}
            onPress={() => handleLoad("SLOT1")}
          />
          <Button
            title={i18n.t("load_slot_2")}
            onPress={() => handleLoad("SLOT2")}
          />
        </>
      </Section>
    </ScrollView>
  );
};

export default IndexScreen;
