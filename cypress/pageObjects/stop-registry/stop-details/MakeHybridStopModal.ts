export class MakeHybridStopModal {
  static modal() {
    return cy.getByTestId('MakeHybridStopModal');
  }

  static transportModeDropdown() {
    return cy.getByTestId('MakeHybridStopModal::transportMode::ListboxButton');
  }

  static stopAreaInput() {
    return cy.getByTestId('MakeHybridStopModal::stopAreaInput');
  }

  static stopAreaOption(code: string) {
    return cy.getByTestId(`MakeHybridStopModal::stopArea::${code}`);
  }

  static confirmButton() {
    return cy.getByTestId('MakeHybridStopModal::confirm');
  }

  static cancelButton() {
    return cy.getByTestId('MakeHybridStopModal::cancel');
  }
}
