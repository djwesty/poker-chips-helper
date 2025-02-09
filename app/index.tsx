import React, { useState } from "react";
import { ScrollView, Text } from "react-native";
import PlayerSelector from "@/components/PlayerSelector";

const IndexScreen = () => {
  const [playerCount, setPlayerCount] = useState(2);

  return (
    <ScrollView contentContainerStyle={{ padding: 20, flexGrow: 1 }}>
      <Text style={{ fontSize: 24, marginBottom: 30, marginTop: 50 }}>
        Poker Chip Helper
      </Text>

      <PlayerSelector
        playerCount={playerCount}
        setPlayerCount={setPlayerCount}
      />
    </ScrollView>
  );
};
export default IndexScreen;
