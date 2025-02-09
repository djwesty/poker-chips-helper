import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import BuyInSelector from "@/components/BuyInSelector";

describe("BuyInSelector Component", () => {
  it("renders the buy-in options and input correctly", () => {
    const setBuyInAmount = jest.fn();
    const { getByText, getByPlaceholderText } = render(
      <BuyInSelector setBuyInAmount={setBuyInAmount} />
    );

    expect(getByText("Select Buy-in Amount:")).toBeTruthy();
    expect(getByText("10")).toBeTruthy();
    expect(getByText("25")).toBeTruthy();
    expect(getByText("50")).toBeTruthy();
    expect(getByPlaceholderText("Enter custom buy-in")).toBeTruthy();
  });

  it("sets a predefined buy-in amount correctly", () => {
    const setBuyInAmount = jest.fn();
    const { getByText } = render(
      <BuyInSelector setBuyInAmount={setBuyInAmount} />
    );

    fireEvent.press(getByText("25"));
    expect(setBuyInAmount).toHaveBeenCalledWith(25);
  });

  it("sets a custom buy-in amount correctly", () => {
    const setBuyInAmount = jest.fn();
    const { getByPlaceholderText } = render(
      <BuyInSelector setBuyInAmount={setBuyInAmount} />
    );

    fireEvent.changeText(getByPlaceholderText("Enter custom buy-in"), "100");
    expect(setBuyInAmount).toHaveBeenCalledWith(100);
  });

  it("resets custom amount if invalid input is entered", () => {
    const setBuyInAmount = jest.fn();
    const { getByPlaceholderText } = render(
      <BuyInSelector setBuyInAmount={setBuyInAmount} />
    );

    fireEvent.changeText(getByPlaceholderText("Enter custom buy-in"), "-10");
    expect(setBuyInAmount).toHaveBeenCalledWith(null);
  });

  it("clears the custom amount when selecting a predefined option", () => {
    const setBuyInAmount = jest.fn();
    const { getByText, getByPlaceholderText } = render(
      <BuyInSelector setBuyInAmount={setBuyInAmount} />
    );

    fireEvent.changeText(getByPlaceholderText("Enter custom buy-in"), "100");
    fireEvent.press(getByText("50"));
    expect(setBuyInAmount).toHaveBeenCalledWith(50);
  });
});
