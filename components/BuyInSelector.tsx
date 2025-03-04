import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import styles, { COLORS } from "@/styles/styles";
import Button from "@/containers/Button";
import i18n from "@/i18n/i18n";

interface BuyInSelectorProps {
  setBuyInAmount: React.Dispatch<React.SetStateAction<number>>;
  selectedCurrency: string;
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
          />
        ))}
      </View>

      <Text style={styles.p}>{i18n.t("custom_buy_in")}</Text>

      <TextInput
        style={styles.input}
        value={customAmount}
        onChangeText={handleCustomAmountChange}
        placeholder={i18n.t("enter_custom_buy_in")}
        keyboardType="numeric"
      />

      <Text style={styles.h2}>
        {`${i18n.t("selected_buy_in")}: `}
        {buyInAmount !== null
          ? `${selectedCurrency} ${buyInAmount}`
          : i18n.t("none")}
      </Text>
    </>
  );
};

export default BuyInSelector;
