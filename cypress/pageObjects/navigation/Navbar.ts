export class Navbar {
  static getMainPageLink() {
    return cy.getByTestId('NavLinks::routes.root');
  }

  static getRoutesAndLinesLink() {
    return cy.getByTestId('NavLinks::routes.routes');
  }

  static getTimetablesLink() {
    return cy.getByTestId('NavLinks::timetables.timetables');
  }

  static getStopsLink() {
    return cy.getByTestId('NavLinks::stops.stops');
  }

  static getLanguageDropdown() {
    return cy.getByTestId('LanguageDropdown::toggleDropdown');
  }

  static toggleLanguage() {
    // This is naive implementation and expects that language
    // dropdown was when this is called
    Navbar.getLanguageDropdown().click();
    cy.getByTestId('LanguageDropdown::toggleLanguage').click();
  }
}
