export class Navbar {
  getMainPageLink() {
    return cy.getByTestId('routes.root');
  }

  getLanguageDropdown() {
    return cy.getByTestId('languageDropdown:toggleDropdown');
  }

  toggleLanguage() {
    // This is naive implementation and expects that language
    // dropdown was when this is called
    return this.getLanguageDropdown()
      .click()
      .getByTestId('languageDropdown:toggleLanguage')
      .click();
  }
}
