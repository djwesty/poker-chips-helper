import React, { ReactNode } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  StyleSheet,
  Dimensions,
} from "react-native";

interface PokerAppUiProps {
  children: ReactNode;
  darkMode?: boolean;
}

const PokerAppUi: React.FC<PokerAppUiProps> = ({
  children,
  darkMode = false,
}) => {
  const screenHeight = Dimensions.get("window").height;

  return (
    <SafeAreaView
      style={[styles.safeArea, darkMode ? styles.lightGray : styles.light]}
    >
      <StatusBar barStyle={"dark-content"} />
      <View style={[styles.container, { minHeight: screenHeight }]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: "100%",
    padding: 16,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  light: {
    backgroundColor: "#F5F5F5",
  },
  lightGray: {
    backgroundColor: "#D3D3D3",
  },
});

export default PokerAppUi;
