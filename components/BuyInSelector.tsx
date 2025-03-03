import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import styles, { COLORS } from "@/styles/styles";
import Button from "@/containers/Button";

interface BuyInSelectorProps {
  setBuyInAmount: React.Dispatch<React.SetStateAction<number>>;
  selectedCurrency: string; // Accept selectedCurrency as a prop
}

const defaultBuyInOptions = [10, 25, 50];

const BuyInSelector: React.FC<BuyInSelectorProps> = ({
  setBuyInAmount,
  selectedCurrency,
}) => {
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
      setBuyInAmountState(25);
      setBuyInAmount(25);
    }
  };

  const handleBuyInSelection = (amount: number) => {
    setBuyInAmountState(amount);
    setCustomAmount("");
    setBuyInAmount(amount);
  };

  return (
    <>
      <View style={{ ...styles.container, flexDirection: "row" }}>
        {defaultBuyInOptions.map((amount) => (
          <Button
            key={amount}
            color={buyInAmount === amount ? COLORS.PRIMARY : COLORS.SECONDARY}
            onPress={() => handleBuyInSelection(amount)}
            title={`${selectedCurrency} ${amount}`}
          ></Button>
        ))}
      </View>

      <Text style={styles.p}>Or enter a custom amount:</Text>
      <TextInput
        style={styles.input}
        value={customAmount}
        onChangeText={handleCustomAmountChange}
        placeholder="Enter custom buy-in"
        keyboardType="numeric"
      />

      <Text style={styles.h2}>
        Selected Buy-in:{" "}
        {buyInAmount !== null ? `${selectedCurrency} ${buyInAmount}` : "None"}
      </Text>
    </>
  );
};

export default BuyInSelector;
