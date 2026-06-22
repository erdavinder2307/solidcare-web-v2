import { describe, it, expect } from "vitest";
import { SITE, COMPANY, NAV } from "../site";

describe("SITE constants", () => {
    it("has a non-empty name", () => {
        expect(SITE.name).toBe("Solidcare");
    });

    it("domain is a valid https URL", () => {
        expect(SITE.domain).toMatch(/^https:\/\//);
    });

    it("description is a non-empty string", () => {
        expect(typeof SITE.description).toBe("string");
        expect(SITE.description.length).toBeGreaterThan(20);
    });
});

describe("COMPANY constants", () => {
    it("has a legal name", () => {
        expect(COMPANY.legalName).toBeTruthy();
    });

    it("email is a valid email address", () => {
        expect(COMPANY.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    it("whatsapp number is digits only", () => {
        expect(COMPANY.whatsapp).toMatch(/^\d+$/);
    });

    it("whatsappUrl contains the whatsapp number", () => {
        expect(COMPANY.whatsappUrl).toContain(COMPANY.whatsapp);
    });

    it("founded year is a realistic number", () => {
        expect(COMPANY.founded).toBeGreaterThan(2000);
        expect(COMPANY.founded).toBeLessThanOrEqual(new Date().getFullYear());
    });

    it("parentWebsite is a valid https URL", () => {
        expect(COMPANY.parentWebsite).toMatch(/^https:\/\//);
    });
});

describe("NAV constants", () => {
    it("all top-level nav items have a label and path", () => {
        const entries = [NAV.platform, NAV.features, NAV.pricing, NAV.about, NAV.contact, NAV.security];
        for (const entry of entries) {
            expect(entry.label).toBeTruthy();
            expect(entry.path).toMatch(/^\//);
        }
    });

    it("solutions array has 3 items each with label and path", () => {
        expect(NAV.solutions).toHaveLength(3);
        for (const s of NAV.solutions) {
            expect(s.label).toBeTruthy();
            expect(s.path).toMatch(/^\/solutions\//);
        }
    });

    it("no two nav paths are duplicates", () => {
        const paths = [
            NAV.platform.path,
            NAV.features.path,
            NAV.pricing.path,
            NAV.about.path,
            NAV.contact.path,
            NAV.security.path,
            ...NAV.solutions.map((s) => s.path),
        ];
        expect(new Set(paths).size).toBe(paths.length);
    });
});
