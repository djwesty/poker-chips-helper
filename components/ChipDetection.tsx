import React, { useState } from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

/**
  The best way forward for this component is likely to send the image chosen to an AI + NLP API.
  Google cloud vision is likely a good choice, as I think it offers some sort of free tier or trial usage for free, as long as it can also support NLP prompts
  We need to thoughtfully prompt the API and ask it to return data in a well formatted JSON, or return an error if the image supplied is unable to be read, or otherwise out of context
  We could also ask it to return a "confidence" level as a percentage, if the user may find that helpful

  */

const ChipDetection = ({
  totalChipsCount,
  setTotalChipsCount,
}: {
  totalChipsCount: number[];
  setTotalChipsCount: React.Dispatch<React.SetStateAction<number[]>>;
}) => {
  const [image, setImage] = useState<any>(null);
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission denied!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View>
      <Text> Automatic Detection</Text>
      <MaterialIcons name="camera-alt" onPress={pickImage} size={30} />
    </View>
  );
};

export default ChipDetection;
