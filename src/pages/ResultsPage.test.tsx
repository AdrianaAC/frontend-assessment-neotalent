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
  return within(screen.getByRole("region", { name: /vehicle listing/i }))
    .getAllByRole("heading", { level: 3 })
    .filter((heading) => heading.closest(".vehicle-card"))
    .map((heading) => heading.textContent);
}

describe("ResultsPage", () => {
  it("filters vehicles by make and model text", async () => {
    const user = userEvent.setup();

    renderResultsPage();

    await user.selectOptions(screen.getByLabelText(/^make$/i), "Ford");
    await user.type(screen.getByLabelText(/^model$/i), "Fie");

    expect(screen.getByText("Showing 1 of 8 vehicles")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Ford Fiesta" })).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { level: 3, name: "Ford Focus" })
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("location-display")).toHaveTextContent(
      "make=Ford&model=Fie"
    );
  });

  it("sorts vehicles by starting bid in descending order", async () => {
    const user = userEvent.setup();

    renderResultsPage();

    await user.selectOptions(screen.getByLabelText(/sort by/i), "startingBid");
    await user.selectOptions(screen.getByLabelText(/direction/i), "desc");

    expect(getVehicleTitles()[0]).toBe("Tesla Model 3");
  });

  it("exposes the main results landmarks with section headings", () => {
    renderResultsPage();

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Vehicle Results" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Filters" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Sort Results" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Available Vehicles" })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "BMW 320d" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /filters/i })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /sort results/i })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /available vehicles/i })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /vehicle listing/i })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: /pagination/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /go to previous page/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /go to next page/i })).toBeInTheDocument();
  });

  it("updates favourites and supports filtering to favourites only", async () => {
    const user = userEvent.setup();

    renderResultsPage();

    const bmwCard = screen
      .getByRole("heading", { level: 3, name: "BMW 320d" })
      .closest(".vehicle-card");

    expect(bmwCard).not.toBeNull();

    await user.click(
      within(bmwCard as HTMLElement).getByRole("button", {
        name: /add bmw 320d to favourites/i,
      })
    );

    expect(
      within(bmwCard as HTMLElement).getByRole("button", {
        name: /remove bmw 320d from favourites/i,
      })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("checkbox", { name: /favourites only/i }));

    expect(screen.getByText("Showing 2 of 8 vehicles")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Audi A3" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "BMW 320d" })).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { level: 3, name: "Ford Fiesta" })
    ).not.toBeInTheDocument();
  });

  it("paginates the results and lets the user change vehicles per page", async () => {
    const user = userEvent.setup();

    renderResultsPage();

    await user.selectOptions(screen.getByLabelText(/vehicles per page/i), "6");

    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
    expect(getVehicleTitles()).toHaveLength(6);
    expect(
      screen.queryByRole("heading", { level: 3, name: "SEAT Ibiza" })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /next/i }));

    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
    expect(getVehicleTitles()).toHaveLength(2);
    expect(screen.getByRole("heading", { level: 3, name: "Renault Clio" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "SEAT Ibiza" })).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { level: 3, name: "Ford Fiesta" })
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("location-display")).toHaveTextContent(
      "pageSize=6&page=2"
    );
  });

  it("hydrates filter, sort, and pagination state from the URL", () => {
    renderResultsPage(
      "/?make=Ford&sort=startingBid&direction=desc&pageSize=6&page=1"
    );

    expect(screen.getByLabelText(/^make$/i)).toHaveValue("Ford");
    expect(screen.getByLabelText(/sort by/i)).toHaveValue("startingBid");
    expect(screen.getByLabelText(/direction/i)).toHaveValue("desc");
    expect(screen.getByLabelText(/vehicles per page/i)).toHaveValue("6");
    expect(getVehicleTitles()[0]).toBe("Ford Focus");
    expect(screen.getByText("Showing 2 of 8 vehicles")).toBeInTheDocument();
  });

  it("shows an empty state for filter combinations with no matches", async () => {
    const user = userEvent.setup();

    renderResultsPage();

    await user.type(screen.getByLabelText(/min bid/i), "30000");

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

    expect(screen.getByLabelText(/sort by/i)).toHaveValue("auctionDateTime");
    expect(screen.getByLabelText(/direction/i)).toHaveValue("asc");
    expect(screen.getByLabelText(/vehicles per page/i)).toHaveValue("12");
    expect(screen.getByRole("checkbox", { name: /favourites only/i })).not.toBeChecked();
    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
  });

  it("lets the user remove an active filter from the filter chips", async () => {
    const user = userEvent.setup();

    renderResultsPage("/?make=Ford&model=Focus");

    await user.click(
      screen.getByRole("button", { name: /clear model: focus filter/i })
    );

    expect(screen.getByLabelText(/^model$/i)).toHaveValue("");
    expect(screen.getByRole("heading", { level: 3, name: "Ford Fiesta" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Ford Focus" })).toBeInTheDocument();
  });

  it("keeps filters, clear chips, and vehicle links reachable with Tab", async () => {
    const user = userEvent.setup();

    renderResultsPage("/?make=Ford&model=Focus");

    await user.tab();
    expect(screen.getByLabelText(/^make$/i)).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText(/^model$/i)).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText(/min bid/i)).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText(/max bid/i)).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("checkbox", { name: /favourites only/i })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: /clear filters/i })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: /clear make: ford filter/i })).toHaveFocus();

    await user.tab();
    const modelChip = screen.getByRole("button", {
      name: /clear model: focus filter/i,
    });
    expect(modelChip).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText(/sort by/i)).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText(/direction/i)).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText(/vehicles per page/i)).toHaveFocus();

    await user.tab();
    expect(
      screen.getByRole("link", { name: /view details for ford focus/i })
    ).toHaveFocus();

    await user.tab();
    expect(
      screen.getByRole("button", { name: /add ford focus to favourites/i })
    ).toHaveFocus();

    modelChip.focus();
    await user.keyboard("{Enter}");

    expect(screen.getByLabelText(/^model$/i)).toHaveValue("");
  });

  it("keeps pagination controls reachable with Tab", async () => {
    const user = userEvent.setup();

    renderResultsPage("/?pageSize=6&page=2");

    for (let step = 0; step < 10; step += 1) {
      await user.tab();
    }

    expect(
      screen.getByRole("link", { name: /view details for renault clio/i })
    ).toHaveFocus();

    await user.tab();
    expect(
      screen.getByRole("button", { name: /add renault clio to favourites/i })
    ).toHaveFocus();

    await user.tab();
    expect(
      screen.getByRole("link", { name: /view details for seat ibiza/i })
    ).toHaveFocus();

    await user.tab();
    expect(
      screen.getByRole("button", { name: /add seat ibiza to favourites/i })
    ).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: /previous/i })).toHaveFocus();
  });
});
