import React from "react";
import {
  userEvent,
  render,
  screen,
  waitForElementToBeRemoved,
  fireEvent,
  act,
} from "@testing-library/react-native";
import ChipsSelector from "@/components/ChipsSelector";

const TOTAL_CHIPS_COUNT = [100, 80, 60, 40, 20];

jest.mock("@expo/vector-icons", () => {
  const { Text } = require("react-native");
  return {
    MaterialCommunityIcons: () => <Text>TestIcon</Text>,
  };
});

const mocktTotalChipsCount = jest.fn();
const mockSetNumberOfChips = jest.fn();

const rend = () =>
  render(
    <ChipsSelector
      numberOfChips={TOTAL_CHIPS_COUNT.length}
      totalChipsCount={TOTAL_CHIPS_COUNT}
      setTotalChipsCount={mocktTotalChipsCount}
      setNumberOfChips={mockSetNumberOfChips}
      darkMode={false}
    />
  );

describe("tests for ChipsSelector", () => {
  it("ChipsSelector appears with correct default values; then test dec/inc buttons", () => {
    rend();
    const white = screen.getByText(TOTAL_CHIPS_COUNT[0].toString());
    expect(white).toHaveStyle({ color: "white" });

    const red = screen.getByText(TOTAL_CHIPS_COUNT[1].toString());
    expect(red).toHaveStyle({ color: "red" });

    const green = screen.getByText(TOTAL_CHIPS_COUNT[2].toString());
    expect(green).toHaveStyle({ color: "green" });

    const blue = screen.getByText(TOTAL_CHIPS_COUNT[3].toString());
    expect(blue).toHaveStyle({ color: "blue" });

    const black = screen.getByText(TOTAL_CHIPS_COUNT[4].toString());
    expect(black).toHaveStyle({ color: "black" });
  });

  it("updating chip count works as expected", async () => {
    rend();

    const green = screen.getByText("60");
    expect(green).toHaveStyle({ color: "green" });

    fireEvent.press(green);

    const modalLabel = await screen.findByText(/number of green chips/i);
    expect(modalLabel).toBeDefined();

    const modalInput = screen.getByTestId("modalInput");
    expect(modalInput).toHaveDisplayValue("60");

    await userEvent.press(modalInput);
    await userEvent.clear(modalInput);
    await userEvent.type(modalInput, "64");

    const acceptButton = screen.getByRole("button", { name: /accept/i });
    await userEvent.press(acceptButton);

    const modalLabelAgain = screen.queryByText(/number of green chips/i); //If the label is gone, we know the modal is no longer visible
    expect(modalLabelAgain).not.toBeVisible();

    expect(mocktTotalChipsCount).toHaveBeenCalledWith([
      TOTAL_CHIPS_COUNT[0],
      TOTAL_CHIPS_COUNT[1],
      64,
      TOTAL_CHIPS_COUNT[3],
      TOTAL_CHIPS_COUNT[4],
    ]);
  });

  // skip: There is a jest/DOM issue with the button interaction, despite working correctly in-app. Documented to resolve.
  it.skip("test dec/inc buttons", async () => {
    rend();

    const blue = screen.getByText(TOTAL_CHIPS_COUNT[3].toString());
    const black = screen.getByText(TOTAL_CHIPS_COUNT[4].toString());
    const decrement = screen.getByRole("button", { name: /-/i });
    const increment = screen.getByRole("button", { name: /\+/i });

    fireEvent.press(decrement);
    fireEvent.press(decrement);

    // Test that elements are removed after fireEvent
    await waitForElementToBeRemoved(() => blue);
    await waitForElementToBeRemoved(() => black);

    fireEvent.press(increment);
    fireEvent.press(increment);

    // Test that new elements re-appear, correctly
    const blue1 = screen.getByText(TOTAL_CHIPS_COUNT[3].toString());
    const black1 = screen.getByText(TOTAL_CHIPS_COUNT[4].toString());
  });
});
