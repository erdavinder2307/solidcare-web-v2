import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { createAppTheme } from "@/lib/theme/theme";
import { StatsBar } from "../StatsBar";

const theme = createAppTheme();

function Wrapper({ children }: { children: React.ReactNode }) {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

describe("StatsBar", () => {
    it("renders all four stat labels", () => {
        render(<StatsBar />, { wrapper: Wrapper });
        expect(screen.getByText(/integrated clinical modules/i)).toBeInTheDocument();
        expect(screen.getByText(/OPD workflow/i)).toBeInTheDocument();
        expect(screen.getByText(/data residency/i)).toBeInTheDocument();
        expect(screen.getByText(/ABDM-ready/i)).toBeInTheDocument();
    });

    it("renders the 12-module stat value", () => {
        render(<StatsBar />, { wrapper: Wrapper });
        expect(screen.getByText("12")).toBeInTheDocument();
    });

    it("renders the India data residency value", () => {
        render(<StatsBar />, { wrapper: Wrapper });
        expect(screen.getByText("India")).toBeInTheDocument();
    });

    it("renders the end-to-end value", () => {
        render(<StatsBar />, { wrapper: Wrapper });
        expect(screen.getByText("End-to-end")).toBeInTheDocument();
    });

    it("renders the ABDM-ready value", () => {
        render(<StatsBar />, { wrapper: Wrapper });
        expect(screen.getByText("ABDM-ready")).toBeInTheDocument();
    });
});
