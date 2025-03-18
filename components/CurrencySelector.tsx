import React from "react";
import i18n from "@/i18n/i18n";
import { Picker, PickerItem } from "@/containers/Picker";

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
        onValueChange={(itemValue) => setSelectedCurrency(itemValue.toString())}
        testID="currency-picker" // ✅ Add testID here
      >
        <PickerItem label={i18n.t("usd")} value="$" />
        <PickerItem label={i18n.t("euro")} value="€" />
        <PickerItem label={i18n.t("pound")} value="£" />
        <PickerItem label={i18n.t("inr")} value="₹" />
      </Picker>
    </>
  );
};

export default CurrencySelector;
