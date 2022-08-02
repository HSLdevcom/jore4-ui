import { Navbar } from '../pageObjects';

describe('Verify that language changing works', () => {
  let navbar: Navbar;
  beforeEach(() => {
    navbar = new Navbar();
    cy.mockLogin();
    cy.visit('/');
  });
  it('Changes language from FI to EN', () => {
    // Language is FI by default
    navbar.getLanguageDropdown().should('have.text', 'FI');
    navbar.getMainPageLink().should('have.text', 'Etusivu');

    navbar.toggleLanguage();

    navbar.getLanguageDropdown().should('have.text', 'EN');
    navbar.getMainPageLink().should('have.text', 'Main page');
  });
});
