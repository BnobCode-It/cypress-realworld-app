import { describe, it, expect, beforeEach, vi } from "vitest";
import { interpret } from "xstate";
import { authMachine } from "../authMachine";
import { httpClient } from "../../utils/asyncUtils";

vi.mock("../../utils/asyncUtils");
vi.mock("../../utils/historyUtils", () => ({
  history: {
    push: vi.fn(),
    location: { pathname: "/" },
  },
}));

const mockHttpClient = httpClient as any;

describe("Auth Machine", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("should start in unauthorized state", () => {
    const service = interpret(authMachine);
    service.start();
    
    expect(service.state.value).toBe("unauthorized");
    expect(service.state.context.user).toBeUndefined();
    
    service.stop();
  });

  it("should transition to loading state on LOGIN event", () => {
    const service = interpret(authMachine);
    service.start();
    
    service.send({ type: "LOGIN", username: "test", password: "test" });
    
    expect(service.state.value).toBe("loading");
    
    service.stop();
  });

  it("should transition to signup state on SIGNUP event", () => {
    const service = interpret(authMachine);
    service.start();
    
    service.send({ type: "SIGNUP" });
    
    expect(service.state.value).toBe("signup");
    
    service.stop();
  });

  it("should transition to google state on GOOGLE event", () => {
    const service = interpret(authMachine);
    service.start();
    
    service.send({ type: "GOOGLE" });
    
    expect(service.state.value).toBe("google");
    
    service.stop();
  });

  it("should transition to auth0 state on AUTH0 event", () => {
    const service = interpret(authMachine);
    service.start();
    
    service.send({ type: "AUTH0" });
    
    expect(service.state.value).toBe("auth0");
    
    service.stop();
  });

  it("should transition to okta state on OKTA event", () => {
    const service = interpret(authMachine);
    service.start();
    
    service.send({ type: "OKTA" });
    
    expect(service.state.value).toBe("okta");
    
    service.stop();
  });

  it("should transition to cognito state on COGNITO event", () => {
    const service = interpret(authMachine);
    service.start();
    
    service.send({ type: "COGNITO" });
    
    expect(service.state.value).toBe("cognito");
    
    service.stop();
  });

  it("should handle successful login", async () => {
    const mockUser = { id: "1", username: "test", email: "test@example.com" };
    mockHttpClient.post.mockResolvedValueOnce({ data: { user: mockUser } });
    
    const service = interpret(authMachine);
    service.start();
    
    return new Promise((resolve) => {
      service.onTransition((state) => {
        if (state.value === "authorized") {
          expect(state.context.user).toEqual(mockUser);
          service.stop();
          resolve(undefined);
        }
      });
      
      service.send({ type: "LOGIN", username: "test", password: "test" });
    });
  });

  it("should handle login error", async () => {
    mockHttpClient.post.mockRejectedValueOnce(new Error("Invalid credentials"));
    
    const service = interpret(authMachine);
    service.start();
    
    return new Promise((resolve) => {
      service.onTransition((state) => {
        if (state.value === "unauthorized" && state.context.message) {
          expect(state.context.message).toBe("Username or password is invalid");
          service.stop();
          resolve(undefined);
        }
      });
      
      service.send({ type: "LOGIN", username: "test", password: "wrong" });
    });
  });

  it("should handle successful signup", (done) => {
    const mockUser = { id: "1", username: "newuser", email: "new@example.com" };
    mockHttpClient.post.mockResolvedValueOnce({ data: { user: mockUser } });
    
    const service = interpret(authMachine);
    service.start();
    
    service.onTransition((state) => {
      if (state.value === "unauthorized" && state.context.user) {
        expect(state.context.user).toEqual(mockUser);
        service.stop();
        done();
      }
    });
    
    service.send({ 
      type: "SIGNUP", 
      username: "newuser", 
      password: "password",
      firstName: "New",
      lastName: "User",
      email: "new@example.com"
    });
  });

  it("should handle logout", (done) => {
    mockHttpClient.post.mockResolvedValueOnce({ data: {} });
    
    const service = interpret(authMachine);
    service.start();
    
    service.state.context.user = { id: "1", username: "test" };
    
    service.onTransition((state) => {
      if (state.value === "unauthorized" && !state.context.user) {
        service.stop();
        done();
      }
    });
    
    service.send({ type: "LOGOUT" });
  });

  it("should handle profile update", (done) => {
    const updatedUser = { id: "1", username: "updated", email: "updated@example.com" };
    mockHttpClient.patch.mockResolvedValueOnce({ data: { user: updatedUser } });
    mockHttpClient.get.mockResolvedValueOnce({ data: { user: updatedUser } });
    
    const service = interpret(authMachine);
    service.start();
    
    service.state.context.user = { id: "1", username: "test" };
    
    let transitionCount = 0;
    service.onTransition((state) => {
      transitionCount++;
      if (state.value === "authorized" && transitionCount > 1) {
        expect(state.context.user).toEqual(updatedUser);
        service.stop();
        done();
      }
    });
    
    service.send({ type: "UPDATE", id: "1", username: "updated" });
  });

  it("should handle refresh user profile", (done) => {
    const refreshedUser = { id: "1", username: "refreshed", email: "refreshed@example.com" };
    mockHttpClient.get.mockResolvedValueOnce({ data: { user: refreshedUser } });
    
    const service = interpret(authMachine);
    service.start();
    
    service.state.context.user = { id: "1", username: "test" };
    
    service.onTransition((state) => {
      if (state.value === "authorized" && state.context.user?.username === "refreshed") {
        expect(state.context.user).toEqual(refreshedUser);
        service.stop();
        done();
      }
    });
    
    service.send({ type: "REFRESH" });
  });
});
