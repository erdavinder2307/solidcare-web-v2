import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { createAppTheme } from "@/lib/theme/theme";
import { WorkflowSection } from "../WorkflowSection";

const theme = createAppTheme();

function Wrapper({ children }: { children: React.ReactNode }) {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

describe("WorkflowSection", () => {
    it("renders the section heading", () => {
        render(<WorkflowSection />, { wrapper: Wrapper });
        expect(screen.getByText(/complete OPD patient journey/i)).toBeInTheDocument();
    });

    it("renders all four step titles", () => {
        render(<WorkflowSection />, { wrapper: Wrapper });
        expect(screen.getByText("Register patient")).toBeInTheDocument();
        expect(screen.getByText("Schedule & queue")).toBeInTheDocument();
        expect(screen.getByText("Consult & prescribe")).toBeInTheDocument();
        expect(screen.getByText("Bill & close")).toBeInTheDocument();
    });

    it("renders step numbers 01–04", () => {
        render(<WorkflowSection />, { wrapper: Wrapper });
        expect(screen.getByText("01")).toBeInTheDocument();
        expect(screen.getByText("02")).toBeInTheDocument();
        expect(screen.getByText("03")).toBeInTheDocument();
        expect(screen.getByText("04")).toBeInTheDocument();
    });

    it("mentions ICD-10 in the consult step bullets", () => {
        render(<WorkflowSection />, { wrapper: Wrapper });
        expect(screen.getByText(/ICD-10 diagnosis coding/i)).toBeInTheDocument();
    });

    it("mentions GST in the billing step bullets", () => {
        render(<WorkflowSection />, { wrapper: Wrapper });
        expect(screen.getByText(/GST-compliant invoicing/i)).toBeInTheDocument();
    });

    it("mentions drug-allergy alerts", () => {
        render(<WorkflowSection />, { wrapper: Wrapper });
        expect(screen.getByText(/drug-allergy interaction alerts/i)).toBeInTheDocument();
    });
});
