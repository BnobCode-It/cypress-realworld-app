import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import EmptyList from "../EmptyList";

describe("EmptyList", () => {
  it("should render empty list message", () => {
    render(<EmptyList entity="transactions" />);
    
    expect(screen.getByText(/no transactions/i)).toBeInTheDocument();
  });

  it("should render custom empty message", () => {
    render(<EmptyList entity="notifications" />);
    
    expect(screen.getByText(/no notifications/i)).toBeInTheDocument();
  });

  it("should render with custom data-test attribute", () => {
    render(<EmptyList entity="transactions" data-test="empty-transactions" />);
    
    expect(screen.getByTestId("empty-transactions")).toBeInTheDocument();
  });
});
