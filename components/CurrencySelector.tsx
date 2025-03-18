import React, { useMemo } from "react";
import { Picker } from "@react-native-picker/picker";
import styles, { COLORS } from "@/styles/styles";
import i18n from "@/i18n/i18n";
import { useColorScheme } from "react-native";

interface CurrencySelectorProps {
  selectedCurrency: string;
  setSelectedCurrency: React.Dispatch<React.SetStateAction<string>>;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  selectedCurrency,
  setSelectedCurrency,
}) => {
  const colorScheme = useColorScheme();
  const darkMode = useMemo(() => colorScheme === "dark", [colorScheme]);
  const colors = useMemo(
    () => (darkMode ? COLORS.DARK : COLORS.LIGHT),
    [darkMode]
  );
  return (
    <>
      <Picker
        selectedValue={selectedCurrency}
        onValueChange={(itemValue) => setSelectedCurrency(itemValue)}
        style={[styles.picker, { color: colors.TEXT }]}
        dropdownIconColor={colors.TEXT}
        testID="currency-picker" // ✅ Add testID here
      >
        <Picker.Item
          label={i18n.t("usd")}
          value="$"
          style={{
            color: colors.TEXT,
            backgroundColor: colors.PRIMARY,
          }}
        />
        <Picker.Item
          label={i18n.t("euro")}
          value="€"
          style={{
            color: colors.TEXT,
            backgroundColor: colors.PRIMARY,
          }}
        />
        <Picker.Item
          label={i18n.t("pound")}
          value="£"
          style={{
            color: colors.TEXT,
            backgroundColor: colors.PRIMARY,
          }}
        />
        <Picker.Item
          label={i18n.t("inr")}
          value="₹"
          style={{
            color: colors.TEXT,
            backgroundColor: colors.PRIMARY,
          }}
        />
      </Picker>
    </>
  );
};

export default CurrencySelector;
