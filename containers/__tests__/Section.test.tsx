import { render, screen } from "@testing-library/react-native";
import Section from "../Section";
import { Text } from "react-native";
import React from "react";

jest.mock("@expo/vector-icons", () => {
  const { Text } = require("react-native");
  return {
    MaterialIcons: () => <Text testID={"test-icon"}>TestIcon</Text>,
  };
});

const TITLE = "Select the weather";
const rend = () =>
  render(
    <Section title={TITLE} iconName={"test-icon"}>
      <Text>child</Text>
    </Section>
  );
describe("tests for the Section HOC Component", () => {
  it("everything expected appears", () => {
    rend();
    const title = screen.getByText(/select the weather/i);
    expect(title).toBeTruthy();

    const child = screen.getByText("child");
    expect(child).toBeTruthy();

    const icon = screen.getByTestId("test-icon");
    expect(icon).toBeTruthy();
  });
});
