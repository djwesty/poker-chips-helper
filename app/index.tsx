import React, { useState } from "react";
import { ScrollView, Text, Alert, Button } from "react-native";
import PlayerSelector from "@/components/PlayerSelector";
import BuyInSelector from "@/components/BuyInSelector";

const IndexScreen = () => {
  const [playerCount, setPlayerCount] = useState(2);
  const [buyInAmount, setBuyInAmount] = useState<number | null>(null);

  const handleSave = () => {
    if (buyInAmount === null) {
      Alert.alert("Error", "Please select a valid buy-in amount");
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

      <Button
        title="Save"
        onPress={handleSave}
        disabled={buyInAmount === null}
      />
    </ScrollView>
  );
};

export default IndexScreen;
