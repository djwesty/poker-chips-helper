import React, { useMemo } from "react";
import { View, Text, useColorScheme } from "react-native";
import Button from "@/containers/Button";
import styles, { COLORS } from "@/styles/styles";

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
  const colorScheme = useColorScheme();
  const darkMode = useMemo(() => colorScheme === "dark", [colorScheme]);
  const colors = useMemo(
    () => (darkMode ? COLORS.DARK : COLORS.LIGHT),
    [darkMode]
  );

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      <Button
        title="-"
        onPress={decreasePlayers}
        disabled={playerCount <= MIN}
      />
      <Text style={[styles.h1, { color: colors.TEXT }]}>{playerCount}</Text>
      <Button
        title="+"
        onPress={increasePlayers}
        disabled={playerCount >= MAX}
      />
    </View>
  );
};

export default PlayerSelector;
