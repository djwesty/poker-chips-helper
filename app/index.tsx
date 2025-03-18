import React, { useState, useEffect, useContext, useMemo } from "react";
import { ScrollView, Alert, useColorScheme, Appearance } from "react-native";
import Button from "@/containers/Button";
import PlayerSelector from "@/components/PlayerSelector";
import BuyInSelector from "@/components/BuyInSelector";
import ChipsSelector from "@/components/ChipsSelector";
import ChipDistributionSummary from "@/components/ChipDistributionSummary";
import ChipDetection from "@/components/ChipDetection";
import CurrencySelector from "@/components/CurrencySelector";
import { saveState, loadState } from "@/util/CalculatorState";
import {
  savePersistentState,
  loadPersistentState,
} from "@/util/PersistentState";
import styles, { COLORS } from "@/styles/styles";
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
  const colorScheme = useColorScheme();
  const darkMode = useMemo(() => colorScheme === "dark", [colorScheme]);
  const colors = useMemo(
    () => (darkMode ? COLORS.DARK : COLORS.LIGHT),
    [darkMode]
  );
  const context = useContext(AppContext);
  const isSettingsVisible = useMemo(() => context.showSettings, [context]);

  useEffect(() => {
    const loadPersistentData = async () => {
      try {
        const savedState = await loadPersistentState();
        if (savedState) {
          setPlayerCount(savedState.playerCount || 2);
          setBuyInAmount(savedState.buyInAmount || 20);
          setNumberOfChips(savedState.numberOfChips || 5);
          setTotalChipsCount(savedState.totalChipsCount || []);
          setSelectedCurrency(savedState.selectedCurrency || "$");
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
    await saveState(slot, state);
    await savePersistentState(state);
    Alert.alert(i18n.t("success"), i18n.t("state_saved", { slot }));
  };

  const handleLoad = async (slot: "SLOT1" | "SLOT2") => {
    const loadedState = await loadState(slot);
    if (loadedState) {
      setPlayerCount(loadedState.playerCount);
      setBuyInAmount(loadedState.buyInAmount ?? 20);
      setNumberOfChips(loadedState.numberOfChips);
      setTotalChipsCount(loadedState.totalChipsCount);
      setSelectedCurrency(loadedState.selectedCurrency || "$");
      await savePersistentState(loadedState);
      Alert.alert(i18n.t("success"), i18n.t("state_loaded_from", { slot }));
    } else {
      Alert.alert(i18n.t("info"), i18n.t("no_saved_state_found"));
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
        <>
          <Section
            title={i18n.t("appearance")}
            iconName={"brightness-4"}
            orientation="row"
          >
            <Button
              title={
                darkMode
                  ? i18n.t("switch_to_light_mode")
                  : i18n.t("switch_to_dark_mode")
              }
              onPress={() =>
                Appearance.setColorScheme(darkMode ? "light" : "dark")
              }
            />
          </Section>

          <Section
            title={i18n.t("select_language")}
            iconName={"language"}
            orientation="row"
          >
            <Picker
              selectedValue={selectedLanguage}
              onValueChange={handleLanguageChange}
              style={[styles.picker, { color: colors.TEXT }]}
              dropdownIconColor={colors.TEXT}
            >
              <Picker.Item
                label={i18n.t("english")}
                value="en"
                style={{
                  color: colors.TEXT,
                  backgroundColor: colors.PRIMARY,
                }}
              />
              <Picker.Item
                label={i18n.t("spanish")}
                value="es"
                style={{
                  color: colors.TEXT,
                  backgroundColor: colors.PRIMARY,
                }}
              />
            </Picker>
          </Section>

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
        </>
      )}

      <Section
        title={i18n.t("select_number_of_players")}
        iconName={"people"}
        orientation="row"
        contentStyle={{ justifyContent: "center", gap: 30 }}
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
            setNumberOfChips(chipCountArray.length);
          }}
        />
      </Section>

      <Section
        title={i18n.t("manual_chip_adjustment")}
        iconName={"account-balance"}
        orientation="row"
        contentStyle={{ alignItems: "center" }}
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
