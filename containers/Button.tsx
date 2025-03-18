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
  size?: "normal" | "small";
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled,
  size = "normal",
}) => {
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
        size == "normal" ? styles.button : styles.buttonSmall,
        { backgroundColor: colors.PRIMARY },
        disabled && styles.disabled,
      ]}
    >
      <Text
        style={[
          size == "normal" ? styles.buttonText : styles.buttonTextSmall,
          { color: colors.TEXT },
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
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonSmall: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginHorizontal: 2,
    marginVertical: 2,
  },
  buttonTextSmall: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Button;
