import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text } from "react-native";
import { ColorValue } from "react-native";
import i18n from "@/i18n/i18n";
import styles from "@/styles/styles";

interface ChipDistributionSummaryProps {
  playerCount: number;
  buyInAmount: number;
  totalChipsCount: number[];
  colors?: ColorValue[];
  selectedCurrency: string;
}

const reverseFib: number[] = [8, 5, 3, 2, 1];

const ChipDistributionSummary = ({
  playerCount,
  buyInAmount,
  totalChipsCount,
  colors = ["white", "red", "green", "blue", "black"],
  selectedCurrency = "$",
}: ChipDistributionSummaryProps) => {
  const validDenominations: validDenomination[] = [
    0.05, 0.1, 0.25, 1, 5, 10, 20, 50, 100,
  ];
  const [denominations, setDenominations] = useState<validDenomination[]>([]);
  const [distributions, setDistributions] = useState<number[]>([]);

  type validDenomination =
    | 0.05
    | 0.1
    | 0.25
    | 0.5
    | 1
    | 2
    | 2.5
    | 5
    | 10
    | 20
    | 25
    | 50
    | 100;

  const findFloorDenomination = (target: number): validDenomination => {
    let current: validDenomination = validDenominations[0];
    validDenominations.forEach((value, _) => {
      if (value < target) current = value;
    });
    return current;
  };

  const round = useCallback((num: number) => Math.round(num * 100) / 100, []);

  // Bound for the value of the highest chip
  // This is somewhat arbitray and imperfect, but 1/3 to 1/5 is reasonable depending on the number of colors.
  // Could be possibly improved based on value of buy in amount
  const maxDenomination: validDenomination = useMemo(() => {
    let max: validDenomination;
    switch (totalChipsCount.length) {
      case 5:
      case 4:
        max = findFloorDenomination(buyInAmount / 3);
        break;
      case 3:
        max = findFloorDenomination(buyInAmount / 4);
        break;
      case 2:
      case 1:
      default:
        max = findFloorDenomination(buyInAmount / 5);
        break;
    }
    return max;
  }, [totalChipsCount, buyInAmount]);

  const potValue = useMemo(
    () => buyInAmount * playerCount,
    [buyInAmount, playerCount]
  );

  // The total value of all chips distributed to a single player. Ideally should be equal to buyInAmount
  const totalValue = useMemo(() => {
    let value = 0;
    for (let i = 0; i < distributions.length; i++) {
      value += distributions[i] * denominations[i];
    }
    return value;
  }, [distributions, denominations]);

  // Maximum quantity of each chip color which may be distributed to a single player before running out
  const maxPossibleDistribution = useMemo(
    () => totalChipsCount.map((v) => Math.floor(v / playerCount)),
    [totalChipsCount, playerCount]
  );

  // Dynamically set denominations and distributions from changing inputs
  useEffect(() => {
    let testDenomination: validDenomination[] = [];
    const totalNumColors = totalChipsCount.length;

    // Start with max denominations, then push on the next adjacent lower denomination
    testDenomination.push(maxDenomination);
    let currentDenominationIndex: number =
      validDenominations.indexOf(maxDenomination);
    for (
      let i = totalNumColors - 2;
      i >= 0 && currentDenominationIndex > 0;
      i = i - 1
    ) {
      currentDenominationIndex -= 1;
      const currentDemoniation = validDenominations[currentDenominationIndex];
      testDenomination.push(currentDemoniation);
    }
    testDenomination.reverse();
    let numColors = testDenomination.length;

    const testDistribution: number[] = [];
    for (let i = 0; i < numColors; ++i) {
      testDistribution.push(0);
    }

    // Distribute the chips using the test denomination with a reverse fibbonaci preference
    // Not optimal, nor correct under all inputs but works for most inputs
    // Algorithm could be improved with more complexity and optimization (re-tries, redenominating, etc.)
    let remainingValue = buyInAmount;
    let stop = false;
    while (remainingValue > 0 && !stop) {
      let distributed = false;
      for (let i = numColors - 1; i >= 0; i = i - 1) {
        for (
          let j = reverseFib[i];
          j > 0 &&
          remainingValue >= testDenomination[i] &&
          testDistribution[i] < maxPossibleDistribution[i];
          j = j - 1
        ) {
          testDistribution[i] = testDistribution[i] + 1;
          remainingValue = round(remainingValue - testDenomination[i]);
          distributed = true;
        }
      }
      if (distributed == false) {
        stop = true;
      }
    }
    setDenominations(testDenomination);
    setDistributions(testDistribution);
  }, [totalChipsCount, maxDenomination, buyInAmount, playerCount]);

  return (
    <>
      <View style={styles.container}>
        {distributions.map((distribution, index) => {
          return (
            distribution > 0 && (
              <View style={{ flexDirection: "row" }} key={index}>
                <Text
                  style={{
                    ...styles.h2,
                    fontWeight: "bold",
                    color: colors[index],
                    ...(colors[index] === "white" && styles.shadow),
                  }}
                >
                  {`${distribution} ${i18n.t("chips")}: ${selectedCurrency}${denominations[index]} ${i18n.t("each")}`}
                </Text>
              </View>
            )
          );
        })}
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.p}>
          {i18n.t("total_value")}: {selectedCurrency} {round(totalValue)}
        </Text>
        <Text style={styles.p}>
          {selectedCurrency} {potValue} {i18n.t("pot")}
        </Text>
      </View>
    </>
  );
};

export default ChipDistributionSummary;
