import React from "react";
import { render } from "@testing-library/react-native";
import ChipDistributionSummary from "../ChipDistributionSummary";

jest.mock("@expo/vector-icons", () => {
  const { Text } = require("react-native");
  return {
    MaterialIcons: () => <Text>TestIcon</Text>,
  };
});

describe("ChipDistributionSummary Component", () => {
  test("renders correctly with valid data", () => {
    const playerCount = 4;
    const totalChipsCount = [100, 80, 60, 40, 20];
    const buyInAmount = 20;
    const expectedDistribution = [16, 12, 8, 6, 2];
    const expectedDenominations = [0.05, 0.1, 0.25, 1, 5];

    const { getByText } = render(
      <ChipDistributionSummary
        playerCount={playerCount}
        buyInAmount={buyInAmount}
        totalChipsCount={totalChipsCount}
        selectedCurrency={"$"}
      />
    );

    expectedDistribution.forEach((count, index) => {
      const regex = new RegExp(
        `^${count}\\s+chips:\\s+\\$${expectedDenominations[index]}\\s+Each$`,
        "i"
      );
      expect(getByText(regex)).toBeTruthy();
    });
  });

  test.skip("renders fallback message when no valid distribution", () => {
    const { getByText } = render(
      <ChipDistributionSummary
        playerCount={0}
        buyInAmount={20}
        selectedCurrency={"$"}
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
        selectedCurrency={"$"}
      />
    );

    expect(getByText("Distribution & Denomination")).toBeTruthy();

    expectedDistribution.forEach((count) => {
      expect(getByText(new RegExp(`^${count}\\s+chips:`, "i"))).toBeTruthy();
    });
  });
});
