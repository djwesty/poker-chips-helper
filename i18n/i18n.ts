import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import en from "./en.json";
import es from "./es.json";
const resources = {
  en,
  es,
};

const detectedLanguage = Localization.locale.split("-")[0] || "en";

i18n.use(initReactI18next).init({
  resources,
  lng: detectedLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
