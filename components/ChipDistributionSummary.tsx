import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ColorValue } from "react-native";

interface ChipDistributionSummaryProps {
  playerCount: number;
  buyInAmount: number | null;
  totalChipsCount: number[];
  colors?: ColorValue[];
}

const MAX_CHIPS = 500;

const ChipDistributionSummary = ({
  playerCount,
  buyInAmount,
  totalChipsCount,
  colors = ["white", "red", "green", "blue", "black"],
}: ChipDistributionSummaryProps) => {
  const [chipDistribution, setChipDistribution] = useState<number[]>([]);

  useEffect(() => {
    if (buyInAmount !== null && playerCount > 0) {
      let totalChips = totalChipsCount.reduce((sum, count) => sum + count, 0);

      if (totalChips > MAX_CHIPS) {
        const scaleFactor = MAX_CHIPS / totalChips;
        totalChipsCount = totalChipsCount.map((count) =>
          Math.floor(count * scaleFactor)
        );
        totalChips = MAX_CHIPS;
      }
      const distribution = totalChipsCount.map((chipCount) =>
        Math.floor(chipCount / playerCount)
      );

      setChipDistribution(distribution);
    } else {
      setChipDistribution([]);
    }
  }, [buyInAmount, playerCount, totalChipsCount]);

  const hasValidDistribution = useMemo(
    () =>
      buyInAmount !== null && playerCount > 0 && chipDistribution.length > 0,
    [buyInAmount, playerCount, chipDistribution]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chip Distribution Summary:</Text>
      {hasValidDistribution ? (
        chipDistribution.map((count, index) => (
          <Text key={index} style={[styles.chipText, { color: colors[index] }]}>
            {`${colors[index]?.toString().toUpperCase()} Chips: ${count} per player`}
          </Text>
        ))
      ) : (
        <Text style={styles.noDataText}>
          No valid distribution calculated yet.
        </Text>
      )}
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
