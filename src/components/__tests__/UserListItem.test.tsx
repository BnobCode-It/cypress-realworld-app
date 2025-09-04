import { describe, it, expect, beforeEach, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import UserListItem from "../UserListItem";

describe("UserListItem", () => {
  const mockUser = {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
    email: "john@example.com",
    avatar: "avatar-url",
    balance: 10000,
    defaultPrivacyLevel: "public" as const,
    createdAt: new Date(),
    modifiedAt: new Date(),
  };

  const defaultProps = {
    user: mockUser,
    setReceiver: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render user information", () => {
    render(<UserListItem {...defaultProps} />);
    
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("@johndoe")).toBeInTheDocument();
  });

  it("should call setReceiver when clicked", () => {
    render(<UserListItem {...defaultProps} />);
    
    const listItem = screen.getByTestId("user-list-item-1");
    fireEvent.click(listItem);
    
    expect(defaultProps.setReceiver).toHaveBeenCalledWith(mockUser);
  });

  it("should display user avatar", () => {
    render(<UserListItem {...defaultProps} />);
    
    const avatar = screen.getByRole("img");
    expect(avatar).toBeInTheDocument();
  });

  it("should handle missing avatar gracefully", () => {
    const userWithoutAvatar = { ...mockUser, avatar: "" };
    const props = { ...defaultProps, user: userWithoutAvatar };
    
    render(<UserListItem {...props} />);
    
    expect(screen.getByText("JD")).toBeInTheDocument();
  });
});
