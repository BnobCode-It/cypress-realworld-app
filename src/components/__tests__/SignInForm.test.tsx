import { describe, it, expect, beforeEach, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { interpret } from "xstate";
import SignInForm from "../SignInForm";
import { authMachine } from "../../machines/authMachine";

vi.mock("../../machines/authMachine", () => ({
  authMachine: {
    withContext: vi.fn().mockReturnThis(),
  },
}));

vi.mock("react-router-dom", () => ({
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

describe("SignInForm", () => {
  let authService: any;

  beforeEach(() => {
    authService = {
      state: {
        context: {},
        value: "unauthorized",
      },
      send: vi.fn(),
    };
  });

  it("should render sign in form", () => {
    render(<SignInForm authService={authService} />);
    
    expect(screen.getByText("Sign in")).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByText("Remember me")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
  });

  it("should display error message when present", () => {
    authService.state.context.message = "Invalid credentials";
    
    render(<SignInForm authService={authService} />);
    
    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    expect(screen.getByTestId("signin-error")).toBeInTheDocument();
  });

  it("should validate required fields", async () => {
    render(<SignInForm authService={authService} />);
    
    const submitButton = screen.getByRole("button", { name: "Sign In" });
    expect(submitButton).toBeDisabled();
    
    const usernameInput = screen.getByTestId("signin-username");
    const passwordInput = screen.getByTestId("signin-password");
    
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "test" } });
    
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it("should show validation errors for invalid input", async () => {
    render(<SignInForm authService={authService} />);
    
    const usernameInput = screen.getByTestId("signin-username");
    const passwordInput = screen.getByTestId("signin-password");
    
    fireEvent.change(usernameInput, { target: { value: "" } });
    fireEvent.blur(usernameInput);
    
    fireEvent.change(passwordInput, { target: { value: "123" } });
    fireEvent.blur(passwordInput);
    
    await waitFor(() => {
      expect(screen.getByText("Username is required")).toBeInTheDocument();
      expect(screen.getByText("Password must contain at least 4 characters")).toBeInTheDocument();
    });
  });

  it("should submit form with valid data", async () => {
    render(<SignInForm authService={authService} />);
    
    const usernameInput = screen.getByTestId("signin-username");
    const passwordInput = screen.getByTestId("signin-password");
    const rememberCheckbox = screen.getByTestId("signin-remember-me");
    const submitButton = screen.getByTestId("signin-submit");
    
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(rememberCheckbox);
    
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(authService.send).toHaveBeenCalledWith({
        type: "LOGIN",
        username: "testuser",
        password: "password123",
        remember: true,
      });
    });
  });

  it("should have link to sign up page", () => {
    render(<SignInForm authService={authService} />);
    
    const signUpLink = screen.getByTestId("signup");
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink).toHaveAttribute("href", "/signup");
    expect(signUpLink).toHaveTextContent("Don't have an account? Sign Up");
  });

  it("should disable submit button while submitting", async () => {
    render(<SignInForm authService={authService} />);
    
    const usernameInput = screen.getByTestId("signin-username");
    const passwordInput = screen.getByTestId("signin-password");
    const submitButton = screen.getByTestId("signin-submit");
    
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });
});
