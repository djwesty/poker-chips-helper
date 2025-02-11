import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Button,
  ColorValue,
  Modal,
} from "react-native";
const colors: ColorValue[] = ["white", "red", "green", "blue", "black"];

const ChipInputModal = ({
  showModal,
  setShowModal,
  totalChipsCount,
  update,
}: {
  showModal: [boolean, ColorValue];
  setShowModal: React.Dispatch<React.SetStateAction<[boolean, ColorValue]>>;
  totalChipsCount: number[];
  update: Function;
}) => {
  const color: ColorValue = useMemo(() => showModal[1], [showModal]);
  const colorIdx = useMemo(() => colors.indexOf(color), [color]);

  const value: number = useMemo(
    () => totalChipsCount[colorIdx],
    [totalChipsCount, colorIdx]
  );

  return (
    <Modal
      visible={showModal[0]}
      onRequestClose={() => setShowModal([false, color])}
    >
      <Text>Number of {showModal[1]?.toString()} chips</Text>
      <TextInput
        style={{ color: showModal[1] }}
        keyboardType="numeric"
        value={value.toString()}
        onChangeText={(v) => {
          const n = parseInt(v);
          update(showModal[1], Number.isNaN(n) ? 0 : n);
        }}
      />
      <Button title="Accept" onPress={() => setShowModal([false, color])} />
    </Modal>
  );
};

const Chip = ({
  color,
  count,
  setShowModal,
}: {
  color: ColorValue;
  count: number;
  setShowModal: React.Dispatch<React.SetStateAction<[boolean, ColorValue]>>;
}) => {
  return (
    <Text
      key={color.toString()}
      onPress={() => setShowModal([true, color])}
      style={[{ color: color }, styles.chip]}
    >
      {count}
    </Text>
  );
};

const ChipsSelector = ({
  numberOfChips,
  totalChipsCount,
  setTotalChipsCount,
  setNumberOfChips,
}: {
  numberOfChips: number;
  totalChipsCount: number[];
  setTotalChipsCount: React.Dispatch<React.SetStateAction<number[]>>;
  setNumberOfChips: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [showModal, setShowModal] = useState<[boolean, ColorValue]>([
    false,
    colors[0],
  ]);
  const colorsUsed = useMemo(
    () => colors.filter((v, i) => i < numberOfChips),
    [numberOfChips]
  );

  const update = useCallback(
    (color: ColorValue, count: number) => {
      const newTotalChipsCount = totalChipsCount.slice();
      const colorIndex = colors.indexOf(color.toString());
      newTotalChipsCount[colorIndex] = count;
      setTotalChipsCount(newTotalChipsCount);
    },
    [numberOfChips, totalChipsCount, setTotalChipsCount]
  );
  useEffect(() => {
    if (numberOfChips !== totalChipsCount.length) {
      let newTotalChipsCount = totalChipsCount.slice();

      if (numberOfChips < totalChipsCount.length) {
        newTotalChipsCount = newTotalChipsCount.slice(0, numberOfChips);
      } else if (numberOfChips > totalChipsCount.length) {
        for (let colorIndex = 0; colorIndex < numberOfChips; ++colorIndex) {
          if (colorIndex >= newTotalChipsCount.length) {
            const defaultTotal = 100 - colorIndex * 20;
            newTotalChipsCount.push(defaultTotal);
          }
        }
      }
      setTotalChipsCount(newTotalChipsCount);
    }
  }, [numberOfChips]);

  return (
    <>
      <View style={styles.container}>
        {colorsUsed.map((color) => (
          <Chip
            key={color.toString()}
            color={color}
            count={totalChipsCount[colors.indexOf(color)] ?? 0}
            setShowModal={setShowModal}
          />
        ))}
      </View>

      <ChipInputModal
        showModal={showModal}
        setShowModal={setShowModal}
        totalChipsCount={totalChipsCount}
        update={update}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ddd",
  },
  chip: {
    // backgroundColor: "blue",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
export default ChipsSelector;
