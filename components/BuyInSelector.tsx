import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import styles, { COLORS } from "@/styles/styles";
import Button from "@/containers/Button";
import i18n from "@/i18n/i18n";

interface BuyInSelectorProps {
  setBuyInAmount: React.Dispatch<React.SetStateAction<number>>;
  selectedCurrency: string;
  darkMode: boolean;
}

const defaultBuyInOptions = [10, 25, 50];
const MIN = 1;
const MAX = 200;

const parseRoundClamp = (num: string): number => {
  const parsed = parseFloat(num);
  const rounded = Math.round(parsed);
  return Math.min(Math.max(rounded, MIN), MAX);
};

const BuyInSelector: React.FC<BuyInSelectorProps> = ({
  setBuyInAmount,
  selectedCurrency,
  darkMode,
}) => {
  const [customAmount, setCustomAmount] = useState("");
  const [buyInAmount, setBuyInAmountState] = useState<number | null>(null);

  const handleCustomAmountChange = (value: string) => {
    const numericValue = parseRoundClamp(value);
    if (!isNaN(numericValue) && numericValue >= 0) {
      setCustomAmount(numericValue.toString());
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
            onPress={() => handleBuyInSelection(amount)}
            title={`${selectedCurrency} ${amount}`}
            darkMode={darkMode}
          />
        ))}
      </View>

      <TextInput
        style={styles.input}
        value={customAmount}
        maxLength={3}
        onChangeText={handleCustomAmountChange}
        placeholder={`${i18n.t("custom_buy_in")} ${MIN} - ${MAX}`}
        keyboardType="numeric"
      />

      <Text style={styles.h2}>
        {`${i18n.t("selected_buy_in")} `}
        {buyInAmount !== null
          ? `${selectedCurrency} ${buyInAmount}`
          : i18n.t("none")}
      </Text>
    </>
  );
};

export default BuyInSelector;
