import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface BuyInSelectorProps {
  setBuyInAmount: React.Dispatch<React.SetStateAction<number | null>>;
}

const defaultBuyInOptions = [10, 25, 50];

const BuyInSelector: React.FC<BuyInSelectorProps> = ({ setBuyInAmount }) => {
  const [customAmount, setCustomAmount] = useState("");
  const [buyInAmount, setBuyInAmountState] = useState<number | null>(null);

  const handleCustomAmountChange = (value: string) => {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue) && numericValue >= 0) {
      setCustomAmount(value);
      setBuyInAmountState(numericValue);
      setBuyInAmount(numericValue);
    } else {
      setCustomAmount("");
      setBuyInAmountState(null);
      setBuyInAmount(null);
    }
  };

  const handleBuyInSelection = (amount: number) => {
    setBuyInAmountState(amount);
    setCustomAmount("");
    setBuyInAmount(amount);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="monetization-on" size={30} color="green" />
        <Text style={styles.title}>Select Buy-in Amount:</Text>
      </View>

      <View style={styles.optionsContainer}>
        {defaultBuyInOptions.map((amount) => (
          <TouchableOpacity
            key={amount}
            style={[
              styles.buyInButton,
              buyInAmount === amount ? styles.selectedButton : null,
            ]}
            onPress={() => handleBuyInSelection(amount)}
          >
            <Text style={styles.buttonText}>{amount}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.orText}>Or enter a custom amount:</Text>
      <TextInput
        style={styles.input}
        value={customAmount}
        onChangeText={handleCustomAmountChange}
        placeholder="Enter custom buy-in"
        keyboardType="numeric"
      />

      <Text style={styles.selectionText}>
        Selected Buy-in: {buyInAmount !== null ? buyInAmount : "None"}
      </Text>
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
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    marginLeft: 10,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  buyInButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: "#4caf50",
  },
  buttonText: {
    fontSize: 16,
  },
  orText: {
    marginTop: 10,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginVertical: 10,
    borderRadius: 5,
  },
  selectionText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BuyInSelector;
