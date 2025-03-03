import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import globalStyles from "@/styles/styles";

const titleCase = (input: string) =>
  input
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

//Higher Order Component (HOC) for styling purposes
const Section = ({
  title,
  iconName,
  children,
  orientation = "column",
}: {
  title: string;
  iconName: string | any;
  children: React.JSX.Element;
  orientation?: "row" | "column";
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons
          style={styles.icon}
          name={iconName}
          size={30}
          color={"black"}
        />
        <Text style={styles.title}>{titleCase(title)}</Text>
      </View>
      <View style={{ ...styles.content, flexDirection: orientation }}>
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
