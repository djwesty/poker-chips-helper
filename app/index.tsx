import React, { useState } from "react";
import { ScrollView, Text, Alert, Button } from "react-native";
import PlayerSelector from "@/components/PlayerSelector";
import BuyInSelector from "@/components/BuyInSelector";
import ChipsSelector from "@/components/ChipsSelector";
import ChipDistributionSummary from "@/components/ChipDistributionSummary";
import ChipDetection from "@/components/ChipDetection";
const IndexScreen = () => {
  const [playerCount, setPlayerCount] = useState(2);
  const [buyInAmount, setBuyInAmount] = useState<number | null>(null);
  const [numberOfChips, setNumberOfChips] = useState<number>(5);
  const [totalChipsCount, setTotalChipsCount] = useState<number[]>([]);
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
    <ScrollView contentContainerStyle={{ padding: 20, flexGrow: 1 }}>
      <Text style={{ fontSize: 24, marginBottom: 30, marginTop: 50 }}>
        Poker Chip Helper
      </Text>
      <PlayerSelector
        playerCount={playerCount}
        setPlayerCount={setPlayerCount}
      />
      <BuyInSelector setBuyInAmount={setBuyInAmount} />
      <ChipDetection
        totalChipsCount={totalChipsCount}
        setTotalChipsCount={setTotalChipsCount}
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
      />
      <Button
        title="Save"
        onPress={handleSave}
        disabled={buyInAmount === null}
      />
    </ScrollView>
  );
};
export default IndexScreen;
