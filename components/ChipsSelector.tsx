import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ColorValue,
  Modal,
  TouchableOpacity,
} from "react-native";
import Button from "@/containers/Button";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "@/styles/styles";
import i18n from "@/i18n/i18n";

const colors: ColorValue[] = ["white", "red", "green", "blue", "black"];
const defaults = [100, 50, 50, 50, 50];

const ChipInputModal = ({
  showModal,
  setShowModal,
  totalChipsCount,
  update,
  darkMode,
}: {
  showModal: [boolean, ColorValue];
  setShowModal: React.Dispatch<React.SetStateAction<[boolean, ColorValue]>>;
  totalChipsCount: number[];
  update: Function;
  darkMode: boolean;
}) => {
  const color: ColorValue = useMemo(() => showModal[1], [showModal]);
  const colorIdx = useMemo(() => colors.indexOf(color), [color]);

  const [value, setValue] = useState<number | undefined>();

  useEffect(() => {
    setValue(totalChipsCount[colorIdx]);
  }, [colorIdx, totalChipsCount]);

  const shadow = useMemo(() => color === "white", [color]);

  return (
    <Modal
      visible={showModal[0]}
      onRequestClose={() => setShowModal([false, color])}
      style={styles.modal}
      presentationStyle="fullScreen"
      animationType="slide"
    >
      {value !== undefined && (
        <>
          <Text style={styles.h2}>
            {i18n.t("number_of_chips", {
              color: showModal[1]?.toString(),
            })}{" "}
          </Text>
          <TextInput
            style={{
              ...styles.input,
              color: showModal[1],
              ...(shadow ? styles.shadow : {}),
            }}
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
        title={i18n.t("accept")}
        onPress={() => {
          update(showModal[1], Number.isNaN(value) ? 0 : value);
          setShowModal([false, color]);
        }}
        darkMode={darkMode}
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
  const shadow = useMemo(() => color === "white", [color]);
  return (
    <TouchableOpacity
      onPress={() => setShowModal([true, color])}
      style={{ alignItems: "center" }}
    >
      <MaterialCommunityIcons
        name="poker-chip"
        size={24}
        color={color}
        style={shadow ? styles.shadow : {}}
      />
      <Text
        key={color.toString()}
        style={[{ color: color }, styles.h2, shadow ? styles.shadow : {}]}
      >
        {count}
      </Text>
    </TouchableOpacity>
  );
};

const ChipsSelector = ({
  numberOfChips,
  totalChipsCount,
  setTotalChipsCount,
  setNumberOfChips,
  darkMode,
}: {
  numberOfChips: number;
  totalChipsCount: number[];
  setTotalChipsCount: React.Dispatch<React.SetStateAction<number[]>>;
  setNumberOfChips: React.Dispatch<React.SetStateAction<number>>;
  darkMode: boolean;
}) => {
  const [showModal, setShowModal] = useState<[boolean, ColorValue]>([
    false,
    colors[0],
  ]);

  const colorsUsed = useMemo(
    () => colors.slice(0, numberOfChips),
    [numberOfChips]
  );

  const update = useCallback(
    (color: ColorValue, count: number) => {
      const newTotalChipsCount = totalChipsCount.slice();
      const colorIndex = colors.indexOf(color.toString());
      newTotalChipsCount[colorIndex] = count;
      setTotalChipsCount(newTotalChipsCount);
    },
    [totalChipsCount, setTotalChipsCount]
  );

  useEffect(() => {
    if (numberOfChips !== totalChipsCount.length) {
      let newTotalChipsCount = totalChipsCount.slice();
      if (numberOfChips < totalChipsCount.length) {
        newTotalChipsCount = newTotalChipsCount.slice(0, numberOfChips);
      } else if (numberOfChips > totalChipsCount.length) {
        for (let colorIndex = 0; colorIndex < numberOfChips; ++colorIndex) {
          if (colorIndex >= newTotalChipsCount.length) {
            const defaultTotal = defaults[colorIndex];
            newTotalChipsCount.push(defaultTotal);
          }
        }
      }
      setTotalChipsCount(newTotalChipsCount);
    }
  }, [numberOfChips]);

  return (
    <>
      <Button
        title="-"
        onPress={() => {
          setNumberOfChips(Math.max(1, numberOfChips - 1));
        }}
        disabled={numberOfChips === 1}
        darkMode={darkMode}
      />
      <View style={[styles.container, { flexDirection: "row" }]}>
        {colorsUsed.map((color) => {
          const chipCount = totalChipsCount[colors.indexOf(color)] ?? 0;
          return (
            <Chip
              key={color.toString()}
              color={color}
              count={chipCount}
              setShowModal={setShowModal}
            />
          );
        })}
      </View>
      <Button
        title="+"
        onPress={() => {
          setNumberOfChips(Math.min(5, numberOfChips + 1));
        }}
        disabled={numberOfChips === 5}
        darkMode={darkMode}
      />

      <ChipInputModal
        showModal={showModal}
        setShowModal={setShowModal}
        totalChipsCount={totalChipsCount}
        update={update}
        darkMode={darkMode}
      />
    </>
  );
};

export default ChipsSelector;
