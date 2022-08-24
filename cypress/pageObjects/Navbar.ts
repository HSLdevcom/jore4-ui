export class Navbar {
  getMainPageLink() {
    return cy.getByTestId('NavLinks::routes.root');
  }

  getLanguageDropdown() {
    return cy.getByTestId('LanguageDropdown::toggleDropdown');
  }

  toggleLanguage() {
    // This is naive implementation and expects that language
    // dropdown was when this is called
    return this.getLanguageDropdown()
      .click()
      .getByTestId('LanguageDropdown::toggleLanguage')
      .click();
  }
}
