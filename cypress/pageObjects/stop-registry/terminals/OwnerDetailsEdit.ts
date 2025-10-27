import { OrganisationDetailsModal } from '../stop-details/OrganisationDetailsModal';

export class OwnerDetailsEdit {
  ownerModal = new OrganisationDetailsModal();

  getOwnerRef = () => cy.getByTestId('OwnerDetailsEdit::ownerRef');

  getContractId = () => cy.getByTestId('OwnerDetailsEdit::contractId');

  getNote = () => cy.getByTestId('OwnerDetailsEdit::note');

  getOwnerDropdown = () =>
    cy.getByTestId('OwnerOrganizationFields::ownerDropdown');

  getOwnerDropdownButton = () =>
    cy.get('[data-testid^="OwnerOrganizationFields::ownerDropdown::button"]');

  getEditOrganisationButton = () =>
    cy.getByTestId('OwnerOrganizationFields::editOrganisationButton');

  getPhone = () => cy.getByTestId('OwnerOrganizationFields::phone');

  getEmail = () => cy.getByTestId('OwnerOrganizationFields::email');
}
