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

  const redenominate = (
    invalidDenomination: validDenomination[],
    shuffleIndex: number
  ): validDenomination[] => {
    console.log("Old Denominations ", invalidDenomination);
    const newDenomination: validDenomination[] = [];
    for (let i = invalidDenomination.length - 1; i >= 0; i--) {
      if (i > shuffleIndex) {
        newDenomination.push(invalidDenomination[i]);
      } else if (i == shuffleIndex) {
        newDenomination.push(invalidDenomination[i]);
      } else {
        const nextLowestDenominationIndex = Math.max(
          validDenominations.indexOf(invalidDenomination[i]) - 1,
          0
        );
        newDenomination.push(validDenominations[nextLowestDenominationIndex]);
      }
    }
    newDenomination.reverse();
    console.log("New Denominations ", newDenomination);
    return newDenomination;
  };

  useEffect(() => {
    // const testDistribution: Map<ColorValue, number> = new Map();
    let testDenomination: validDenomination[] = [];

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

    // console.log("BUY IN: ", buyInAmount);
    // console.log("PLAYER COUNT ", playerCount);

    // DISTRIBUTE
    let remainingValue = buyInAmount;
    const remainingChips = [...maxPossibleDistribution];
    // console.log("\ntest Denomination", testDenomination);
    // console.log("test distribution ", testDistribution);
    // console.log("remainingChips", remainingChips);
    // console.log("remaining value ", remainingValue);

    //First distribute one of each chip to each player
    // for (let i = numColors - 1; i >= 0; i--) {
    //   testDistribution[i] = testDistribution[i] + 1;
    //   remainingChips[i] = remainingChips[i] - 1;
    //   remainingValue = remainingValue - testDenomination[i];
    // }
    // console.log("\ntest Denomination", testDenomination);
    // console.log("test distribution ", testDistribution);
    // console.log("remainingChips", remainingChips);
    // console.log("remaining value ", remainingValue);

    //Then, greedy approach to distribute remaining chips

    let fail = true;
    let failCount = 0;
    while (fail && failCount < 10) {
      let stop = false;
      while (remainingValue > 0 && !stop) {
        let distributed = false;
        for (let i = numColors - 1; i >= 0; i--) {
          if (remainingChips[i] > 0 && remainingValue > testDenomination[i]) {
            // console.log("distributing ", testDenomination[i]);
            testDistribution[i] = testDistribution[i] + 1;
            remainingChips[i] = remainingChips[i] - 1;
            remainingValue = remainingValue - testDenomination[i];
            distributed = true;
          }
        }
        if (distributed == false) {
          stop = true;
        }
      }
      if (remainingValue !== 0) {
        console.log(`\n Failed: ${remainingValue} !== 0 Redenominating  `);
        const redenominateIndex = numColors - (failCount % numColors);
        console.log("Redenominating index  ", redenominateIndex);
        testDenomination = redenominate(testDenomination, redenominateIndex);
        failCount += 1;
        fail = true;
      } else {
        fail = false;
      }
    }

    // console.log("\ntest Denomination", testDenomination);
    // console.log("test distribution ", testDistribution);
    // console.log("remainingChips", remainingChips);
    // console.log("remaining value ", remainingValue);

    setDenominations(testDenomination);
    setDistributions(testDistribution);
  }, [chipMap, maxDenomination, buyInAmount, playerCount]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chip Distribution Summary:</Text>
      {colors.map((color, index) => (
        <View style={styles.chipContainer} key={index}>
          <Text style={{ ...styles.chipText, color: color }}>
            {String(color).charAt(0).toUpperCase() + String(color).slice(1)}{" "}
            chips: {distributions[index]} ( ${denominations[index]} each)
          </Text>
        </View>
      ))}
      <Text style={styles.chipText}>
        Total Value:{" "}
        {distributions?.length > 0 &&
          distributions.reduce((p, c, i) => p + c * denominations[i])}
      </Text>
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
    backgroundColor: "#888",
  },
  chipText: {
    fontSize: 20,
    marginVertical: 2,
    fontWeight: "bold",
  },
  noDataText: {
    fontSize: 16,
    color: "gray",
  },
});

export default ChipDistributionSummary;
