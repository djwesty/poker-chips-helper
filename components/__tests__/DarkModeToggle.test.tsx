import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import DarkModeToggle from "@/components/DarkModeToggle";

describe("DarkModeToggle Component", () => {
  it("renders correctly with initial light mode", () => {
    const { getByText } = render(<DarkModeToggle darkMode={false} onToggle={() => {}} />);
    expect(getByText("Dark Mode is Disabled")).toBeTruthy();
  });

  it("renders correctly with initial dark mode", () => {
    const { getByText } = render(<DarkModeToggle darkMode={true} onToggle={() => {}} />);
    expect(getByText("Dark Mode is Enabled")).toBeTruthy();
  });

  it("toggles dark mode when button is pressed", () => {
    const mockToggle = jest.fn();
    const { getByText } = render(<DarkModeToggle darkMode={false} onToggle={mockToggle} />);

    const button = getByText("Toggle Dark Mode");
    fireEvent.press(button);

    expect(mockToggle).toHaveBeenCalledTimes(1);
  });
});