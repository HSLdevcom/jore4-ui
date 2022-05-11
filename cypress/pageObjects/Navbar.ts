export class Navbar {
  getMainPageLink(cy: Cypress.cy) {
    return cy.getById('routes.root');
  }

  getLanguageDropdown(cy: Cypress.cy) {
    return cy.getById('languageDropdown:toggleDropdown');
  }

  toggleLanguage(cy: Cypress.cy) {
    // This is naive implementation and expects that language
    // dropdown was when this is called
    return this.getLanguageDropdown(cy)
      .click()
      .getById('languageDropdown:toggleLanguage')
      .click();
  }
}
