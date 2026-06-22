import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { createAppTheme } from "@/lib/theme/theme";
import { SolidcareLogo } from "../SolidcareLogo";

const theme = createAppTheme();

function Wrapper({ children }: { children: React.ReactNode }) {
    return (
        <MemoryRouter>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </MemoryRouter>
    );
}

describe("SolidcareLogo", () => {
    it("renders the Solidcare name", () => {
        render(<SolidcareLogo />, { wrapper: Wrapper });
        expect(screen.getByText("Solidcare")).toBeInTheDocument();
    });

    it("renders the app icon image", () => {
        render(<SolidcareLogo />, { wrapper: Wrapper });
        const img = screen.getByRole("img", { name: /solidcare/i });
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute("src", "/appIcon.png");
    });

    it("links to the homepage", () => {
        render(<SolidcareLogo />, { wrapper: Wrapper });
        const link = screen.getByRole("link");
        expect(link).toHaveAttribute("href", "/");
    });

    it("renders in sm size without error", () => {
        render(<SolidcareLogo size="sm" />, { wrapper: Wrapper });
        expect(screen.getByText("Solidcare")).toBeInTheDocument();
    });
});
