import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ColorValue } from "react-native";
// import { COLORS } from "@/app";

interface ChipDistributionSummaryProps {
  playerCount: number;
  buyInAmount: number;
  totalChipsCount: number[];
  colors?: ColorValue[];
}

const ChipDistributionSummary = ({
  playerCount,
  buyInAmount,
  totalChipsCount,
  colors = ["white", "red", "green", "blue", "black"],
}: ChipDistributionSummaryProps) => {
  const validDenominations: validDenomination[] = [
    0.05, 0.1, 0.25, 0.5, 1, 2, 2.5, 5, 10, 20, 50, 100,
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
    | 50
    | 100;

  // Re-organize the inputs in a map for convience
  const chipMap: Map<ColorValue, number> = useMemo(() => {
    const m: Map<ColorValue, number> = new Map<ColorValue, number>();
    totalChipsCount.map((v, i) => {
      m.set(colors[i], v);
    });
    return m;
  }, [playerCount, buyInAmount, totalChipsCount]);

  // Helper function to return the closest (but lower) valid denomination to the target
  const findFloorDenomination = (target: number): validDenomination => {
    let current: validDenomination = validDenominations[0];
    validDenominations.forEach((value, index) => {
      if (value < target) current = value;
    });
    return current;
  };

  // Bound for the value of the highest chip
  const maxDenomination = useMemo(() => {
    if (chipMap.size > 3) {
      return findFloorDenomination(buyInAmount / 3);
    } else {
      return findFloorDenomination(buyInAmount / 4);
    }
  }, [chipMap]);

  // Total value of the pot
  const totalValue = useMemo(
    () => buyInAmount * playerCount,
    [buyInAmount, playerCount]
  );

  // Maximum quantity of each chip which may be distributed to a single player before running out
  const maxPossibleDistribution = useMemo(
    () => totalChipsCount.map((v) => Math.floor(v / playerCount)),
    [totalChipsCount, playerCount]
  );

  function denominate(min: number, max: number, count: number = 4): number[] {
    if (max - min + 1 < count) {
      throw new Error(
        "Range is too small to generate the required number of unique values."
      );
    }

    const numbers = new Set<number>();

    while (numbers.size < count) {
      const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
      numbers.add(randomNum);
    }

    // const denominations

    return Array.from(numbers);
  }

  useEffect(() => {
    // const testDistribution: Map<ColorValue, number> = new Map();
    const testDenomination: validDenomination[] = [];

    const numColors = chipMap.size;
    const testDistribution: number[] = [];
    for (let i = 0; i < numColors; ++i) {
      testDistribution.push(0);
    }

    let numColorsRemaining = numColors;
    // testDistribution.set(colors[numColors - 1], maxDenomination);
    testDenomination.push(maxDenomination);
    numColorsRemaining -= 1;
    let currentDenominationIndex: number =
      validDenominations.indexOf(maxDenomination);
    while (numColorsRemaining > 0) {
      numColorsRemaining -= 1;
      currentDenominationIndex -= 1;
      const currentDemoniation = validDenominations[currentDenominationIndex];
      testDenomination.push(currentDemoniation);
    }
    testDenomination.reverse();

    console.log("BUY IN: ", buyInAmount);
    console.log("PLAYER COUNT ", playerCount);

    // DISTRIBUTE
    let remainingValue = buyInAmount;
    const remainingChips = [...maxPossibleDistribution];
    console.log("\ntest Denomination", testDenomination);
    console.log("test distribution ", testDistribution);
    console.log("remainingChips", remainingChips);
    console.log("remaining value ", remainingValue);

    //First distribute one of each chip to each player
    for (let i = numColors - 1; i >= 0; i--) {
      testDistribution[i] = testDistribution[i] + 1;
      remainingChips[i] = remainingChips[i] - 1;
      remainingValue = remainingValue - testDenomination[i];
    }
    console.log("\ntest Denomination", testDenomination);
    console.log("test distribution ", testDistribution);
    console.log("remainingChips", remainingChips);
    console.log("remaining value ", remainingValue);

    //Then, greedy approach to distribute remaining chips

    // while (remainingValue > 0) {
    //   for (let i = numColors - 1; i >= 0; i--) {
    //     if (remainingChips[i] > 0 && remainingValue > testDenomination[i]) {
    //       testDistribution[i] = testDistribution[i] + 1;
    //       remainingChips[i] = remainingChips[i] - 1;
    //       remainingValue = remainingValue - testDenomination[i];
    //     }
    //     remainingValue = 0;
    //   }
    // }
    console.log("\ntest Denomination", testDenomination);
    console.log("test distribution ", testDistribution);
    console.log("remainingChips", remainingChips);
    console.log("remaining value ", remainingValue);
    setDenominations(testDenomination);
    setDistributions(testDistribution);
  }, [chipMap, maxDenomination, buyInAmount, playerCount]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chip Distribution Summary:</Text>
      {colors.map((color, index) => (
        <View style={styles.chipContainer} key={index}>
          <Text style={styles.chipText}>
            {String(color).charAt(0).toUpperCase() + String(color).slice(1)}{" "}
            chips: {distributions[index]} ( ${denominations[index]} each)
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  chipContainer: {
    marginTop: 10,
  },
  chipText: {
    fontSize: 16,
    marginVertical: 2,
  },
  noDataText: {
    fontSize: 16,
    color: "gray",
  },
});

export default ChipDistributionSummary;
