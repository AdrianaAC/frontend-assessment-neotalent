import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { describe, expect, it } from "vitest";
import App from "./App";
import { VehicleProvider } from "./context/VehicleContext";
import { GlobalStyle } from "./styles/GlobalStyle";
import { theme } from "./styles/theme";
import type { Vehicle } from "./types/vehicle";
import { buildVehicle } from "./test/vehicleTestUtils";

const appTestVehicles: Vehicle[] = [
  buildVehicle({
    id: "bmw-320d-2019-0",
    make: "BMW",
    model: "320d",
    year: 2019,
    mileage: 45000,
    startingBid: 12000,
    auctionDateTime: "2026-04-20T12:00:00",
    details: {
      specification: {
        vehicleType: "Saloon",
        colour: "Black",
        fuel: "Diesel",
        transmission: "Automatic",
        numberOfDoors: 4,
        co2Emissions: "120 g/km",
        noxEmissions: "0.03 g/km",
        numberOfKeys: 2,
      },
      ownership: {
        logbook: "Yes",
        numberOfOwners: 2,
        dateOfRegistration: "2019-06-15",
      },
      equipment: ["Air Conditioning", "Navigation", "Bluetooth"],
    },
  }),
];

function renderApp(initialEntry = "/") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <VehicleProvider initialVehicles={appTestVehicles} persistFavourites={false}>
          <App />
        </VehicleProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe("App routing", () => {
  it("renders a skip link that targets the main content", () => {
    renderApp("/");

    expect(
      screen.getByRole("link", { name: /skip to main content/i })
    ).toHaveAttribute("href", "#main-content");
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
  });

  it("navigates from the results page to the vehicle details page", async () => {
    const user = userEvent.setup();

    renderApp("/");

    await user.click(screen.getByRole("link", { name: /bmw 320d/i }));

    expect(
      screen.getByRole("heading", { level: 1, name: "BMW 320d" })
    ).toBeInTheDocument();
    expect(screen.getByText("Specification")).toBeInTheDocument();
    expect(screen.getByText("Ownership")).toBeInTheDocument();
    expect(screen.getByText("Equipment")).toBeInTheDocument();
    expect(screen.getByText("Navigation")).toBeInTheDocument();
  });

  it("keeps favourite state in sync when toggled on the details page", async () => {
    const user = userEvent.setup();

    renderApp("/vehicle/bmw-320d-2019-0");

    await user.click(
      screen.getByRole("button", { name: /add bmw 320d to favourites/i })
    );

    expect(screen.getByText("Saved")).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: /back to results/i }));

    expect(
      screen.getByRole("button", { name: /remove bmw 320d from favourites/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Favourite")).toBeInTheDocument();
  });

  it("shows a not-found state for an unknown vehicle route", () => {
    renderApp("/vehicle/does-not-exist");

    expect(screen.getByText("Vehicle not found.")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /back to results/i })
    ).toBeInTheDocument();
  });
});
