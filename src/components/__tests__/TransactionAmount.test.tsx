import { describe, it, expect, beforeEach, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TransactionAmount from "../TransactionAmount";

describe("TransactionAmount", () => {
  const defaultProps = {
    transactionAmount: 5000,
    setTransactionAmount: vi.fn(),
    userBalance: 10000,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render transaction amount input", () => {
    render(<TransactionAmount {...defaultProps} />);
    
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
  });

  it("should display formatted amount", () => {
    render(<TransactionAmount {...defaultProps} />);
    
    const input = screen.getByDisplayValue("$50.00");
    expect(input).toBeInTheDocument();
  });

  it("should call setTransactionAmount when value changes", () => {
    render(<TransactionAmount {...defaultProps} />);
    
    const input = screen.getByLabelText(/amount/i);
    fireEvent.change(input, { target: { value: "75.00" } });
    
    expect(defaultProps.setTransactionAmount).toHaveBeenCalled();
  });

  it("should show error when amount exceeds balance", () => {
    const props = {
      ...defaultProps,
      transactionAmount: 15000,
    };
    
    render(<TransactionAmount {...props} />);
    
    expect(screen.getByText(/insufficient funds/i)).toBeInTheDocument();
  });

  it("should show error for invalid amount", () => {
    const props = {
      ...defaultProps,
      transactionAmount: 0,
    };
    
    render(<TransactionAmount {...props} />);
    
    expect(screen.getByText(/amount must be greater than/i)).toBeInTheDocument();
  });
});
