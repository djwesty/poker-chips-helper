import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  savePersistentState,
  loadPersistentState,
  PokerState,
} from "../PersistentState";

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

describe("PersistentState.tsx", () => {
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

  it("should save state successfully", async () => {
    // Mocking AsyncStorage.setItem to resolve successfully
    (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(undefined);

    const result = await savePersistentState(mockState);

    // Check that the success flag is true and message is as expected
    expect(result.success).toBe(true);
    expect(result.message).toBe("State saved successfully");

    // Check that AsyncStorage.setItem was called with the correct parameters
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "@poker_calculator_state",
      JSON.stringify(mockState)
    );
  });

  it("should fail to save state if an error occurs", async () => {
    // Mocking AsyncStorage.setItem to reject with an error
    (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(
      new Error("Failed to save")
    );

    const result = await savePersistentState(mockState);

    // Check that the success flag is false and message is as expected
    expect(result.success).toBe(false);
    expect(result.message).toBe("Failed to save state");
  });

  it("should load state successfully", async () => {
    // Mocking AsyncStorage.getItem to resolve with the mockState
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(mockState)
    );

    const result = await loadPersistentState();

    // Check that the loaded state matches the mockState
    expect(result).toEqual(mockState);
  });

  it("should load default state if no saved state is found", async () => {
    // Mocking AsyncStorage.getItem to return null (no saved state)
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    const result = await loadPersistentState();

    // Check that the default state is returned
    expect(result).toEqual({
      playerCount: 0,
      buyInAmount: null,
      numberOfChips: 0,
      totalChipsCount: [],
      selectedCurrency: "$",
    });
  });

  it("should return default state if an error occurs while loading", async () => {
    // Mocking AsyncStorage.getItem to reject with an error
    (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(
      new Error("Failed to load")
    );

    const result = await loadPersistentState();

    // Check that the default state is returned on error
    expect(result).toEqual({
      playerCount: 0,
      buyInAmount: null,
      numberOfChips: 0,
      totalChipsCount: [],
      selectedCurrency: "$",
    });
  });
});
