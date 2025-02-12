import React from "react";
import { render } from "@testing-library/react-native";
import ChipDistributionSummary from "../ChipDistributionSummary";

describe("ChipDistributionSummary Component", () => {
  test("renders correctly with valid data", () => {
    const playerCount = 4;
    const totalChipsCount = [100, 200, 300, 400, 500];
    const colors = ["WHITE", "RED", "GREEN", "BLUE", "BLACK"];

    const expectedDistribution = [8, 16, 25, 33, 41];

    const { getByText } = render(
      <ChipDistributionSummary
        playerCount={playerCount}
        buyInAmount={100}
        totalChipsCount={totalChipsCount}
      />
    );

    expect(getByText("Chip Distribution Summary:")).toBeTruthy();

    expectedDistribution.forEach((count, index) => {
      expect(getByText(new RegExp(`${colors[index]} Chips: ${count} per player`, "i"))).toBeTruthy();
    });
  });

  test("renders fallback message when no valid distribution", () => {
    const { getByText } = render(
      <ChipDistributionSummary playerCount={0} buyInAmount={null} totalChipsCount={[]} />
    );
    expect(getByText("No valid distribution calculated yet.")).toBeTruthy();
  });

  test("scales down chips if exceeding MAX_CHIPS", () => {
    const playerCount = 2;
    let totalChipsCount = [300, 400, 500, 600, 700];
    const MAX_CHIPS = 500;
    const totalChips = totalChipsCount.reduce((sum, count) => sum + count, 0);

    if (totalChips > MAX_CHIPS) {
      const scaleFactor = MAX_CHIPS / totalChips;
      totalChipsCount = totalChipsCount.map(count => Math.round(count * scaleFactor));
    }

    const expectedDistribution = [30, 40, 50, 60, 70]; 
    const colors = ["WHITE", "RED", "GREEN", "BLUE", "BLACK"];

    const { getByText } = render(
      <ChipDistributionSummary
        playerCount={playerCount}
        buyInAmount={100}
        totalChipsCount={totalChipsCount}
      />
    );

    expect(getByText("Chip Distribution Summary:")).toBeTruthy();

    expectedDistribution.forEach((count, index) => {
      expect(getByText(new RegExp(`${colors[index]} Chips: ${count} per player`, "i"))).toBeTruthy();
    });
  });
});

