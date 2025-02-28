import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface CurrencySelectorProps {
  selectedCurrency: string;
  setSelectedCurrency: React.Dispatch<React.SetStateAction<string>>;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  selectedCurrency,
  setSelectedCurrency,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Currency:</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: 150,
  },
});

export default CurrencySelector;
