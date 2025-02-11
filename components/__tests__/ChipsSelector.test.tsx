import React from "react";
import {
  userEvent,
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
} from "@testing-library/react-native";
import ChipsSelector from "@/components/ChipsSelector";

const TOTAL_CHIPS_COUNT = [100, 80, 60, 20, 10];

const mocktTotalChipsCount = jest.fn();
const mockSetNumberOfChips = jest.fn();

const rend = () =>
  render(
    <ChipsSelector
      numberOfChips={TOTAL_CHIPS_COUNT.length}
      totalChipsCount={TOTAL_CHIPS_COUNT}
      setTotalChipsCount={mocktTotalChipsCount}
      setNumberOfChips={mockSetNumberOfChips}
    />
  );

describe("tests for ChipsSelector", () => {
  test("ChipsSelector appears with correct default values", () => {
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

  test("updating chip count works as expected", async () => {
    rend();

    const green = screen.getByText("60");
    expect(green).toHaveStyle({ color: "green" });

    userEvent.press(green);
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

    expect(mocktTotalChipsCount).toHaveBeenCalledWith([100, 80, 64, 20, 10]);
  });

  test.todo("updating total amount of color chips works as expected");
});
