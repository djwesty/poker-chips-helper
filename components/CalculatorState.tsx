/*import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  SLOT1: "@poker_state_slot1",
  SLOT2: "@poker_state_slot2",
};

export interface PokerState {
  playerCount: number;
  buyInAmount: number | null;
  numberOfChips: number;
  totalChipsCount: number[];
}

export const saveState = async (slot: keyof typeof STORAGE_KEYS, state: PokerState) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS[slot], JSON.stringify(state));
    return { success: true, message: `State saved to ${slot}` };
  } catch (error) {
    return { success: false, message: "Failed to save state" };
  }
};

export const loadState = async (slot: keyof typeof STORAGE_KEYS): Promise<PokerState | null> => {
  try {
    const storedState = await AsyncStorage.getItem(STORAGE_KEYS[slot]);
    return storedState ? JSON.parse(storedState) : null;
  } catch (error) {
    return null;
  }
};*/


import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  SLOT1: "@poker_state_slot1",
  SLOT2: "@poker_state_slot2",
};

export interface PokerState {
  playerCount: number;
  buyInAmount: number | null;
  numberOfChips: number;
  totalChipsCount: number[];
}

export const saveState = async (slot: keyof typeof STORAGE_KEYS, state: PokerState) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS[slot], JSON.stringify(state));
    return { success: true, message: `State saved to ${slot}` };
  } catch (error) {
    return { success: false, message: "Failed to save state" };
  }
};

export const loadState = async (slot: keyof typeof STORAGE_KEYS): Promise<PokerState | null> => {
  try {
    const storedState = await AsyncStorage.getItem(STORAGE_KEYS[slot]);
    return storedState ? JSON.parse(storedState) : null;
  } catch (error) {
    return null;
  }
};

