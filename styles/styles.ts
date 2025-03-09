import { StyleSheet } from "react-native";

export const COLORS = {
  PRIMARY: "#007bff",
  SECONDARY: "#6c757d",
  SUCCESS: "#28a745",
  DANGER: "#dc3545",
  WARNING: "#c79c28",
};

const lightStyles = StyleSheet.create({});
const darkStyles = StyleSheet.create({});

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

  h1: { fontSize: 20, fontWeight: "bold" },
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
    height: 50,
    width: 150,
  },
});

export default GlobalStyles;
