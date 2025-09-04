import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "../Footer";

describe("Footer", () => {
  it("should render footer content", () => {
    render(<Footer />);
    
    expect(screen.getByText(/cypress real world app/i)).toBeInTheDocument();
  });

  it("should have proper copyright text", () => {
    render(<Footer />);
    
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument();
  });

  it("should render with proper styling", () => {
    render(<Footer />);
    
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
  });
});
