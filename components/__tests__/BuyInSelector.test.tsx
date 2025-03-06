import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import BuyInSelector from "@/components/BuyInSelector";

// Mocking vector icons to prevent errors
jest.mock("@expo/vector-icons", () => {
  const { Text } = require("react-native");
  return {
    MaterialIcons: () => <Text>MaterialIcons</Text>,
  };
});

describe("BuyInSelector Component", () => {
  let setBuyInAmount: jest.Mock;

  // Render the component and return query methods
  const renderComponent = (selectedCurrency = "$") => {
    const utils = render(
      <BuyInSelector
        setBuyInAmount={setBuyInAmount}
        selectedCurrency={selectedCurrency}
      />
    );
    return {
      ...utils,
      getByText: utils.getByText,
      getByPlaceholderText: utils.getByPlaceholderText,
      queryByText: utils.queryByText,
    };
  };

  beforeEach(() => {
    setBuyInAmount = jest.fn();
  });

  it("renders the buy-in options and input correctly", () => {
    const { getByText, getByPlaceholderText, queryByText } = renderComponent();

    expect(getByText("$ 10")).toBeTruthy();
    expect(getByText("$ 25")).toBeTruthy();
    expect(getByText("$ 50")).toBeTruthy();
    expect(getByPlaceholderText("Enter custom buy-in")).toBeTruthy();
    expect(queryByText(/Selected Buy-in:.*None/i)).toBeTruthy();
  });

  it("sets a predefined buy-in amount correctly", () => {
    const { getByText } = renderComponent();

    fireEvent.press(getByText("$ 25"));
    expect(setBuyInAmount).toHaveBeenCalledWith(25);
  });

  it("sets a custom buy-in amount correctly", () => {
    const { getByPlaceholderText } = renderComponent();

    fireEvent.changeText(getByPlaceholderText("Enter custom buy-in"), "100");
    expect(setBuyInAmount).toHaveBeenCalledWith(100);
  });

  it("resets custom amount if invalid input is entered", () => {
    const { getByPlaceholderText } = renderComponent();

    fireEvent.changeText(getByPlaceholderText("Enter custom buy-in"), "-10");
    expect(setBuyInAmount).toHaveBeenCalledWith(25); // Default reset

    fireEvent.changeText(getByPlaceholderText("Enter custom buy-in"), "abc");
    expect(setBuyInAmount).toHaveBeenCalledWith(25);
  });

  it("clears the custom amount when selecting a predefined option", () => {
    const { getByPlaceholderText, getByText } = renderComponent();

    fireEvent.changeText(getByPlaceholderText("Enter custom buy-in"), "100");
    fireEvent.press(getByText("$ 50"));
    expect(setBuyInAmount).toHaveBeenCalledWith(50);
  });

  it("handles valid and invalid input for custom amount correctly", () => {
    const { getByPlaceholderText } = renderComponent();

    fireEvent.changeText(getByPlaceholderText("Enter custom buy-in"), "75");
    expect(setBuyInAmount).toHaveBeenCalledWith(75);

    fireEvent.changeText(getByPlaceholderText("Enter custom buy-in"), "-5");
    expect(setBuyInAmount).toHaveBeenCalledWith(25);

    fireEvent.changeText(getByPlaceholderText("Enter custom buy-in"), "abc");
    expect(setBuyInAmount).toHaveBeenCalledWith(25);
  });

  it("triggers state update every time a buy-in option is clicked, even if it's the same", () => {
    const { getByText } = renderComponent();

    fireEvent.press(getByText("$ 25"));
    fireEvent.press(getByText("$ 25"));
    expect(setBuyInAmount).toHaveBeenCalledTimes(2);
  });

  it("resets to default buy-in when custom input is cleared", () => {
    const { getByPlaceholderText } = renderComponent();
    const input = getByPlaceholderText("Enter custom buy-in");

    fireEvent.changeText(input, "75");
    expect(setBuyInAmount).toHaveBeenCalledWith(75);

    fireEvent.changeText(input, "");
    expect(setBuyInAmount).toHaveBeenCalledWith(25);
  });

  it("updates state correctly when selecting predefined buy-in after entering a custom amount", () => {
    const { getByPlaceholderText, getByText } = renderComponent();

    fireEvent.changeText(getByPlaceholderText("Enter custom buy-in"), "200");
    expect(setBuyInAmount).toHaveBeenCalledWith(200);

    fireEvent.press(getByText("$ 10"));
    expect(setBuyInAmount).toHaveBeenCalledWith(10);
  });

  it("displays selected currency correctly", () => {
    const { getByText, queryByText } = renderComponent("€");

    expect(getByText("€ 10")).toBeTruthy();
    expect(getByText("€ 25")).toBeTruthy();
    expect(getByText("€ 50")).toBeTruthy();
    expect(queryByText(/Selected Buy-in:.*None/i)).toBeTruthy();
  });
});
