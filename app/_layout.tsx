import i18n from "@/i18n/i18n";
import { COLORS } from "@/styles/styles";
import AppContext, { IAppContext } from "@/util/context";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React, { useMemo, useState } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import { useColorScheme } from "react-native";

const RootLayout: React.FC = () => {
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const { t } = useTranslation();

  const ctx = useMemo<IAppContext>(
    () => ({
      showSettings,
    }),
    [showSettings]
  );

  const colorScheme = useColorScheme();
  const darkMode = useMemo(() => colorScheme === "dark", [colorScheme]);
  const colors = useMemo(
    () => (darkMode ? COLORS.DARK : COLORS.LIGHT),
    [darkMode]
  );
  return (
    <AppContext.Provider value={ctx}>
      <I18nextProvider i18n={i18n}>
        <Stack
          screenOptions={{
            contentStyle: {
              backgroundColor: colors.BACKGROUND,
            },
            headerShown: true,
            title: t("poker_chips_helper"),
            navigationBarColor: colors.PRIMARY,
            headerRight: () => (
              <MaterialIcons
                name="settings"
                onPress={() => setShowSettings(!showSettings)}
                size={30}
                color={colors.TEXT}
              />
            ),
            headerStyle: {
              backgroundColor: colors.PRIMARY,
            },
            headerTintColor: colors.TEXT,
            statusBarBackgroundColor: "grey",
          }}
        />
      </I18nextProvider>
    </AppContext.Provider>
  );
};

export default RootLayout;
