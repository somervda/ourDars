// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// *******************************************************************************
// Component test commands (Reused through test suite)
//  - checks for component access and component content
// *******************************************************************************

Cypress.Commands.add("verifyAboutComponent", () => {
  cy.get("#mainMenu").click();
  cy.get("#mainMenuAbout").click();
  // Verify component was rendered
  cy.url().should("include", "about");
  cy.get(".mat-card-title").contains("About");
});

Cypress.Commands.add("verifyHomeComponent", () => {
  cy.get("#mainMenu").click();
  cy.get("#mainMenuHome").click();
  // Verify component was rendered
  cy.get(".mat-card-title").contains("Decisions");
});

Cypress.Commands.add("verifyMyProfileComponent", () => {
  cy.get("#mainMenu").click();
  cy.get("#mainMenuMyProfile").click();
  // Verify component was rendered
  cy.get("body").contains("User:");
});


Cypress.Commands.add("verifyAdminUserComponent", () => {
  cy.get("#mainMenu").click();
  cy.get("#mainMenuAdministration").click();
  cy.get('app-subheading > .mat-toolbar').contains("Administration");
  cy.get('[routerlink="/users"]').click();
  cy.get('app-subheading > .mat-toolbar').contains("Users");
  cy.contains(Cypress.env("nonAdminUser").toLowerCase()).click();
  cy.url().should("include", "user/");
  cy.get('app-subheading > .mat-toolbar').contains("User:");
});

Cypress.Commands.add("verifyAdminTeamComponent", () => {
  cy.get("#mainMenu").click();
  cy.get("#mainMenuAdministration").click();
  cy.get('app-subheading > .mat-toolbar').contains("Administration");
  cy.get('[routerlink="/teams"]').click();
  cy.get('app-subheading > .mat-toolbar').contains("Teams");
  cy.contains("e2eTeam").click();
  cy.url().should("include", "team/");
  cy.get('app-subheading > .mat-toolbar').contains("Team");
});

Cypress.Commands.add("verifyAdminDarComponent", () => {
  cy.get("#mainMenu").click();
  cy.get("#mainMenuAdministration").click();
  cy.get('app-subheading > .mat-toolbar').contains("Administration");
  cy.get('[routerlink="/adminDars"]').click();
  cy.get('app-subheading > .mat-toolbar').contains("DAR Administration");
  cy.contains("e2eTestDAR").click();
  cy.url().should("include", "darfolder/");
  cy.get('app-subheading > .mat-toolbar').contains("e2eTestDAR");
});

Cypress.Commands.add("verifyLogout", () => {
  cy.get("#mainMenu").click();
  cy.get("#mainMenuLogout").click();
  // Verify user was logged out
  cy.get(".user-avatar").should("not.exist");
});

Cypress.Commands.add("verifyNotAdministrator", () => {
  cy.get("#mainMenu").click();
  cy.get("#mainMenuHome").should("exist");
  cy.get("#mainMenuAdministration").should("not.exist");
  cy.get(".mat-drawer-backdrop").click();
});

Cypress.Commands.add("verifyNotActivated", () => {
  cy.get("#mainMenu").click();
  cy.get("#mainMenuHome").should("exist");
  cy.get("#mainMenuMyProfile").should("not.exist");
  cy.get(".mat-drawer-backdrop").click();
});

Cypress.Commands.add("logonEmail", (usercode, password) => {
  cy.log("logonEmail");
  cy.get("#mainMenu").click();
  cy.get("#mainMenuLogin").click();
  cy.contains("Sign in with email");
  cy.get(":nth-child(2) > .firebaseui-idp-button").click();
  cy.get(".firebaseui-id-submit").click();
  cy.get(".mdl-textfield__input").type(usercode);
  cy.get(".firebaseui-id-submit").click();
  cy.get(":nth-child(3) > .mdl-textfield__input").type(password);
  cy.get(".firebaseui-id-submit").click();
  cy.get('.user-avatar').should("exist");
});
