import { describe, it, expect, beforeEach, vi } from "vitest";
import { frontendPort, backendPort, getBackendPort } from "../portUtils";
import detect from "detect-port";

vi.mock("detect-port");
const mockDetect = detect as any;

describe("Port Utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    console.log = vi.fn();
    process.env.PORT = "3000";
    process.env.VITE_BACKEND_PORT = "3005";
  });

  it("should export frontend and backend ports", () => {
    expect(frontendPort).toBeDefined();
    expect(backendPort).toBeDefined();
  });

  it("should return backend port when available", async () => {
    process.env.VITE_BACKEND_PORT = "3003";
    mockDetect.mockResolvedValue(3003);

    const port = await getBackendPort();
    expect(port).toBe(3003);
  });

  it("should return alternative port when backend port is unavailable", async () => {
    process.env.VITE_BACKEND_PORT = "3003";
    mockDetect.mockResolvedValue(3004);

    const port = await getBackendPort();
    expect(port).toBe(3004);
  });

  it("should handle errors", async () => {
    process.env.VITE_BACKEND_PORT = "3003";
    mockDetect.mockRejectedValue(new Error("Port detection failed"));

    const result = await getBackendPort();
    expect(result).toBeUndefined();
  });
});
