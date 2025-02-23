import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveState, loadState, PokerState } from "../CalculatorState";

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

describe("CalculatorState.tsx", () => {
  const mockState: PokerState = {
    playerCount: 4,
    buyInAmount: 50,
    numberOfChips: 5,
    totalChipsCount: [100, 200, 150, 50, 75],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should save state successfully", async () => {
    (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(undefined);
    const result = await saveState("SLOT1", mockState);
    expect(result.success).toBe(true);
    expect(result.message).toBe("State saved to SLOT1");
    expect(AsyncStorage.setItem).toHaveBeenCalledWith("@poker_state_slot1", JSON.stringify(mockState));
  });

  it("should fail to save state if an error occurs", async () => {
    (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error("Failed to save"));
    const result = await saveState("SLOT1", mockState);
    expect(result.success).toBe(false);
    expect(result.message).toBe("Failed to save state");
  });

  it("should load state successfully", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockState));
    const result = await loadState("SLOT1");
    expect(result).toEqual(mockState);
  });

  it("should return null if no state is found", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    const result = await loadState("SLOT1");
    expect(result).toBeNull();
  });

  it("should return null if an error occurs while loading state", async () => {
    (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error("Failed to load"));
    const result = await loadState("SLOT1");
    expect(result).toBeNull();
  });
});
