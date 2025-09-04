describe("Transaction Edge Cases", () => {
  beforeEach(() => {
    cy.task("db:seed");
    cy.loginByXstate("Katharina_Bernier");
  });

  it("should handle zero amount transactions", () => {
    cy.visit("/transaction/new");
    
    cy.getBySel("user-list-search-input").type("Devon Becker");
    cy.getBySel("user-list-item-t45AiwidW").click();
    
    cy.getBySel("amount-input").clear().type("0");
    cy.getBySel("transaction-create-description-input").type("Zero amount test");
    
    cy.getBySel("transaction-create-submit-payment").should("be.disabled");
  });

  it("should handle very large amounts", () => {
    cy.visit("/transaction/new");
    
    cy.getBySel("user-list-search-input").type("Devon Becker");
    cy.getBySel("user-list-item-t45AiwidW").click();
    
    cy.getBySel("amount-input").clear().type("999999999");
    cy.getBySel("transaction-create-description-input").type("Large amount test");
    
    cy.getBySel("transaction-create-submit-payment").click();
    
    cy.getBySel("alert-bar-error").should("be.visible");
    cy.getBySel("alert-bar-error").should("contain", "insufficient funds");
  });

  it("should handle special characters in description", () => {
    cy.visit("/transaction/new");
    
    cy.getBySel("user-list-search-input").type("Devon Becker");
    cy.getBySel("user-list-item-t45AiwidW").click();
    
    cy.getBySel("amount-input").clear().type("25");
    cy.getBySel("transaction-create-description-input").type("Test with special chars: !@#$%^&*()");
    
    cy.getBySel("transaction-create-submit-payment").click();
    
    cy.getBySel("alert-bar-success").should("be.visible");
    cy.getBySel("alert-bar-success").should("contain", "Transaction Submitted!");
  });

  it("should handle empty description", () => {
    cy.visit("/transaction/new");
    
    cy.getBySel("user-list-search-input").type("Devon Becker");
    cy.getBySel("user-list-item-t45AiwidW").click();
    
    cy.getBySel("amount-input").clear().type("25");
    
    cy.getBySel("transaction-create-submit-payment").should("be.disabled");
  });

  it("should handle network interruption during transaction", () => {
    cy.visit("/transaction/new");
    
    cy.getBySel("user-list-search-input").type("Devon Becker");
    cy.getBySel("user-list-item-t45AiwidW").click();
    
    cy.getBySel("amount-input").clear().type("25");
    cy.getBySel("transaction-create-description-input").type("Network interruption test");
    
    cy.intercept("POST", "/transactions", { forceNetworkError: true }).as("networkError");
    
    cy.getBySel("transaction-create-submit-payment").click();
    
    cy.wait("@networkError");
    cy.getBySel("alert-bar-error").should("be.visible");
  });
});
