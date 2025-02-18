import ChipDetection from "@/components/ChipDetection";
import { render } from "@testing-library/react-native";
import React from "react";

const totalChipsCount: number[] = [];
const mockSetTotalChipsCount = jest.fn();

const rend = render(
  <ChipDetection
    totalChipsCount={totalChipsCount}
    setTotalChipsCount={mockSetTotalChipsCount}
  />
);

describe("tests for ChipDetection", () => {
  it.todo("first test");
  it.todo("second test");
});
