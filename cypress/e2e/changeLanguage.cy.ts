import { Tag } from '../enums';
import { Navbar } from '../pageObjects';

describe('Verify that language changing works', () => {
  beforeEach(() => {
    cy.setupTests();
    cy.mockLogin();
    cy.visit('/');
  });

  it('Changes language from FI to EN', { tags: [Tag.Smoke] }, () => {
    // Language is FI by default
    Navbar.getLanguageDropdown().should('have.text', 'FI');
    Navbar.getMainPageLink().should('have.text', 'Etusivu');
    cy.get('html').should('have.attr', 'lang', 'fi-FI');

    Navbar.toggleLanguage();

    Navbar.getLanguageDropdown().should('have.text', 'EN');
    Navbar.getMainPageLink().should('have.text', 'Main page');
    cy.get('html').should('have.attr', 'lang', 'en-US');
  });
});
