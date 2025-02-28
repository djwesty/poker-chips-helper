import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import ChipDetection from "@/components/ChipDetection";
import * as ImagePicker from "expo-image-picker";

const mockUpdateChipCount = jest.fn();

jest.mock("expo-image-picker", () => ({
  requestCameraPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  MediaTypeOptions: {
    Images: "image",
  },
}));

describe("ChipDetection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    red: 5,
                    green: 3,
                    blue: 0,
                  }),
                },
              },
            ],
          }),
      })
    );
  });

  it("renders correctly", () => {
    const { getByText } = render(
      <ChipDetection updateChipCount={mockUpdateChipCount} />
    );
    expect(getByText("Pick an Image")).toBeTruthy();
    expect(getByText("Take a Photo")).toBeTruthy();
  });

  it("picks an image from the library", async () => {
    ImagePicker.launchImageLibraryAsync.mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: "test-uri", base64: "test-base64" }],
    });

    const { getByText } = render(
      <ChipDetection updateChipCount={mockUpdateChipCount} />
    );
    fireEvent.press(getByText("Pick an Image"));

    await waitFor(() => expect(mockUpdateChipCount).toHaveBeenCalled());
  });

  it("takes a photo with the camera", async () => {
    ImagePicker.requestCameraPermissionsAsync.mockResolvedValueOnce({
      granted: true,
    });
    ImagePicker.launchCameraAsync.mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: "test-camera-uri", base64: "test-camera-base64" }],
    });

    const { getByText } = render(
      <ChipDetection updateChipCount={mockUpdateChipCount} />
    );
    fireEvent.press(getByText("Take a Photo"));

    await waitFor(() =>
      expect(mockUpdateChipCount).toHaveBeenCalledWith({ red: 5, green: 3 })
    );
  });

  it("handles camera permission denied", async () => {
    ImagePicker.requestCameraPermissionsAsync.mockResolvedValueOnce({
      granted: false,
    });

    const { getByText } = render(
      <ChipDetection updateChipCount={mockUpdateChipCount} />
    );
    fireEvent.press(getByText("Take a Photo"));

    await waitFor(() =>
      expect(
        getByText("Camera permission is required to take a photo.")
      ).toBeTruthy()
    );
  });

  it("displays error message on image processing failure", async () => {
    ImagePicker.launchImageLibraryAsync.mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: "test-uri", base64: "test-base64" }],
    });

    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ choices: [] }),
      })
    );

    const { getByText } = render(
      <ChipDetection updateChipCount={mockUpdateChipCount} />
    );
    fireEvent.press(getByText("Pick an Image"));

    await waitFor(() =>
      expect(getByText("Failed to analyze the image.")).toBeTruthy()
    );
  });

  it("handles valid API response correctly", async () => {
    ImagePicker.launchImageLibraryAsync.mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: "test-uri", base64: "test-base64" }],
    });

    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [
              {
                message: {
                  content: JSON.stringify({ red: 5, green: 3 }),
                },
              },
            ],
          }),
      })
    );

    const { getByText } = render(
      <ChipDetection updateChipCount={mockUpdateChipCount} />
    );
    fireEvent.press(getByText("Pick an Image"));

    await waitFor(() =>
      expect(mockUpdateChipCount).toHaveBeenCalledWith({
        red: 5,
        green: 3,
      })
    );
  });
});
