import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ColorValue } from "react-native";

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

  // Return the closest (but lower) valid denomination to the target
  const findFloorDenomination = (target: number): validDenomination => {
    let current: validDenomination = validDenominations[0];
    validDenominations.forEach((value, index) => {
      if (value < target) current = value;
    });
    return current;
  };

  // Bound for the value of the highest chip
  // This is somewhat arbitray, but 1/3 to 1/4 is reasonable depending on the number of colors.
  const maxDenomination = useMemo(() => {
    if (totalChipsCount.length > 3) {
      return findFloorDenomination(buyInAmount / 3);
    } else {
      return findFloorDenomination(buyInAmount / 4);
    }
  }, [totalChipsCount]);

  // Total value of the pot
  const potValue = useMemo(
    () => buyInAmount * playerCount,
    [buyInAmount, playerCount]
  );

  // The total value of all chips distributed to a single player. Ideally should be equal to buyInAmount
  const totalValue = useMemo(() => {
    let value = 0;
    for (let i = 0; i < totalChipsCount.length; i++) {
      value += distributions[i] * denominations[i];
    }
    return value;
  }, [distributions, denominations]);

  // Maximum quantity of each chip color which may be distributed to a single player before running out
  const maxPossibleDistribution = useMemo(
    () => totalChipsCount.map((v) => Math.floor(v / playerCount)),
    [totalChipsCount, playerCount]
  );

  // Redenominate the chips in case of failure to properly distribute.
  // Move the shuffle index to the next lowest denomination, and keep all else same
  const redenominate = useCallback(
    (
      invalidDenomination: validDenomination[],
      shuffleIndex: number
    ): validDenomination[] => {
      let moved = false;
      const newDenomination: validDenomination[] = [];
      for (let i = invalidDenomination.length - 1; i >= 0; i--) {
        if (i > shuffleIndex) {
          newDenomination.push(invalidDenomination[i]);
        } else if (i == shuffleIndex) {
          newDenomination.push(invalidDenomination[i]);
        } else if (i < shuffleIndex && !moved) {
          const nextLowestDenominationIndex = Math.max(
            validDenominations.indexOf(invalidDenomination[i]) - 1,
            0
          );
          newDenomination.push(validDenominations[nextLowestDenominationIndex]);
          moved = true;
        } else {
          newDenomination.push(invalidDenomination[i]);
        }
      }
      newDenomination.reverse();
      return newDenomination;
    },
    []
  );

  // Dynamically set denominations and distributions from changing inputs
  useEffect(() => {
    let testDenomination: validDenomination[] = [];

    const numColors = totalChipsCount.length;
    const testDistribution: number[] = [];
    for (let i = 0; i < numColors; ++i) {
      testDistribution.push(0);
    }

    // Start with max denominations, then push on the next adjacent lower denomination
    testDenomination.push(maxDenomination);
    let currentDenominationIndex: number =
      validDenominations.indexOf(maxDenomination);
    for (let i = numColors - 2; i >= 0; i = i - 1) {
      currentDenominationIndex -= 1;
      const currentDemoniation = validDenominations[currentDenominationIndex];
      testDenomination.push(currentDemoniation);
    }
    testDenomination.reverse();

    // Distribute the chips using the test denomination
    // If distribution fails to equal the buy-in, redenominate and re-try
    // Algorithm could be improved with more complexity and optimization
    let remainingValue = buyInAmount;
    let fail = true;
    let failCount = 0;
    while (fail && failCount < 1) {
      let stop = false;
      while (remainingValue > 0 && !stop) {
        let distributed = false;
        for (let i = numColors - 1; i >= 0; i = i - 1) {
          if (testDistribution[i] < maxPossibleDistribution[i]) {
            if (remainingValue >= testDenomination[i]) {
              testDistribution[i] = testDistribution[i] + 1;
              remainingValue = remainingValue - testDenomination[i];
              distributed = true;
            }
          }
        }
        if (distributed == false) {
          stop = true;
        }
      }
      if (remainingValue !== 0) {
        const redenominateIndex = failCount % numColors;
        testDenomination = redenominate(testDenomination, redenominateIndex);
        failCount += 1;
        fail = true;
      } else {
        fail = false;
      }
    }

    setDenominations(testDenomination);
    setDistributions(testDistribution);
  }, [totalChipsCount, maxDenomination, buyInAmount, playerCount]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Distribution & Denomination</Text>
      <Text style={styles.subTitle}>${potValue} Pot</Text>
      <View style={styles.chipContainer}>
        {totalChipsCount.map((_, index) => (
          <View style={styles.chipRow} key={index}>
            <Text
              style={{
                ...styles.chipText,
                color: colors[index],
                ...(colors[index] === "white" && styles.whiteShadow),
              }}
            >
              {distributions[index]} chips:
            </Text>
            <Text
              style={{
                ...styles.chipText,
                color: colors[index],
                ...(colors[index] === "white" && styles.whiteShadow),
              }}
            >
              ${denominations[index]} each
            </Text>
          </View>
        ))}
      </View>
      <Text style={styles.chipText}>Total Value:{totalValue}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    color: "gray",
    fontWeight: "bold",
    marginBottom: 10,
  },
  chipContainer: {
    marginTop: 10,
  },
  chipRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  chipText: {
    fontSize: 20,
    marginVertical: 2,
    fontWeight: "bold",
  },
  whiteShadow: {
    textShadowColor: "black",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  noDataText: {
    fontSize: 16,
    color: "gray",
  },
});

export default ChipDistributionSummary;
