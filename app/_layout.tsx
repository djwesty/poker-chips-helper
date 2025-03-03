import AppContext, { IAppContext } from "@/util/context";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React, { useMemo, useState } from "react";

const RootLayout: React.FC = () => {
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const ctx = useMemo<IAppContext>(
    () => ({
      showSettings,
    }),
    [showSettings]
  );

  return (
    <AppContext.Provider value={ctx}>
      <Stack
        screenOptions={{
          headerShown: true,
          title: "Poker Chips Helper",
          headerRight: () => (
            <MaterialIcons
              name="settings"
              onPress={() => setShowSettings(!showSettings)}
              size={30}
            />
          ),
        }}
      />
    </AppContext.Provider>
  );
};

export default RootLayout;
