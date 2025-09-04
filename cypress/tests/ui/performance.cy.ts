describe("Performance", () => {
  beforeEach(() => {
    cy.task("db:seed");
    cy.loginByXstate("Katharina_Bernier");
  });

  it("should load transaction list within reasonable time", () => {
    const start = Date.now();
    
    cy.visit("/");
    cy.getBySel("transaction-list").should("be.visible");
    
    cy.then(() => {
      const loadTime = Date.now() - start;
      expect(loadTime).to.be.lessThan(5000);
    });
  });

  it("should handle large transaction lists efficiently", () => {
    cy.visit("/");
    
    cy.getBySel("transaction-list").should("be.visible");
    cy.getBySel("transaction-item").should("have.length.at.least", 1);
    
    cy.scrollTo("bottom");
    cy.wait(1000);
    
    cy.getBySel("transaction-item").should("have.length.at.least", 1);
  });

  it("should load user search results quickly", () => {
    cy.visit("/transaction/new");
    
    const start = Date.now();
    cy.getBySel("user-list-search-input").type("Devon");
    
    cy.getBySel("user-list-item").should("be.visible").then(() => {
      const searchTime = Date.now() - start;
      expect(searchTime).to.be.lessThan(2000);
    });
  });

  it("should handle rapid navigation without errors", () => {
    cy.visit("/");
    cy.getBySel("sidenav-toggle").click();
    cy.getBySel("sidenav-home").click();
    
    cy.getBySel("sidenav-toggle").click();
    cy.getBySel("sidenav-user-settings").click();
    
    cy.getBySel("sidenav-toggle").click();
    cy.getBySel("sidenav-bankaccounts").click();
    
    cy.getBySel("sidenav-toggle").click();
    cy.getBySel("sidenav-notifications").click();
    
    cy.url().should("contain", "/notifications");
  });
});
