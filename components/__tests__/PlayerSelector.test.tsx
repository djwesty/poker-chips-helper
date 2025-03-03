import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import PlayerSelector from "@/components/PlayerSelector";

describe("PlayerSelector Component", () => {
  it("renders the initial player count and buttons correctly", () => {
    const setPlayerCount = jest.fn();
    const { getByText, getByRole } = render(
      <PlayerSelector playerCount={4} setPlayerCount={setPlayerCount} />
    );

    expect(getByText("4")).toBeTruthy();
    expect(getByRole("button", { name: "-" })).toBeTruthy();
    expect(getByRole("button", { name: "+" })).toBeTruthy();
  });

  it('increases player count when "+" button is pressed', () => {
    const setPlayerCount = jest.fn();
    const { getByRole } = render(
      <PlayerSelector playerCount={4} setPlayerCount={setPlayerCount} />
    );

    fireEvent.press(getByRole("button", { name: "+" }));
    expect(setPlayerCount).toHaveBeenCalledWith(5);
  });

  it('decreases player count when "-" button is pressed', () => {
    const setPlayerCount = jest.fn();
    const { getByRole } = render(
      <PlayerSelector playerCount={4} setPlayerCount={setPlayerCount} />
    );

    fireEvent.press(getByRole("button", { name: "-" }));
    expect(setPlayerCount).toHaveBeenCalledWith(3);
  });

  it("does not increase player count beyond 8", () => {
    const setPlayerCount = jest.fn();
    const { getByRole } = render(
      <PlayerSelector playerCount={8} setPlayerCount={setPlayerCount} />
    );

    fireEvent.press(getByRole("button", { name: "+" }));
    expect(setPlayerCount).not.toHaveBeenCalled();
  });

  it("does not decrease player count below 2", () => {
    const setPlayerCount = jest.fn();
    const { getByRole } = render(
      <PlayerSelector playerCount={2} setPlayerCount={setPlayerCount} />
    );

    fireEvent.press(getByRole("button", { name: "-" }));
    expect(setPlayerCount).not.toHaveBeenCalled();
  });
});
