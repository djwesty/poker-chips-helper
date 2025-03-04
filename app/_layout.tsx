import i18n from "@/i18n/i18n";
import AppContext, { IAppContext } from "@/util/context";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React, { useMemo, useState } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";

const RootLayout: React.FC = () => {
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const { t } = useTranslation();

  const ctx = useMemo<IAppContext>(
    () => ({
      showSettings,
    }),
    [showSettings]
  );

  return (
    <AppContext.Provider value={ctx}>
      <I18nextProvider i18n={i18n}>
        <Stack
          screenOptions={{
            headerShown: true,
            title: t("poker_chips_helper"),
            headerRight: () => (
              <MaterialIcons
                name="settings"
                onPress={() => setShowSettings(!showSettings)}
                size={30}
              />
            ),
          }}
        />
      </I18nextProvider>
    </AppContext.Provider>
  );
};

export default RootLayout;
