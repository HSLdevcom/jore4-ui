import { Tag } from '../enums';
import { Navbar } from '../pageObjects';

describe('Verify that language changing works', () => {
  let navbar: Navbar;
  beforeEach(() => {
    navbar = new Navbar();

    cy.setupTests();
    cy.mockLogin();
    cy.visit('/');
  });

  it('Changes language from FI to EN', { tags: [Tag.Smoke] }, () => {
    // Language is FI by default
    navbar.getLanguageDropdown().should('have.text', 'FI');
    navbar.getMainPageLink().should('have.text', 'Etusivu');
    cy.get('html').should('have.attr', 'lang', 'fi-FI');

    navbar.toggleLanguage();

    navbar.getLanguageDropdown().should('have.text', 'EN');
    navbar.getMainPageLink().should('have.text', 'Main page');
    cy.get('html').should('have.attr', 'lang', 'en-US');
  });
});
