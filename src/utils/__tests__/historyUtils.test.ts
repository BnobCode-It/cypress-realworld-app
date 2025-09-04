import { describe, it, expect, vi } from "vitest";
import { history } from "../historyUtils";

describe("History Utils", () => {
  it("should export history object", () => {
    expect(history).toBeDefined();
    expect(history.push).toBeDefined();
    expect(history.location).toBeDefined();
  });

  it("should be able to push to history", () => {
    const spy = vi.spyOn(history, "push");
    history.push("/test");
    expect(spy).toHaveBeenCalledWith("/test");
    spy.mockRestore();
  });
});
