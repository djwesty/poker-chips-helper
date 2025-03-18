import React from "react";
import { Alert } from "react-native";

import { fireEvent, render } from "@testing-library/react-native";
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

  test("renders warning message when needed", async () => {
    const { getByText } = render(
      <ChipDistributionSummary
        playerCount={6}
        buyInAmount={25}
        selectedCurrency={"$"}
        totalChipsCount={[100, 50]}
      />
    );
    const warning = getByText("TestIcon");
    expect(warning).toBeTruthy();

    jest.spyOn(Alert, "alert");
    fireEvent.press(warning);
    expect(Alert.alert).toHaveBeenCalledWith(
      "Warning",
      `Be advised that the value of the distributed chips does not equal the buy-in for these inputs.\n\nHowever, results shown are fair to all players`
    );
  });
});
