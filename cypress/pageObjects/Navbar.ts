export class Navbar {
  getMainPageLink() {
    return cy.getByTestId('NavLinks::routes.root');
  }

  getRoutesAndLinesLink() {
    return cy.getByTestId('NavLinks::routes.routes');
  }

  getTimetablesLink() {
    return cy.getByTestId('NavLinks::timetables.timetables');
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
