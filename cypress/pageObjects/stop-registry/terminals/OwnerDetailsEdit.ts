import { OrganisationDetailsModal } from '../stop-details/OrganisationDetailsModal';

export class OwnerDetailsEdit {
  static ownerModal = OrganisationDetailsModal;

  static getOwnerRef = () => cy.getByTestId('OwnerDetailsEdit::ownerRef');

  static getContractId = () => cy.getByTestId('OwnerDetailsEdit::contractId');

  static getNote = () => cy.getByTestId('OwnerDetailsEdit::note');

  static getOwnerDropdownOptions = () =>
    cy.get('[data-testid^="OwnerOrganizationFields::ownerDropdown::option::"]');

  static getOwnerDropdownButton = () =>
    cy.get('[data-testid^="OwnerOrganizationFields::ownerDropdown::button"]');

  static getEditOrganisationButton = () =>
    cy.getByTestId('OwnerOrganizationFields::editOrganisationButton');

  static getPhone = () => cy.getByTestId('OwnerOrganizationFields::phone');

  static getEmail = () => cy.getByTestId('OwnerOrganizationFields::email');
}
