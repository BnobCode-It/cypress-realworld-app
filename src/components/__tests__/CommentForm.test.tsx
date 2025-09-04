import { describe, it, expect, beforeEach, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CommentForm from "../CommentForm";

describe("CommentForm", () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    transactionId: "1",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render comment form", () => {
    render(<CommentForm {...defaultProps} />);
    
    expect(screen.getByLabelText(/write a comment/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /post/i })).toBeInTheDocument();
  });

  it("should validate comment content", async () => {
    render(<CommentForm {...defaultProps} />);
    
    const submitButton = screen.getByRole("button", { name: /post/i });
    expect(submitButton).toBeDisabled();
    
    const commentInput = screen.getByTestId("transaction-comment-input");
    fireEvent.change(commentInput, { target: { value: "This is a test comment" } });
    
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it("should submit comment", async () => {
    render(<CommentForm {...defaultProps} />);
    
    const commentInput = screen.getByTestId("transaction-comment-input");
    const submitButton = screen.getByTestId("transaction-comment-submit");
    
    fireEvent.change(commentInput, { target: { value: "This is a test comment" } });
    
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledWith({
        content: "This is a test comment",
        transactionId: "1",
      });
    });
  });

  it("should clear form after submission", async () => {
    render(<CommentForm {...defaultProps} />);
    
    const commentInput = screen.getByTestId("transaction-comment-input");
    const submitButton = screen.getByTestId("transaction-comment-submit");
    
    fireEvent.change(commentInput, { target: { value: "This is a test comment" } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(commentInput).toHaveValue("");
    });
  });
});
