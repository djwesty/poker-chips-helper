import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  darkMode: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled,
  darkMode,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        darkMode ? styles.darkButton : styles.lightButton,
        disabled && styles.disabled,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          darkMode ? styles.darkText : styles.lightText,
        ]}
      >
        {title}
      </Text>
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
