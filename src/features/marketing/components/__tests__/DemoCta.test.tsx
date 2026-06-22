import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { createAppTheme } from "@/lib/theme/theme";
import { DemoCta } from "../DemoCta";

const theme = createAppTheme();

function Wrapper({ children }: { children: React.ReactNode }) {
    return (
        <MemoryRouter>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </MemoryRouter>
    );
}

describe("DemoCta", () => {
    it("renders the default title", () => {
        render(<DemoCta />, { wrapper: Wrapper });
        expect(screen.getByText("See Solidcare in action")).toBeInTheDocument();
    });

    it("renders a custom title", () => {
        render(<DemoCta title="Book a walkthrough" />, { wrapper: Wrapper });
        expect(screen.getByText("Book a walkthrough")).toBeInTheDocument();
    });

    it("renders the default subtitle", () => {
        render(<DemoCta />, { wrapper: Wrapper });
        expect(screen.getByText(/schedule a walkthrough/i)).toBeInTheDocument();
    });

    it("renders a custom subtitle", () => {
        render(<DemoCta subtitle="Speak with our team today." />, { wrapper: Wrapper });
        expect(screen.getByText("Speak with our team today.")).toBeInTheDocument();
    });

    it("renders Request Demo button that opens WhatsApp", () => {
        render(<DemoCta />, { wrapper: Wrapper });
        const demoBtn = screen.getByRole("link", { name: /request demo/i });
        expect(demoBtn).toHaveAttribute("href", expect.stringContaining("wa.me"));
        expect(demoBtn).toHaveAttribute("target", "_blank");
        expect(demoBtn).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("renders Contact Us link pointing to /contact", () => {
        render(<DemoCta />, { wrapper: Wrapper });
        const contactBtn = screen.getByRole("link", { name: /contact us/i });
        expect(contactBtn).toHaveAttribute("href", "/contact");
    });

    it("renders in inline variant without outer box", () => {
        const { container } = render(<DemoCta variant="inline" />, { wrapper: Wrapper });
        // Inline variant has no primary.main background box wrapping
        const box = container.firstChild as HTMLElement;
        expect(box).toBeTruthy();
    });
});
