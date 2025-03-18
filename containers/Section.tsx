import { View, Text, StyleSheet, useColorScheme } from "react-native";
import React, { useMemo } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import globalStyles, { COLORS } from "@/styles/styles";

const titleCase = (input: string) =>
  input
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

// Wrapper container for styling purposes
const Section = ({
  title,
  iconName,
  children,
  orientation = "column",
  contentStyle = {},
}: {
  title: string;
  iconName: string | any;
  children: React.JSX.Element;
  orientation?: "row" | "column";
  contentStyle?: object;
}) => {
  const colorScheme = useColorScheme();
  const darkMode = useMemo(() => colorScheme === "dark", [colorScheme]);
  const colors = useMemo(
    () => (darkMode ? COLORS.DARK : COLORS.LIGHT),
    [darkMode]
  );
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons
          style={styles.icon}
          name={iconName}
          size={30}
          color={colors.TEXT}
        />
        <Text style={[styles.title, { color: colors.TEXT }]}>
          {titleCase(title)}
        </Text>
      </View>
      <View
        style={{
          ...styles.content,
          ...contentStyle,
          flexDirection: orientation,
        }}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 10,
  },
  icon: {},
  title: {
    ...globalStyles.h1,
  },
  content: {
    display: "flex",
    justifyContent: "space-evenly",
    gap: 5,
  },
});

export default Section;
