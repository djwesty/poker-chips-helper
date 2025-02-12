import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

interface DarkModeToggleProps {
  darkMode: boolean;
  onToggle: () => void;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ darkMode, onToggle }) => {
  return (
    <View style={[styles.container, darkMode ? styles.darkBackground : styles.lightBackground]}>
      <Text style={[styles.text, darkMode ? styles.darkText : styles.lightText]}>
        Dark Mode is {darkMode ? "Enabled" : "Disabled"}
      </Text>
      <Button title="Toggle Dark Mode" onPress={onToggle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
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

export default DarkModeToggle;

