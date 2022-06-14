describe('Verify that login mocking works', () => {
  it('User is not logged in by default', () => {
    cy.visit('/');
    cy.getByTestId('main').should('contain', 'Please log in.');
  });
  it('cy.mockLogin() logs user in', () => {
    cy.mockLogin();
    cy.visit('/');
    cy.getByTestId('main').should(
      'contain',
      'You have the following permissions',
    );
  });
});

// workaround for "cypress/integration/login.spec.ts:1:1 - error TS1208: 'login.spec.ts' cannot be compiled under '--isolatedModules' because it is considered a global script file. Add an import, export, or an empty 'export {}' statement to make it a module."
// eslint-disable-next-line jest/no-export
export {};
