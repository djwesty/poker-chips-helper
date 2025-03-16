import React, { useState } from "react";
import { Image, ActivityIndicator, Text, View } from "react-native";
import Button from "@/containers/Button";
import * as ImagePicker from "expo-image-picker";
import i18n from "@/i18n/i18n";

const ChipDetection = ({
  updateChipCount,
  darkMode,
}: {
  updateChipCount: (chipData: Record<string, number>) => void;
  darkMode: boolean;
}) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastDetectedChips, setLastDetectedChips] = useState<
    Record<string, number>
  >({});

  const chipColors = ["white", "red", "green", "blue", "black"];

  const requestCameraPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    return cameraPermission.granted;
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      await processImage(result.assets[0].base64 as string);
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) {
      setError(i18n.t("camera_permission_required"));
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      await processImage(result.assets[0].base64 as string);
    }
  };

  const processImage = async (base64Image: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(process.env.EXPO_PUBLIC_API_URL as string, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.EXPO_PUBLIC_MODEL_NAME,
          messages: [
            {
              role: "system",
              content:
                "Identify and count poker chips by color. Return only the count for each color in JSON format.",
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "How many poker chips are there for each color? Return structured JSON.",
                },
                {
                  type: "image_url",
                  image_url: { url: `data:image/png;base64,${base64Image}` },
                },
              ],
            },
          ],
          max_tokens: 1000,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.choices || !result.choices[0].message) {
        throw new Error(i18n.t("invalid_response"));
      }

      const rawContent = result.choices[0].message.content.trim();
      const cleanJSON = rawContent.replace(/```json|```/g, "").trim();
      const parsedData: Record<string, number> = JSON.parse(cleanJSON);

      const filteredData = Object.entries(parsedData)
        .filter(([color]) => chipColors.includes(color))
        .sort(
          ([colorA], [colorB]) =>
            chipColors.indexOf(colorA) - chipColors.indexOf(colorB)
        )
        .reduce(
          (acc, [color, count]) => {
            acc[color] = count;
            return acc;
          },
          {} as Record<string, number>
        );

      setLastDetectedChips(filteredData);
      updateChipCount(filteredData);
    } catch (error) {
      setError(i18n.t("failed_to_analyze_image"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginBottom: 10,
        }}
      >
        <Button
          title={i18n.t("pick_an_image")}
          onPress={pickImage}
          darkMode={darkMode}
        />
        <Button
          title={i18n.t("take_a_photo")}
          onPress={takePhoto}
          darkMode={darkMode}
        />
      </View>

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ width: 300, height: 300, marginTop: 10 }}
        />
      )}

      {loading && <ActivityIndicator size="large" color="blue" />}

      {error && <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>}
    </View>
  );
};

export default ChipDetection;
