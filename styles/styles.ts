import { StyleSheet } from "react-native";

export const COLORS = {
  WARNING: "#c79c28",
  LIGHT: {
    TEXT: "black",
    PRIMARY: "lightgrey",
    SECONDARY: "azure",
    BACKGROUND: "ghostwhite",
    DISABLED: "gray",
  },
  DARK: {
    TEXT: "white",
    PRIMARY: "black",
    SECONDARY: "teal",
    BACKGROUND: "dimgrey",
    DISABLED: "gray",
  },
};

const GlobalStyles = StyleSheet.create({
  scrollView: {},
  scrollViewContent: {
    padding: 15,
  },

  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  h1: { fontSize: 19, fontWeight: "bold" },
  h2: { fontSize: 18, fontWeight: "normal" },
  p: {
    fontSize: 16,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginVertical: 10,
    borderRadius: 5,
  },
  modal: {},

  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  shadow: {
    textShadowColor: "black",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  picker: {
    borderRadius: 10,
    height: 55,
    width: 150,
  },
  pickerItem: {},
  pickerWrapper: {
    borderRadius: 10,
    overflow: "hidden",
  },
});

export default GlobalStyles;
