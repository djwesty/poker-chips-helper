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
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
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
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
      )
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders correctly", () => {
    const { getByText } = render(
      <ChipDetection updateChipCount={mockUpdateChipCount} />
    );

    expect(getByText(/pick an image/i)).toBeTruthy();
    expect(getByText(/take a photo/i)).toBeTruthy();
  });

  it("picks an image from the library", async () => {
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: "test-uri", base64: "test-base64" }],
    });

    const { getByText } = render(
      <ChipDetection updateChipCount={mockUpdateChipCount} />
    );
    fireEvent.press(getByText(/pick an image/i));

    await waitFor(() => expect(mockUpdateChipCount).toHaveBeenCalled());
  });

  it("takes a photo with the camera", async () => {
    (
      ImagePicker.requestCameraPermissionsAsync as jest.Mock
    ).mockResolvedValueOnce({
      granted: true,
    });
    (ImagePicker.launchCameraAsync as jest.Mock).mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: "test-camera-uri", base64: "test-camera-base64" }],
    });

    const { getByText } = render(
      <ChipDetection updateChipCount={mockUpdateChipCount} />
    );
    fireEvent.press(getByText(/take a photo/i));

    await waitFor(() =>
      expect(mockUpdateChipCount).toHaveBeenCalledWith({
        red: 5,
        green: 3,
        blue: 0,
      })
    );
  });

  it("handles camera permission denied", async () => {
    (
      ImagePicker.requestCameraPermissionsAsync as jest.Mock
    ).mockResolvedValueOnce({
      granted: false,
    });

    const { getByText } = render(
      <ChipDetection updateChipCount={mockUpdateChipCount} />
    );
    fireEvent.press(getByText(/take a photo/i));

    await waitFor(() =>
      expect(
        getByText(/camera permission is required to take a photo/i)
      ).toBeTruthy()
    );
  });

  it("displays error message on image processing failure", async () => {
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: "test-uri", base64: "test-base64" }],
    });

    jest.spyOn(global, "fetch").mockImplementationOnce(() =>
      Promise.resolve(
        new Response(JSON.stringify({ choices: [] }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        })
      )
    );

    const { getByText } = render(
      <ChipDetection updateChipCount={mockUpdateChipCount} />
    );
    fireEvent.press(getByText(/pick an image/i));

    await waitFor(() =>
      expect(getByText(/failed to analyze the image/i)).toBeTruthy()
    );
  });

  it("handles valid API response correctly", async () => {
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: "test-uri", base64: "test-base64" }],
    });

    jest.spyOn(global, "fetch").mockImplementationOnce(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            choices: [
              {
                message: {
                  content: JSON.stringify({ red: 5, green: 3, blue: 0 }),
                },
              },
            ],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
      )
    );

    const { getByText } = render(
      <ChipDetection updateChipCount={mockUpdateChipCount} />
    );
    fireEvent.press(getByText(/pick an image/i));

    await waitFor(() =>
      expect(mockUpdateChipCount).toHaveBeenCalledWith({
        red: 5,
        green: 3,
        blue: 0,
      })
    );
  });
});
