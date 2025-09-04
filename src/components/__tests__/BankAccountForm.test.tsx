import { describe, it, expect, beforeEach, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BankAccountForm from "../BankAccountForm";

describe("BankAccountForm", () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    submitText: "Save",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render bank account form fields", () => {
    render(<BankAccountForm {...defaultProps} />);
    
    expect(screen.getByLabelText(/bank name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/routing number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/account number/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("should validate required fields", async () => {
    render(<BankAccountForm {...defaultProps} />);
    
    const submitButton = screen.getByRole("button", { name: "Save" });
    expect(submitButton).toBeDisabled();
    
    const bankNameInput = screen.getByTestId("bankaccount-bankName-input");
    const routingInput = screen.getByTestId("bankaccount-routingNumber-input");
    const accountInput = screen.getByTestId("bankaccount-accountNumber-input");
    
    fireEvent.change(bankNameInput, { target: { value: "Test Bank" } });
    fireEvent.change(routingInput, { target: { value: "123456789" } });
    fireEvent.change(accountInput, { target: { value: "987654321" } });
    
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it("should show validation errors", async () => {
    render(<BankAccountForm {...defaultProps} />);
    
    const routingInput = screen.getByTestId("bankaccount-routingNumber-input");
    const accountInput = screen.getByTestId("bankaccount-accountNumber-input");
    
    fireEvent.change(routingInput, { target: { value: "123" } });
    fireEvent.blur(routingInput);
    
    fireEvent.change(accountInput, { target: { value: "123" } });
    fireEvent.blur(accountInput);
    
    await waitFor(() => {
      expect(screen.getByText(/must contain a valid routing number/i)).toBeInTheDocument();
      expect(screen.getByText(/must contain a valid account number/i)).toBeInTheDocument();
    });
  });

  it("should submit form with valid data", async () => {
    render(<BankAccountForm {...defaultProps} />);
    
    const bankNameInput = screen.getByTestId("bankaccount-bankName-input");
    const routingInput = screen.getByTestId("bankaccount-routingNumber-input");
    const accountInput = screen.getByTestId("bankaccount-accountNumber-input");
    const submitButton = screen.getByTestId("bankaccount-submit");
    
    fireEvent.change(bankNameInput, { target: { value: "Test Bank" } });
    fireEvent.change(routingInput, { target: { value: "123456789" } });
    fireEvent.change(accountInput, { target: { value: "987654321" } });
    
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledWith({
        bankName: "Test Bank",
        routingNumber: "123456789",
        accountNumber: "987654321",
      });
    });
  });
});
