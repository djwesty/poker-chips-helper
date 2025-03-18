import styles, { COLORS } from "@/styles/styles";
import { PickerItemProps, PickerProps } from "@react-native-picker/picker";
import { useMemo } from "react";
import { useColorScheme, View } from "react-native";
import { Picker as RNPicker } from "@react-native-picker/picker";

export const PickerItem: React.FC<PickerItemProps> = (props) => {
  const colorScheme = useColorScheme();
  const darkMode = useMemo(() => colorScheme === "dark", [colorScheme]);
  const colors = useMemo(
    () => (darkMode ? COLORS.DARK : COLORS.LIGHT),
    [darkMode]
  );

  return (
    <RNPicker.Item
      style={[
        styles.pickerItem,
        { color: colors.TEXT, backgroundColor: colors.PRIMARY },
      ]}
      {...props}
    />
  );
};

export const Picker: React.FC<PickerProps> = (props) => {
  const colorScheme = useColorScheme();
  const darkMode = useMemo(() => colorScheme === "dark", [colorScheme]);
  const colors = useMemo(
    () => (darkMode ? COLORS.DARK : COLORS.LIGHT),
    [darkMode]
  );

  return (
    <View style={styles.pickerWrapper}>
      <RNPicker
        style={[
          styles.picker,
          {
            color: colors.TEXT,
            backgroundColor: colors.PRIMARY,
          },
        ]}
        dropdownIconColor={colors.TEXT}
        {...props}
      />
    </View>
  );
};
