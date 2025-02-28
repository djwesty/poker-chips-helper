import React from "react";
import { render } from "@testing-library/react-native";
import ChipDistributionSummary from "../ChipDistributionSummary";

describe("ChipDistributionSummary Component", () => {
  test("renders correctly with valid data", () => {
    const playerCount = 4;
    const totalChipsCount = [100, 80, 60, 40, 20];
    const colors = ["WHITE", "RED", "GREEN", "BLUE", "BLACK"];
    const buyInAmount = 20;

    const expectedDistribution = [2, 2, 1, 2, 2];
    const expectedDenominations = [0.5, 1, 2, 2.5, 5];

    const { getByText, getAllByText } = render(
      <ChipDistributionSummary
        playerCount={playerCount}
        buyInAmount={buyInAmount}
        totalChipsCount={totalChipsCount}
      />
    );

    expect(getByText("Distribution & Denomination")).toBeTruthy();

    expectedDistribution.forEach((count, index) => {
      // Ensure "X chips:" appears correctly
      expect(getAllByText(new RegExp(`^${count}\\s+chips:`, "i"))).toBeTruthy();

      // Ensure value format matches the rendered output
      expect(
        getByText(
          new RegExp(`^\\s*${expectedDenominations[index]}\\s+each$`, "i")
        )
      ).toBeTruthy();
    });
  });

  test.skip("renders fallback message when no valid distribution", () => {
    const { getByText } = render(
      <ChipDistributionSummary
        playerCount={0}
        buyInAmount={20}
        totalChipsCount={[]}
      />
    );
    expect(getByText("No valid distribution calculated yet.")).toBeTruthy();
  });

  test.skip("scales down chips if exceeding MAX_CHIPS", () => {
    const playerCount = 2;
    let totalChipsCount = [300, 400, 500, 600, 700];
    const MAX_CHIPS = 500;
    const totalChips = totalChipsCount.reduce((sum, count) => sum + count, 0);

    if (totalChips > MAX_CHIPS) {
      const scaleFactor = MAX_CHIPS / totalChips;
      totalChipsCount = totalChipsCount.map((count) =>
        Math.round(count * scaleFactor)
      );
    }

    const expectedDistribution = [30, 40, 50, 60, 70]; // Adjust as per actual component calculations

    const { getByText } = render(
      <ChipDistributionSummary
        playerCount={playerCount}
        buyInAmount={100}
        totalChipsCount={totalChipsCount}
      />
    );

    expect(getByText("Distribution & Denomination")).toBeTruthy();

    expectedDistribution.forEach((count, index) => {
      expect(getByText(new RegExp(`^${count}\\s+chips:`, "i"))).toBeTruthy();
    });
  });
});
