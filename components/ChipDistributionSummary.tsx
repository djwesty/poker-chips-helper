import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ColorValue } from "react-native";
import styles from "@/styles/styles";

interface ChipDistributionSummaryProps {
  playerCount: number;
  buyInAmount: number;
  totalChipsCount: number[];
  colors?: ColorValue[];
  selectedCurrency: string; // Add the selectedCurrency as a prop here
}

const ChipDistributionSummary = ({
  playerCount,
  buyInAmount,
  totalChipsCount,
  colors = ["white", "red", "green", "blue", "black"],
  selectedCurrency = "$",
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

  const findFloorDenomination = (target: number): validDenomination => {
    let current: validDenomination = validDenominations[0];
    validDenominations.forEach((value, index) => {
      if (value < target) current = value;
    });
    return current;
  };

  const maxDenomination = useMemo(() => {
    if (totalChipsCount.length > 3) {
      return findFloorDenomination(buyInAmount / 3);
    } else {
      return findFloorDenomination(buyInAmount / 4);
    }
  }, [totalChipsCount]);

  const potValue = useMemo(
    () => buyInAmount * playerCount,
    [buyInAmount, playerCount]
  );

  const totalValue = useMemo(() => {
    let value = 0;
    for (let i = 0; i < totalChipsCount.length; i++) {
      value += distributions[i] * denominations[i];
    }
    return value;
  }, [distributions, denominations]);

  const maxPossibleDistribution = useMemo(
    () => totalChipsCount.map((v) => Math.floor(v / playerCount)),
    [totalChipsCount, playerCount]
  );

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

  useEffect(() => {
    let testDenomination: validDenomination[] = [];
    const numColors = totalChipsCount.length;
    const testDistribution: number[] = [];
    for (let i = 0; i < numColors; ++i) {
      testDistribution.push(0);
    }

    testDenomination.push(maxDenomination);
    let currentDenominationIndex: number =
      validDenominations.indexOf(maxDenomination);
    for (let i = numColors - 2; i >= 0; i = i - 1) {
      currentDenominationIndex -= 1;
      const currentDemoniation = validDenominations[currentDenominationIndex];
      testDenomination.push(currentDemoniation);
    }
    testDenomination.reverse();

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
    <>
      <View style={styles.container}>
        {totalChipsCount.map((_, index) => (
          <View style={{ flexDirection: "row" }} key={index}>
            <Text
              style={{
                ...styles.h2,
                color: colors[index],
                ...(colors[index] === "white" && styles.shadow),
              }}
            >
              {`${distributions[index]} chips: ${selectedCurrency}${denominations[index]} each`}
            </Text>
          </View>
        ))}
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.p}>
          Total Value: {selectedCurrency} {totalValue}
        </Text>
        <Text style={styles.p}>
          {selectedCurrency} {potValue} Pot
        </Text>
      </View>
    </>
  );
};

export default ChipDistributionSummary;
