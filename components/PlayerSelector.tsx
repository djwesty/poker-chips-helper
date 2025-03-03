import React from "react";
import { View, Text } from "react-native";
import Button from "@/containers/Button";
import styles from "@/styles/styles";

interface PlayerSelectorProps {
  playerCount: number;
  setPlayerCount: React.Dispatch<React.SetStateAction<number>>;
}
const MIN = 2;
const MAX = 8;
const PlayerSelector: React.FC<PlayerSelectorProps> = ({
  playerCount,
  setPlayerCount,
}) => {
  const increasePlayers = () => {
    if (playerCount < MAX) setPlayerCount(playerCount + 1);
  };

  const decreasePlayers = () => {
    if (playerCount > MIN) setPlayerCount(playerCount - 1);
  };

  return (
    <>
      <Text style={styles.h1}>{playerCount}</Text>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Button
          title="-"
          onPress={decreasePlayers}
          disabled={playerCount <= MIN}
        />
        <Button
          title="+"
          onPress={increasePlayers}
          disabled={playerCount >= MAX}
        />
      </View>
    </>
  );
};

export default PlayerSelector;
