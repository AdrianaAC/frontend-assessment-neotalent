import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { describe, expect, it } from "vitest";
import { GlobalStyle } from "../styles/GlobalStyle";
import { theme } from "../styles/theme";
import ResultsPage from "../pages/ResultsPage";
import { buildVehicle } from "../test/vehicleTestUtils";
import {
  VehicleProvider,
  getFavouritesStorageKey,
} from "./VehicleContext";

const favouriteTestVehicles = [
  buildVehicle({
    id: "ford-fiesta-2020-10000-8000-2026-04-25t10-00-00",
    make: "Ford",
    model: "Fiesta",
    startingBid: 8000,
  }),
];

function renderResultsWithPersistence() {
  return render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <VehicleProvider
          initialVehicles={favouriteTestVehicles}
          persistFavourites
        >
          <ResultsPage />
        </VehicleProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe("VehicleContext persistence", () => {
  it("restores saved favourites from localStorage", async () => {
    const user = userEvent.setup();

    const firstRender = renderResultsWithPersistence();

    await user.click(
      screen.getByRole("button", { name: /add ford fiesta to favourites/i })
    );

    expect(
      JSON.parse(
        window.localStorage.getItem(getFavouritesStorageKey()) ?? "[]"
      )
    ).toEqual([favouriteTestVehicles[0].id]);

    firstRender.unmount();

    renderResultsWithPersistence();

    expect(
      screen.getByRole("button", { name: /remove ford fiesta from favourites/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/1 favourites saved on this device/i)).toBeInTheDocument();
  });
});
