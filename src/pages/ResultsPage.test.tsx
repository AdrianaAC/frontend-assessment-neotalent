import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { VehicleProvider } from "../context/VehicleContext";
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

function renderResultsPage() {
  return render(
    <MemoryRouter>
      <VehicleProvider initialVehicles={testVehicles}>
        <ResultsPage />
      </VehicleProvider>
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
  });
});
