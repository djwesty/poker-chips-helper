import React from "react";
import { Picker } from "@react-native-picker/picker";
import styles from "@/styles/styles";

interface CurrencySelectorProps {
  selectedCurrency: string;
  setSelectedCurrency: React.Dispatch<React.SetStateAction<string>>;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  selectedCurrency,
  setSelectedCurrency,
}) => {
  return (
    <>
      <Picker
        selectedValue={selectedCurrency}
        onValueChange={(itemValue) => setSelectedCurrency(itemValue)}
        style={styles.picker}
        testID="currency-picker" // ✅ Add testID here
      >
        <Picker.Item label="USD ($)" value="$" />
        <Picker.Item label="Euro (€)" value="€" />
        <Picker.Item label="Pound (£)" value="£" />
        <Picker.Item label="INR (₹)" value="₹" />
      </Picker>
    </>
  );
};

export default CurrencySelector;
