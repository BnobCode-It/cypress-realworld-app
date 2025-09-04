describe("Accessibility", () => {
  beforeEach(() => {
    cy.task("db:seed");
  });

  it("should have proper ARIA labels on sign in form", () => {
    cy.visit("/signin");
    
    cy.getBySel("signin-username").should("have.attr", "aria-label").or("have.attr", "aria-labelledby");
    cy.getBySel("signin-password").should("have.attr", "aria-label").or("have.attr", "aria-labelledby");
    cy.getBySel("signin-submit").should("have.attr", "aria-label").or("contain.text", "Sign In");
  });

  it("should have proper heading structure", () => {
    cy.visit("/");
    
    cy.get("h1").should("exist");
    cy.get("h1").should("be.visible");
  });

  it("should have proper focus management", () => {
    cy.visit("/signin");
    
    cy.getBySel("signin-username").should("be.focused");
    
    cy.getBySel("signin-username").tab();
    cy.getBySel("signin-password").should("be.focused");
  });

  it("should have proper error announcements", () => {
    cy.visit("/signin");
    
    cy.getBySel("signin-username").type("invalid");
    cy.getBySel("signin-password").type("123");
    cy.getBySel("signin-submit").click();
    
    cy.getBySel("signin-error").should("have.attr", "role", "alert").or("have.attr", "aria-live");
  });

  it("should have keyboard navigation support", () => {
    cy.loginByXstate("Katharina_Bernier");
    cy.visit("/");
    
    cy.get("body").tab();
    cy.focused().should("be.visible");
    
    cy.focused().tab();
    cy.focused().should("be.visible");
  });
});
