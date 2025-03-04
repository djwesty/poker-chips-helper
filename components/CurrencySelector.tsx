import React from "react";
import { Picker } from "@react-native-picker/picker";
import styles from "@/styles/styles";
import i18n from "@/i18n/i18n";

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
        <Picker.Item label={i18n.t("USD")} value="$" />
        <Picker.Item label={i18n.t("Euro")} value="€" />
        <Picker.Item label={i18n.t("Pound")} value="£" />
        <Picker.Item label={i18n.t("INR")} value="₹" />
      </Picker>
    </>
  );
};

export default CurrencySelector;
