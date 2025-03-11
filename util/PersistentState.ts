import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@poker_calculator_state";

export interface PokerState {
  playerCount: number;
  buyInAmount: number | null;
  numberOfChips: number;
  totalChipsCount: number[];
  selectedCurrency: string;
}

const DEFAULT_STATE: PokerState = {
  playerCount: 0,
  buyInAmount: null,
  numberOfChips: 0,
  totalChipsCount: [],
  selectedCurrency: "$",
};

// 🔹 Save state with currency
export const savePersistentState = async (state: PokerState) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return { success: true, message: "State saved successfully" };
  } catch (error) {
    return { success: false, message: "Failed to save state" };
  }
};

// 🔹 Load state with currency
export const loadPersistentState = async (): Promise<PokerState> => {
  try {
    const storedState = await AsyncStorage.getItem(STORAGE_KEY);
    return storedState ? JSON.parse(storedState) : DEFAULT_STATE; // Ensure default values
  } catch (error) {
    return DEFAULT_STATE;
  }
};
