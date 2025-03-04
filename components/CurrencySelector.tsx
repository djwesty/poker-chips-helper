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
        <Picker.Item label={i18n.t("usd")} value="$" />
        <Picker.Item label={i18n.t("euro")} value="€" />
        <Picker.Item label={i18n.t("pound")} value="£" />
        <Picker.Item label={i18n.t("inr")} value="₹" />
      </Picker>
    </>
  );
};

export default CurrencySelector;
