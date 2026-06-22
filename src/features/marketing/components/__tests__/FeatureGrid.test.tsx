import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { createAppTheme } from "@/lib/theme/theme";
import { FeatureGrid } from "../FeatureGrid";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const theme = createAppTheme();

function Wrapper({ children }: { children: React.ReactNode }) {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

const ITEMS = [
    { title: "Patient registry", description: "Manage patient profiles." },
    { title: "Appointments", description: "Schedule and manage appointments." },
    { title: "Billing", description: "Generate invoices." },
];

describe("FeatureGrid", () => {
    it("renders all provided items", () => {
        render(<FeatureGrid items={ITEMS} />, { wrapper: Wrapper });
        expect(screen.getByText("Patient registry")).toBeInTheDocument();
        expect(screen.getByText("Appointments")).toBeInTheDocument();
        expect(screen.getByText("Billing")).toBeInTheDocument();
    });

    it("renders the optional title", () => {
        render(<FeatureGrid title="All features" items={ITEMS} />, { wrapper: Wrapper });
        expect(screen.getByText("All features")).toBeInTheDocument();
    });

    it("renders the optional subtitle", () => {
        render(<FeatureGrid title="T" subtitle="Feature overview" items={ITEMS} />, { wrapper: Wrapper });
        expect(screen.getByText("Feature overview")).toBeInTheDocument();
    });

    it("renders item descriptions", () => {
        render(<FeatureGrid items={ITEMS} />, { wrapper: Wrapper });
        expect(screen.getByText("Manage patient profiles.")).toBeInTheDocument();
    });

    it("renders without title and subtitle", () => {
        render(<FeatureGrid items={ITEMS} />, { wrapper: Wrapper });
        // No heading elements beyond item titles
        const h4s = document.querySelectorAll("h4");
        expect(h4s).toHaveLength(0);
    });

    it("accepts icon prop without error", () => {
        const itemsWithIcon = [{ title: "Info", description: "Description", icon: InfoOutlinedIcon }];
        render(<FeatureGrid items={itemsWithIcon} />, { wrapper: Wrapper });
        expect(screen.getByText("Info")).toBeInTheDocument();
    });

    it("renders correct number of cards", () => {
        render(<FeatureGrid items={ITEMS} />, { wrapper: Wrapper });
        expect(screen.getAllByText(/registry|Appointments|Billing/)).toHaveLength(3);
    });
});
