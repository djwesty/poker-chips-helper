import React from "react";
import { View, Text } from "react-native";
import Button from "@/containers/Button";
import styles from "@/styles/styles";

interface PlayerSelectorProps {
  playerCount: number;
  setPlayerCount: React.Dispatch<React.SetStateAction<number>>;
  darkMode: boolean;
}

const MIN = 2;
const MAX = 8;

const PlayerSelector: React.FC<PlayerSelectorProps> = ({
  playerCount,
  setPlayerCount,
  darkMode,
}) => {
  const increasePlayers = () => {
    if (playerCount < MAX) setPlayerCount(playerCount + 1);
  };

  const decreasePlayers = () => {
    if (playerCount > MIN) setPlayerCount(playerCount - 1);
  };

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Button
        title="-"
        onPress={decreasePlayers}
        disabled={playerCount <= MIN}
        darkMode={darkMode}
      />
      <Text style={styles.h1}>{playerCount}</Text>
      <Button
        title="+"
        onPress={increasePlayers}
        disabled={playerCount >= MAX}
        darkMode={darkMode}
      />
    </View>
  );
};

export default PlayerSelector;
