import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveState, loadState, PokerState } from "../CalculatorState";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

describe("CalculatorState.tsx", () => {
  const mockState: PokerState = {
    playerCount: 4,
    buyInAmount: 50,
    numberOfChips: 5,
    totalChipsCount: [100, 200, 150, 50, 75],
    selectedCurrency: "$", // Including selectedCurrency in mockState
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should save state successfully to SLOT1", async () => {
    await saveState("SLOT1", mockState);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "@poker_state_slot1",
      JSON.stringify(mockState)
    );
  });

  it("should save state successfully to SLOT2", async () => {
    await saveState("SLOT2", mockState);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "@poker_state_slot2",
      JSON.stringify(mockState)
    );
  });

  it("should fail to save state if an error occurs", async () => {
    jest
      .spyOn(AsyncStorage, "setItem")
      .mockRejectedValueOnce(new Error("Failed to save"));
    const result = await saveState("SLOT1", mockState);
    expect(result.success).toBe(false);
    expect(result.message).toBe("Failed to save state");
  });

  it("should load state successfully from SLOT1", async () => {
    await AsyncStorage.setItem("@poker_state_slot1", JSON.stringify(mockState));
    const result = await loadState("SLOT1");
    expect(result).toEqual(mockState);
  });

  it("should load state successfully from SLOT2", async () => {
    await AsyncStorage.setItem("@poker_state_slot2", JSON.stringify(mockState));
    const result = await loadState("SLOT2");
    expect(result).toEqual(mockState);
  });

  it("should return null if no state is found in SLOT1", async () => {
    jest.spyOn(AsyncStorage, "getItem").mockResolvedValueOnce(null);
    const result = await loadState("SLOT1");
    expect(result).toBeNull();
  });

  it("should return null if no state is found in SLOT2", async () => {
    jest.spyOn(AsyncStorage, "getItem").mockResolvedValueOnce(null);
    const result = await loadState("SLOT2");
    expect(result).toBeNull();
  });

  it("should return null if an error occurs while loading state from SLOT1", async () => {
    jest
      .spyOn(AsyncStorage, "getItem")
      .mockRejectedValueOnce(new Error("Failed to load"));
    const result = await loadState("SLOT1");
    expect(result).toBeNull();
  });

  it("should return null if an error occurs while loading state from SLOT2", async () => {
    jest
      .spyOn(AsyncStorage, "getItem")
      .mockRejectedValueOnce(new Error("Failed to load"));
    const result = await loadState("SLOT2");
    expect(result).toBeNull();
  });
});
