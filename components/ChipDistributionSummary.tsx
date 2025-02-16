import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ColorValue } from "react-native";

interface ChipDistributionSummaryProps {
  playerCount: number;
  buyInAmount: number | null;
  totalChipsCount: number[];
  colors?: ColorValue[];
}

const ChipDistributionSummary = ({
  playerCount,
  buyInAmount,
  totalChipsCount,
  colors = ["white", "red", "green", "blue", "black"],
}: ChipDistributionSummaryProps) => {
  const [chipDistribution, setChipDistribution] = useState<number[]>([]);

  useEffect(() => {
    if (
      buyInAmount !== null &&
      playerCount > 0 &&
      totalChipsCount.every((chips) => chips > 0)
    ) {
      const chipValues = [0.05, 0.25, 1, 2.5, 5]; // Chip values: white, red, green, blue, black
      let distribution = [0, 0, 0, 0, 0]; // Number of chips per player for each color
      let remainingValue = buyInAmount;
      let remainingChips = [...totalChipsCount]; // Make a copy of the available chips

      console.log("Starting distribution with buy-in amount:", buyInAmount);
      console.log("Player count:", playerCount);
      console.log("Remaining value to distribute:", remainingValue);
      console.log("Available chips:", remainingChips);

      // Step 1: Distribute chips from highest to lowest denomination
      for (let i = chipValues.length - 1; i >= 0; i--) {
        const chipValue = chipValues[i];
        const availableChips = remainingChips[i];

        console.log(`Attempting to distribute ${chipValue} chips`);

        // Calculate how many chips we can distribute to each player
        const maxChipsPerPlayer = Math.min(
          Math.floor(remainingValue / chipValue), // Max chips based on remaining value
          Math.floor(availableChips / playerCount) // Max chips based on availability
        );

        console.log(
          `Max chips per player for ${chipValue} value: ${maxChipsPerPlayer}`
        );

        if (maxChipsPerPlayer > 0) {
          // Distribute the chips
          const chipsToDistribute = Math.min(
            maxChipsPerPlayer,
            Math.floor(remainingValue / chipValue)
          );
          distribution[i] = chipsToDistribute;

          remainingValue -= chipsToDistribute * chipValue; // Subtract the value of these chips
          remainingChips[i] -= chipsToDistribute * playerCount; // Update remaining chips

          console.log(
            `Distributed ${chipsToDistribute} chips of ${chipValue} value`
          );
        }

        if (remainingValue <= 0) break; // Stop once the required value is met
      }

      console.log("Remaining value after distribution:", remainingValue);
      console.log("Remaining chips:", remainingChips);

      // Step 2: Handle the remaining value with smaller denominations if necessary
      if (remainingValue > 0) {
        for (let i = 0; i < chipValues.length; i++) {
          const chipValue = chipValues[i];
          const availableChips = remainingChips[i];

          const maxChipsPerPlayer = Math.min(
            Math.floor(remainingValue / chipValue), // Max chips based on remaining value
            Math.floor(availableChips / playerCount) // Max chips based on availability
          );

          console.log(
            `Attempting to distribute ${chipValue} chips (remaining value: ${remainingValue})`
          );

          if (maxChipsPerPlayer > 0) {
            const chipsToDistribute = Math.min(
              maxChipsPerPlayer,
              Math.floor(remainingValue / chipValue)
            );
            distribution[i] += chipsToDistribute;

            remainingValue -= chipsToDistribute * chipValue; // Subtract the value of these chips
            remainingChips[i] -= chipsToDistribute * playerCount; // Update remaining chips

            console.log(
              `Distributed ${chipsToDistribute} chips of ${chipValue} value`
            );
          }

          if (remainingValue <= 0) break; // Stop if the remaining value is fulfilled
        }
      }

      console.log("Remaining value after distribution:", remainingValue);
      console.log("Final chip distribution:", distribution);

      // Step 3: Adjust distribution to ensure no player gets more chips than available
      distribution = distribution.map((chipCount, i) =>
        Math.min(chipCount, Math.floor(totalChipsCount[i] / playerCount))
      );

      // Step 4: Check if total value distributed per player matches the buy-in
      const totalDistributedValue = distribution.reduce(
        (total, chips, index) => total + chips * chipValues[index],
        0
      );

      console.log("Total distributed value:", totalDistributedValue);

      // If total distributed value doesn't match, reset distribution
      if (totalDistributedValue !== buyInAmount) {
        console.log("Mismatch in distributed value, resetting distribution.");
        distribution = [0, 0, 0, 0, 0];
      }

      setChipDistribution(distribution);
    } else {
      setChipDistribution([]);
    }
  }, [buyInAmount, playerCount, totalChipsCount]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chip Distribution Summary:</Text>
      {chipDistribution.length > 0 ? (
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
