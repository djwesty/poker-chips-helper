import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@poker_calculator_state";

export interface PokerState {
  playerCount: number;
  buyInAmount: number | null;
  numberOfChips: number;
  totalChipsCount: number[];
}

export const savePersistentState = async (state: PokerState) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return { success: true, message: "State saved successfully" };
  } catch (error) {
    return { success: false, message: "Failed to save state" };
  }
};

export const loadPersistentState = async (): Promise<PokerState | null> => {
  try {
    const storedState = await AsyncStorage.getItem(STORAGE_KEY);
    return storedState ? JSON.parse(storedState) : null;
  } catch (error) {
    return null;
  }
};
