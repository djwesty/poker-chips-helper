import React, { useState } from "react";
import { ScrollView, Text, Alert, Button, View, StyleSheet } from "react-native";
import PlayerSelector from "@/components/PlayerSelector";
import BuyInSelector from "@/components/BuyInSelector";
import ChipsSelector from "@/components/ChipsSelector";
import ChipDistributionSummary from "@/components/ChipDistributionSummary";
import DarkModeToggle from "@/components/DarkModeToggle";

const IndexScreen = () => {
  const [playerCount, setPlayerCount] = useState(2);
  const [buyInAmount, setBuyInAmount] = useState<number | null>(null);
  const [numberOfChips, setNumberOfChips] = useState<number>(5);
  const [totalChipsCount, setTotalChipsCount] = useState<number[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  const handleSave = () => {
    if (buyInAmount === null) {
      Alert.alert("Error", "Please select a valid buy-in amount");
    } else {
      Alert.alert(
        "Success",
        `Buy-in amount set to ${buyInAmount} for ${playerCount} players`
      );
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
        <Button title="Save" onPress={handleSave} disabled={buyInAmount === null} />
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
