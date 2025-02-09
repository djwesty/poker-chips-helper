import React from "react";
import { View, Text, Button, Image, StyleSheet } from "react-native";

interface PlayerSelectorProps {
  playerCount: number;
  setPlayerCount: React.Dispatch<React.SetStateAction<number>>;
}

const PlayerSelector: React.FC<PlayerSelectorProps> = ({
  playerCount,
  setPlayerCount,
}) => {
  const increasePlayers = () => {
    if (playerCount < 8) setPlayerCount(playerCount + 1);
  };

  const decreasePlayers = () => {
    if (playerCount > 2) setPlayerCount(playerCount - 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://static.thenounproject.com/png/3890959-200.png",
          }}
          style={styles.icon}
        />
        <Text style={styles.title}>Select Number of Players:</Text>
      </View>

      <Text style={styles.playerCount}>{playerCount}</Text>
      <View style={{ flexDirection: "row" }}>
        <Button title="-" onPress={decreasePlayers} />
        <Button title="+" onPress={increasePlayers} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    marginLeft: 10, // Spacing between icon and text
  },
  icon: {
    width: 48, // Increased size
    height: 48, // Increased size
  },
  playerCount: {
    fontSize: 24,
    marginVertical: 10,
  },
});

export default PlayerSelector;
