import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { describe, expect, it } from "vitest";
import { VehicleProvider } from "../context/VehicleContext";
import { GlobalStyle } from "../styles/GlobalStyle";
import { theme } from "../styles/theme";
import type { Vehicle } from "../types/vehicle";
import { buildVehicle } from "../test/vehicleTestUtils";
import ResultsPage from "./ResultsPage";

const testVehicles: Vehicle[] = [
  buildVehicle({ id: "1", make: "Ford", model: "Fiesta", startingBid: 8000 }),
  buildVehicle({ id: "2", make: "Ford", model: "Focus", startingBid: 11000 }),
  buildVehicle({
    id: "3",
    make: "Audi",
    model: "A3",
    startingBid: 9000,
    favourite: true,
  }),
  buildVehicle({ id: "4", make: "BMW", model: "320d", startingBid: 12000 }),
  buildVehicle({ id: "5", make: "Tesla", model: "Model 3", startingBid: 25000 }),
  buildVehicle({ id: "6", make: "Volvo", model: "XC40", startingBid: 17000 }),
  buildVehicle({ id: "7", make: "Renault", model: "Clio", startingBid: 7000 }),
  buildVehicle({ id: "8", make: "SEAT", model: "Ibiza", startingBid: 6500 }),
];

function LocationDisplay() {
  const location = useLocation();

  return <output data-testid="location-display">{location.search}</output>;
}

function renderResultsPage(initialEntry = "/") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <VehicleProvider initialVehicles={testVehicles} persistFavourites={false}>
          <ResultsPage />
          <LocationDisplay />
        </VehicleProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
}

function getVehicleTitles() {
  return screen
    .getAllByRole("heading", { level: 2 })
    .map((heading) => heading.textContent);
}

describe("ResultsPage", () => {
  it("filters vehicles by make and model text", async () => {
    const user = userEvent.setup();

    renderResultsPage();

    await user.selectOptions(screen.getByLabelText(/make filter/i), "Ford");
    await user.type(screen.getByLabelText(/model filter/i), "Fie");

    expect(screen.getByText("Showing 1 of 8 vehicles")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Ford Fiesta" })).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { level: 2, name: "Ford Focus" })
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("location-display")).toHaveTextContent(
      "make=Ford&model=Fie"
    );
  });

  it("sorts vehicles by starting bid in descending order", async () => {
    const user = userEvent.setup();

    renderResultsPage();

    await user.selectOptions(screen.getByLabelText(/sort field/i), "startingBid");
    await user.selectOptions(screen.getByLabelText(/sort direction/i), "desc");

    expect(getVehicleTitles()[0]).toBe("Tesla Model 3");
  });

  it("updates favourites and supports filtering to favourites only", async () => {
    const user = userEvent.setup();

    renderResultsPage();

    const bmwCard = screen
      .getByRole("heading", { level: 2, name: "BMW 320d" })
      .closest(".vehicle-card");

    expect(bmwCard).not.toBeNull();

    await user.click(
      within(bmwCard as HTMLElement).getByRole("button", {
        name: /add to favourites/i,
      })
    );

    expect(
      within(bmwCard as HTMLElement).getByRole("button", {
        name: /remove from favourites/i,
      })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("checkbox", { name: /favourites only/i }));

    expect(screen.getByText("Showing 2 of 8 vehicles")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Audi A3" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "BMW 320d" })).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { level: 2, name: "Ford Fiesta" })
    ).not.toBeInTheDocument();
  });

  it("paginates the results and lets the user change vehicles per page", async () => {
    const user = userEvent.setup();

    renderResultsPage();

    await user.selectOptions(screen.getByLabelText(/vehicles per page/i), "6");

    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
    expect(getVehicleTitles()).toHaveLength(6);
    expect(
      screen.queryByRole("heading", { level: 2, name: "SEAT Ibiza" })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /next/i }));

    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
    expect(getVehicleTitles()).toHaveLength(2);
    expect(screen.getByRole("heading", { level: 2, name: "Renault Clio" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "SEAT Ibiza" })).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { level: 2, name: "Ford Fiesta" })
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("location-display")).toHaveTextContent(
      "pageSize=6&page=2"
    );
  });

  it("hydrates filter, sort, and pagination state from the URL", () => {
    renderResultsPage(
      "/?make=Ford&sort=startingBid&direction=desc&pageSize=6&page=1"
    );

    expect(screen.getByLabelText(/make filter/i)).toHaveValue("Ford");
    expect(screen.getByLabelText(/sort field/i)).toHaveValue("startingBid");
    expect(screen.getByLabelText(/sort direction/i)).toHaveValue("desc");
    expect(screen.getByLabelText(/vehicles per page/i)).toHaveValue("6");
    expect(getVehicleTitles()[0]).toBe("Ford Focus");
    expect(screen.getByText("Showing 2 of 8 vehicles")).toBeInTheDocument();
  });

  it("shows an empty state for filter combinations with no matches", async () => {
    const user = userEvent.setup();

    renderResultsPage();

    await user.type(screen.getByLabelText(/minimum bid/i), "30000");

    expect(
      screen.getByText("No vehicles match the current filters.")
    ).toBeInTheDocument();
    expect(screen.getByText("Showing 0 of 8 vehicles")).toBeInTheDocument();
    expect(screen.getByText("No pages available")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
  });

  it("falls back safely when URL params are invalid", () => {
    renderResultsPage(
      "/?sort=not-a-real-sort&direction=sideways&pageSize=999&page=-4&favouritesOnly=maybe"
    );

    expect(screen.getByLabelText(/sort field/i)).toHaveValue("auctionDateTime");
    expect(screen.getByLabelText(/sort direction/i)).toHaveValue("asc");
    expect(screen.getByLabelText(/vehicles per page/i)).toHaveValue("12");
    expect(screen.getByRole("checkbox", { name: /favourites only/i })).not.toBeChecked();
    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
  });

  it("lets the user remove an active filter from the filter chips", async () => {
    const user = userEvent.setup();

    renderResultsPage("/?make=Ford&model=Focus");

    await user.click(screen.getByRole("button", { name: /model: focus/i }));

    expect(screen.getByLabelText(/model filter/i)).toHaveValue("");
    expect(screen.getByRole("heading", { level: 2, name: "Ford Fiesta" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Ford Focus" })).toBeInTheDocument();
  });
});
