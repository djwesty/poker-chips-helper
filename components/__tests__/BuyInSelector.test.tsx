import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import BuyInSelector from "@/components/BuyInSelector";

jest.mock("@expo/vector-icons", () => {
  const { Text } = require("react-native");
  return {
    MaterialIcons: () => <Text>MaterialIcons</Text>,
  };
});

describe("BuyInSelector Component", () => {
  let setBuyInAmount;
  let getByText;
  let getByPlaceholderText;
  let queryByText;

  // Render the component with the necessary props
  const renderComponent = (selectedCurrency = "$") => {
    const result = render(
      <BuyInSelector
        setBuyInAmount={setBuyInAmount}
        selectedCurrency={selectedCurrency}
      />
    );
    getByText = result.getByText;
    getByPlaceholderText = result.getByPlaceholderText;
    queryByText = result.queryByText;
  };

  beforeEach(() => {
    setBuyInAmount = jest.fn();
    renderComponent();
  });

  it("renders the buy-in options and input correctly", () => {
    expect(getByText("$ 10")).toBeTruthy();
    expect(getByText("$ 25")).toBeTruthy();
    expect(getByText("$ 50")).toBeTruthy();
    expect(getByPlaceholderText("Enter custom buy-in")).toBeTruthy();

    // Check default selection with a more flexible approach
    expect(queryByText(/Selected Buy-in.*None/)).toBeTruthy();
  });

  it("sets a predefined buy-in amount correctly", () => {
    fireEvent.press(getByText("$ 25"));
    expect(setBuyInAmount).toHaveBeenCalledWith(25);
  });

  it("sets a custom buy-in amount correctly", () => {
    fireEvent.changeText(getByPlaceholderText("Enter custom buy-in"), "100");
    expect(setBuyInAmount).toHaveBeenCalledWith(100);
  });

  it("resets custom amount if invalid input is entered", () => {
    fireEvent.changeText(getByPlaceholderText("Enter custom buy-in"), "-10");
    expect(setBuyInAmount).toHaveBeenCalledWith(25);
    fireEvent.changeText(getByPlaceholderText("Enter custom buy-in"), "abc");
    expect(setBuyInAmount).toHaveBeenCalledWith(25);
  });

  it("clears the custom amount when selecting a predefined option", () => {
    fireEvent.changeText(getByPlaceholderText("Enter custom buy-in"), "100");
    fireEvent.press(getByText("$ 50"));
    expect(setBuyInAmount).toHaveBeenCalledWith(50);
  });

  it("handles valid and invalid input for custom amount correctly", () => {
    fireEvent.changeText(getByPlaceholderText("Enter custom buy-in"), "75");
    expect(setBuyInAmount).toHaveBeenCalledWith(75);

    fireEvent.changeText(getByPlaceholderText("Enter custom buy-in"), "-5");
    expect(setBuyInAmount).toHaveBeenCalledWith(25);

    fireEvent.changeText(getByPlaceholderText("Enter custom buy-in"), "abc");
    expect(setBuyInAmount).toHaveBeenCalledWith(25);
  });

  it("triggers state update every time a buy-in option is clicked, even if it's the same", () => {
    fireEvent.press(getByText("$ 25"));
    fireEvent.press(getByText("$ 25"));
    expect(setBuyInAmount).toHaveBeenCalledTimes(2);
  });

  it("resets to default buy-in when custom input is cleared", () => {
    const input = getByPlaceholderText("Enter custom buy-in");
    fireEvent.changeText(input, "75");
    expect(setBuyInAmount).toHaveBeenCalledWith(75);
    fireEvent.changeText(input, "");
    expect(setBuyInAmount).toHaveBeenCalledWith(25);
  });

  it("updates state correctly when selecting predefined buy-in after entering a custom amount", () => {
    fireEvent.changeText(getByPlaceholderText("Enter custom buy-in"), "200");
    expect(setBuyInAmount).toHaveBeenCalledWith(200);
    fireEvent.press(getByText("$ 10"));
    expect(setBuyInAmount).toHaveBeenCalledWith(10);
  });

  it("displays selected currency correctly", () => {
    renderComponent("€");
    expect(getByText("€ 10")).toBeTruthy();
    expect(getByText("€ 25")).toBeTruthy();
    expect(getByText("€ 50")).toBeTruthy();

    // Check default selection text with a flexible regex
    expect(queryByText(/Selected Buy-in.*None/)).toBeTruthy();
  });
});
