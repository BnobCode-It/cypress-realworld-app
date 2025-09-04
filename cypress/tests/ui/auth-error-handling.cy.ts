describe("Authentication Error Handling", () => {
  beforeEach(() => {
    cy.visit("/signin");
  });

  it("should display error message for invalid credentials", () => {
    cy.intercept("POST", "/login", {
      statusCode: 401,
      body: { message: "Username or password is invalid" },
    }).as("loginError");

    cy.getBySel("signin-username").type("invaliduser");
    cy.getBySel("signin-password").type("wrongpassword");
    cy.getBySel("signin-submit").click();

    cy.wait("@loginError");
    cy.getBySel("signin-error").should("be.visible");
    cy.getBySel("signin-error").should("contain", "Username or password is invalid");
  });

  it("should handle network errors gracefully", () => {
    cy.intercept("POST", "/login", { forceNetworkError: true }).as("networkError");

    cy.getBySel("signin-username").type("testuser");
    cy.getBySel("signin-password").type("password");
    cy.getBySel("signin-submit").click();

    cy.wait("@networkError");
    cy.getBySel("signin-error").should("be.visible");
  });

  it("should handle server errors", () => {
    cy.intercept("POST", "/login", {
      statusCode: 500,
      body: { message: "Internal server error" },
    }).as("serverError");

    cy.getBySel("signin-username").type("testuser");
    cy.getBySel("signin-password").type("password");
    cy.getBySel("signin-submit").click();

    cy.wait("@serverError");
    cy.getBySel("signin-error").should("be.visible");
  });

  it("should clear error message on successful login", () => {
    cy.intercept("POST", "/login", {
      statusCode: 401,
      body: { message: "Username or password is invalid" },
    }).as("loginError");

    cy.intercept("POST", "/login", {
      statusCode: 200,
      body: { user: { id: "1", username: "testuser" } },
    }).as("loginSuccess");

    cy.getBySel("signin-username").type("invaliduser");
    cy.getBySel("signin-password").type("wrongpassword");
    cy.getBySel("signin-submit").click();

    cy.wait("@loginError");
    cy.getBySel("signin-error").should("be.visible");

    cy.getBySel("signin-username").clear().type("testuser");
    cy.getBySel("signin-password").clear().type("correctpassword");
    cy.getBySel("signin-submit").click();

    cy.wait("@loginSuccess");
    cy.url().should("not.contain", "/signin");
  });
});
