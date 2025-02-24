import React, { useState } from "react";
import {
  View,
  Button,
  Image,
  ActivityIndicator,
  Text,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const ChipDetection = ({ updateChipCount }) => {
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastDetectedChips, setLastDetectedChips] = useState({});

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

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      await processImage(result.assets[0].base64);
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) {
      setError("Camera permission is required to take a photo.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      await processImage(result.assets[0].base64);
    }
  };

  const processImage = async (base64Image) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
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
        }
      );

      const result = await response.json();

      if (!response.ok || !result.choices || !result.choices[0].message) {
        throw new Error("Invalid response from API.");
      }

      const rawContent = result.choices[0].message.content.trim();
      const cleanJSON = rawContent.replace(/```json|```/g, "").trim();

      const parsedData = JSON.parse(cleanJSON);

      const filteredData = Object.fromEntries(
        Object.entries(parsedData).filter(([_, count]) => count > 0)
      );

      setLastDetectedChips(filteredData);
      updateChipCount(filteredData);
    } catch (error) {
      setError("Failed to analyze the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20, alignItems: "center" }}>
      <Button title="Pick an Image" onPress={pickImage} />
      <Button title="Take a Photo" onPress={takePhoto} />
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ width: 300, height: 300, marginTop: 10 }}
        />
      )}
      {loading && <ActivityIndicator size="large" color="blue" />}
      {error && <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>}
    </ScrollView>
  );
};

export default ChipDetection;
