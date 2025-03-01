import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import CurrencySelector from "@/components/CurrencySelector";

describe("CurrencySelector Component", () => {
  const mockSetSelectedCurrency = jest.fn();

  test("renders CurrencySelector component correctly", () => {
    const { getByText, getByTestId } = render(
      <CurrencySelector
        selectedCurrency="$"
        setSelectedCurrency={mockSetSelectedCurrency}
      />
    );

    expect(getByText("Select Currency:")).toBeTruthy(); // Check label exists
    expect(getByTestId("currency-picker")).toBeTruthy(); // Check Picker exists
  });

  test("calls setSelectedCurrency when a new currency is selected", () => {
    const { getByTestId } = render(
      <CurrencySelector
        selectedCurrency="$"
        setSelectedCurrency={mockSetSelectedCurrency}
      />
    );

    const picker = getByTestId("currency-picker"); // Get Picker

    fireEvent(picker, "onValueChange", "€"); // Simulate selecting Euro (€)

    expect(mockSetSelectedCurrency).toHaveBeenCalledWith("€");
  });

  test("updates selected currency when Picker value changes", () => {
    const { getByTestId } = render(
      <CurrencySelector
        selectedCurrency="€"
        setSelectedCurrency={mockSetSelectedCurrency}
      />
    );

    const picker = getByTestId("currency-picker");

    fireEvent(picker, "onValueChange", "$"); // Simulate selecting USD ($)

    expect(mockSetSelectedCurrency).toHaveBeenCalledWith("$");
  });
});
