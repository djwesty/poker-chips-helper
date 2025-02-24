import { Stack } from "expo-router";
import React from "react";

const RootLayout: React.FC = () => (
  <Stack screenOptions={{ headerShown: true, title: "Poker Chips Helper" }} />
);
export default RootLayout;
