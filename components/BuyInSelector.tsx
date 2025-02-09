import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";

interface BuyInSelectorProps {
  setBuyInAmount: React.Dispatch<React.SetStateAction<number | null>>;
}

const defaultBuyInOptions = [10, 25, 50]; // Default buy-in values

const BuyInSelector: React.FC<BuyInSelectorProps> = ({ setBuyInAmount }) => {
  const [customAmount, setCustomAmount] = useState("");
  const [buyInAmount, setBuyInAmountState] = useState<number | null>(null); // Store the selected amount locally

  const handleCustomAmountChange = (value: string) => {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue) && numericValue >= 0) {
      setCustomAmount(value);
      setBuyInAmountState(numericValue); // Update buy-in amount
      setBuyInAmount(numericValue); // Pass it back to parent component
    } else {
      setCustomAmount("");
      setBuyInAmountState(null); // Reset if invalid
      setBuyInAmount(null);
    }
  };

  const handleBuyInSelection = (amount: number) => {
    setBuyInAmountState(amount);
    setCustomAmount("");
    setBuyInAmount(amount); // Pass it back to parent component
  };

  return (
    <View style={styles.container}>
      {/* Title with Money Icon */}
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://png.pngtree.com/png-vector/20191128/ourmid/pngtree-coin-money-icon-png-image_2049478.jpg",
          }}
          style={styles.icon}
        />
        <Text style={styles.title}>Select Buy-in Amount:</Text>
      </View>

      {/* Default Buy-In Options */}
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

      {/* Custom Amount Input */}
      <Text style={styles.orText}>Or enter a custom amount:</Text>
      <TextInput
        style={styles.input}
        value={customAmount}
        onChangeText={handleCustomAmountChange}
        placeholder="Enter custom buy-in"
        keyboardType="numeric"
      />

      {/* Display the selected buy-in amount */}
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
  icon: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  title: {
    fontSize: 22,
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
