import React, { useEffect, useMemo, useState } from "react";
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
  // const [chipCountPerPlayer, setChipCountPerPlayer] = useState<
  //   Record<string, { count: number; value: number }>
  // >({});
  const validDenominations = [
    0.05, 0.1, 0.25, 0.5, 1, 2, 2.5, 5, 10, 20, 50, 100,
  ];

  // Re-organize the inputs in a map for convience
  const chipMap: Map<ColorValue, number> = useMemo(() => {
    const m: Map<ColorValue, number> = new Map<ColorValue, number>();
    totalChipsCount.map((v, i) => {
      m.set(colors[i], v);
    });
    return m;
  }, [playerCount, buyInAmount, totalChipsCount]);

  // Helper function to return the closest (but lower) valid denomination to the target
  const findFloorDenomination = (target: number) => {
    let current: number = validDenominations[0];
    validDenominations.forEach((value, index) => {
      if (value < target) current = value;
    });
    return current;
  };

  const maxDenomination = useMemo(() => {
    if (chipMap.size > 3) {
      return findFloorDenomination(buyInAmount / 2);
    } else {
      return findFloorDenomination(buyInAmount / 4);
    }
  }, [chipMap]);

  useEffect(() => {
    const testDistribution: Map<ColorValue, number> = new Map();
    const numColors = chipMap.size;
    testDistribution.set(colors[numColors - 1], maxDenomination);
    const maxDenominationIndex: number =
      validDenominations.indexOf(maxDenomination);
    console.log("test distribution", testDistribution);
  }, [chipMap, maxDenomination]);

  // useEffect(() => {
  //   if (
  //     buyInAmount !== null &&
  //     playerCount > 0 &&
  //     totalChipsCount.every((chips) => chips > 0)
  //   ) {
  //     const availableColors = Math.min(colors.length, 5);
  //     let selectedChips: number[] = [];
  //     let maxDenomination = buyInAmount / 2;

  //     // Select the denominations for available colors (up to 5 colors)
  //     for (let i = validDenominations.length - 1; i >= 0; i--) {
  //       if (
  //         validDenominations[i] <= maxDenomination &&
  //         selectedChips.length < availableColors
  //       ) {
  //         selectedChips.unshift(validDenominations[i]);
  //       }
  //     }

  //     // Ensure the selected chips are sorted from low to high denomination
  //     selectedChips = selectedChips.sort((a, b) => a - b);

  //     let distribution = new Array(selectedChips.length).fill(0);
  //     let remainingValue = buyInAmount;
  //     let remainingChips = [...totalChipsCount.slice(0, selectedChips.length)];

  //     // First pass: Distribute at least one chip of each selected denomination per player
  //     for (let i = 0; i < selectedChips.length; i++) {
  //       const chipValue = selectedChips[i];
  //       if (remainingValue >= chipValue && remainingChips[i] >= playerCount) {
  //         distribution[i] = 1;
  //         remainingValue -= chipValue;
  //         remainingChips[i] -= playerCount;
  //       }
  //     }

  //     // Second pass: Distribute remaining buy-in amount fairly across chip colors
  //     while (remainingValue > 0) {
  //       let allocatedInRound = false;

  //       for (let i = 0; i < selectedChips.length; i++) {
  //         if (remainingValue <= 0) break;
  //         const chipValue = selectedChips[i];

  //         if (remainingChips[i] >= playerCount && remainingValue >= chipValue) {
  //           distribution[i] += 1;
  //           remainingValue -= chipValue;
  //           remainingChips[i] -= playerCount;
  //           allocatedInRound = true;
  //         }
  //       }

  //       if (!allocatedInRound) break; // Prevent infinite loops
  //     }

  //     // Create a mapping from chip color names to chip counts and denominations
  //     let chipMap: Record<string, { count: number; value: number }> = {};
  //     for (let i = 0; i < selectedChips.length; i++) {
  //       if (distribution[i] > 0) {
  //         // Map denomination and color to chip count
  //         chipMap[colors[i]] = {
  //           count: distribution[i],
  //           value: selectedChips[i],
  //         };
  //       }
  //     }

  //     setChipCountPerPlayer(chipMap);
  //   } else {
  //     setChipCountPerPlayer({});
  //   }
  // }, [buyInAmount, playerCount, totalChipsCount, colors]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chip Distribution Summary:</Text>
      {/**Object.keys(chipCountPerPlayer).length > 0 ? (
        <View style={styles.chipContainer}>
          {Object.entries(chipCountPerPlayer).map(
            ([color, { count, value }]) => (
              <Text style={styles.chipText} key={color}>
                {color.charAt(0).toUpperCase() + color.slice(1)} chips: {count}{" "}
                ( ${value} each)
              </Text>
            )
          )}
        </View>
      ) : (
        <Text style={styles.noDataText}>
          No valid distribution calculated yet.
        </Text>
      )**/}
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
