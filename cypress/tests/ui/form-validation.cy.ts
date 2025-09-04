describe("Form Validation", () => {
  beforeEach(() => {
    cy.task("db:seed");
  });

  describe("Sign In Form Validation", () => {
    beforeEach(() => {
      cy.visit("/signin");
    });

    it("should validate username field", () => {
      cy.getBySel("signin-username").focus().blur();
      cy.contains("Username is required").should("be.visible");
      
      cy.getBySel("signin-username").type("testuser");
      cy.contains("Username is required").should("not.exist");
    });

    it("should validate password field", () => {
      cy.getBySel("signin-password").focus().blur();
      cy.contains("Enter your password").should("be.visible");
      
      cy.getBySel("signin-password").type("123");
      cy.contains("Password must contain at least 4 characters").should("be.visible");
      
      cy.getBySel("signin-password").clear().type("1234");
      cy.contains("Password must contain at least 4 characters").should("not.exist");
    });

    it("should disable submit button with invalid form", () => {
      cy.getBySel("signin-submit").should("be.disabled");
      
      cy.getBySel("signin-username").type("testuser");
      cy.getBySel("signin-submit").should("be.disabled");
      
      cy.getBySel("signin-password").type("1234");
      cy.getBySel("signin-submit").should("not.be.disabled");
    });
  });

  describe("Sign Up Form Validation", () => {
    beforeEach(() => {
      cy.visit("/signup");
    });

    it("should validate all required fields", () => {
      cy.getBySel("signup-submit").should("be.disabled");
      
      cy.getBySel("signup-first-name").type("John");
      cy.getBySel("signup-last-name").type("Doe");
      cy.getBySel("signup-username").type("johndoe");
      cy.getBySel("signup-password").type("password123");
      cy.getBySel("signup-confirmPassword").type("password123");
      
      cy.getBySel("signup-submit").should("not.be.disabled");
    });

    it("should validate password confirmation", () => {
      cy.getBySel("signup-password").type("password123");
      cy.getBySel("signup-confirmPassword").type("different");
      cy.getBySel("signup-confirmPassword").blur();
      
      cy.contains("Password does not match").should("be.visible");
      cy.getBySel("signup-submit").should("be.disabled");
    });
  });

  describe("Bank Account Form Validation", () => {
    beforeEach(() => {
      cy.loginByXstate("Katharina_Bernier");
      cy.visit("/bankaccounts");
      cy.getBySel("bankaccount-new").click();
    });

    it("should validate bank account fields", () => {
      cy.getBySel("bankaccount-bankName-input").should("be.visible");
      cy.getBySel("bankaccount-routingNumber-input").should("be.visible");
      cy.getBySel("bankaccount-accountNumber-input").should("be.visible");
      
      cy.getBySel("bankaccount-submit").should("be.disabled");
      
      cy.getBySel("bankaccount-bankName-input").type("Test Bank");
      cy.getBySel("bankaccount-routingNumber-input").type("123456789");
      cy.getBySel("bankaccount-accountNumber-input").type("987654321");
      
      cy.getBySel("bankaccount-submit").should("not.be.disabled");
    });

    it("should validate routing number format", () => {
      cy.getBySel("bankaccount-routingNumber-input").type("123");
      cy.getBySel("bankaccount-routingNumber-input").blur();
      
      cy.contains("Must contain a valid routing number").should("be.visible");
    });

    it("should validate account number format", () => {
      cy.getBySel("bankaccount-accountNumber-input").type("123");
      cy.getBySel("bankaccount-accountNumber-input").blur();
      
      cy.contains("Must contain a valid account number").should("be.visible");
    });
  });
});
