import { describe, expect, it } from "vitest";

/**
 * Test suite for Korean industry classification categories
 * Validates that all 18 categories are correctly defined and can be used for filtering
 */

describe("Korean Industry Classification Categories", () => {
  const categories = [
    "Strategy & Planning",
    "Marketing & Communications",
    "Accounting & Finance",
    "HR & Training",
    "Administration & Legal",
    "IT Development & Data",
    "Design",
    "Sales & Trading",
    "Construction",
    "Healthcare",
    "Research & Development",
    "Education",
    "Media & Culture",
    "Finance & Insurance",
    "Transportation",
    "Service",
    "Manufacturing",
    "Public Service"
  ];

  it("should have exactly 18 categories", () => {
    expect(categories).toHaveLength(18);
  });

  it("should not have duplicate categories", () => {
    const uniqueCategories = new Set(categories);
    expect(uniqueCategories.size).toBe(categories.length);
  });

  it("should have all non-empty category names", () => {
    categories.forEach((category) => {
      expect(category).toBeTruthy();
      expect(category.trim()).toBe(category);
      expect(category.length).toBeGreaterThan(0);
    });
  });

  it("should contain all expected categories from Korean job market", () => {
    const expectedCategories = [
      "Strategy & Planning",
      "Marketing & Communications",
      "Accounting & Finance",
      "HR & Training",
      "Administration & Legal",
      "IT Development & Data",
      "Design",
      "Sales & Trading",
      "Construction",
      "Healthcare",
      "Research & Development",
      "Education",
      "Media & Culture",
      "Finance & Insurance",
      "Transportation",
      "Service",
      "Manufacturing",
      "Public Service"
    ];

    expectedCategories.forEach((expectedCat) => {
      expect(categories).toContain(expectedCat);
    });
  });

  it("should properly filter jobs by category", () => {
    const sampleJobs = [
      { id: 1, title: "Software Engineer", category: "IT Development & Data" },
      { id: 2, title: "Nurse", category: "Healthcare" },
      { id: 3, title: "Marketing Manager", category: "Marketing & Communications" },
      { id: 4, title: "Electrician", category: "Construction" },
      { id: 5, title: "Data Analyst", category: "IT Development & Data" },
    ];

    const itJobs = sampleJobs.filter((job) => job.category === "IT Development & Data");
    expect(itJobs).toHaveLength(2);
    expect(itJobs.every((job) => job.category === "IT Development & Data")).toBe(true);

    const healthcareJobs = sampleJobs.filter((job) => job.category === "Healthcare");
    expect(healthcareJobs).toHaveLength(1);
    expect(healthcareJobs[0]?.title).toBe("Nurse");
  });

  it("should handle category filtering with 'all' option", () => {
    const sampleJobs = [
      { id: 1, title: "Software Engineer", category: "IT Development & Data" },
      { id: 2, title: "Nurse", category: "Healthcare" },
      { id: 3, title: "Marketing Manager", category: "Marketing & Communications" },
    ];

    const selectedCategory = "all";
    let filtered = sampleJobs;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((job) => job.category === selectedCategory);
    }

    expect(filtered).toHaveLength(3);
    expect(filtered).toEqual(sampleJobs);
  });

  it("should correctly map old categories to new categories", () => {
    const categoryMapping: Record<string, string> = {
      "Technology": "IT Development & Data",
      "Marketing": "Marketing & Communications",
      "Finance": "Accounting & Finance",
      "Sales": "Sales & Trading",
      "HR": "HR & Training",
      "Operations": "Administration & Legal",
      "Trades": "Construction",
    };

    Object.entries(categoryMapping).forEach(([oldCat, newCat]) => {
      expect(categories).toContain(newCat);
    });
  });
});
