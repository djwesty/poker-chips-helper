import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
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

  const [value, setValue] = useState<number | undefined>(); // value may be undefined initially

  // Reset the color value when the specific color this modal is for, changes. The same modal is shared/reused in all cases.
  useEffect(() => {
    setValue(totalChipsCount[colorIdx]);
  }, [colorIdx]);

  return (
    <Modal
      visible={showModal[0]}
      onRequestClose={() => setShowModal([false, color])}
    >
      {value !== undefined && (
        <>
          <Text>Number of {showModal[1]?.toString()} chips</Text>
          <TextInput
            style={{ color: showModal[1] }}
            keyboardType="numeric"
            value={value.toString()}
            onChangeText={(v) => {
              const dirtyNum: number = parseInt(v);
              !isNaN(dirtyNum) ? setValue(dirtyNum) : setValue(0);
            }}
            testID="modalInput"
          />
        </>
      )}
      <Button
        title="Accept"
        onPress={() => {
          update(showModal[1], Number.isNaN(value) ? 0 : value);
          setShowModal([false, color]);
        }}
      />
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
  setNumberOfChips, // todo
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

  // Callback for ChipInputModal to update the chips in the parents state.
  const update = useCallback(
    (color: ColorValue, count: number) => {
      const newTotalChipsCount = totalChipsCount.slice();
      const colorIndex = colors.indexOf(color.toString());
      newTotalChipsCount[colorIndex] = count;
      setTotalChipsCount(newTotalChipsCount);
    },
    [numberOfChips, totalChipsCount, setTotalChipsCount]
  );

  // When the number of chips changes (dec or inc), update the array being careful to add in sensible default values where they belong
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
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
export default ChipsSelector;
