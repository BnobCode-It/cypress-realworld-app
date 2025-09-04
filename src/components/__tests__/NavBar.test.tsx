import { describe, it, expect, beforeEach, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NavBar from "../NavBar";

const MockedNavBar = ({ props }: any) => (
  <BrowserRouter>
    <NavBar {...props} />
  </BrowserRouter>
);

describe("NavBar", () => {
  const defaultProps = {
    isLoggedIn: true,
    notificationsCount: 0,
    toggleDrawer: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render navigation bar", () => {
    render(<MockedNavBar props={defaultProps} />);
    
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("should show notifications count when greater than 0", () => {
    const props = { ...defaultProps, notificationsCount: 5 };
    render(<MockedNavBar props={props} />);
    
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("should not show notifications count when 0", () => {
    render(<MockedNavBar props={defaultProps} />);
    
    expect(screen.queryByTestId("nav-top-notifications-count")).not.toBeInTheDocument();
  });

  it("should render logo", () => {
    render(<MockedNavBar props={defaultProps} />);
    
    expect(screen.getByTestId("sidenav-toggle")).toBeInTheDocument();
  });
});
