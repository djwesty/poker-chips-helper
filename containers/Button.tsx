import { COLORS } from "@/styles/styles";
import React, { useMemo } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ title, onPress, disabled }) => {
  const colorScheme = useColorScheme();
  const darkMode = useMemo(() => colorScheme === "dark", [colorScheme]);
  const colors = useMemo(
    () => (darkMode ? COLORS.DARK : COLORS.LIGHT),
    [darkMode]
  );
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={[
        styles.button,
        { backgroundColor: colors.PRIMARY },
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.buttonText, { color: colors.TEXT }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  darkButton: {
    backgroundColor: "#333333",
  },
  lightButton: {
    backgroundColor: "#DDDDDD",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  darkText: {
    color: "#FFFFFF",
  },
  lightText: {
    color: "#000000",
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Button;
