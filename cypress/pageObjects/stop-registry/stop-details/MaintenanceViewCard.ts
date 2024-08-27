import { MaintainerViewCard } from './MaintainerViewCard';

export class MaintenanceViewCard {
  maintainerViewCard = new MaintainerViewCard();

  getContainer() {
    return cy.getByTestId('MaintenanceViewCard::container');
  }

  getOwner() {
    return cy.getByTestId('MaintenanceViewCard::owner');
  }

  getMaintenance() {
    return cy.getByTestId('MaintenanceViewCard::maintenance');
  }

  getWinterMaintenance() {
    return cy.getByTestId('MaintenanceViewCard::winterMaintenance');
  }

  getInfoUpkeep() {
    return cy.getByTestId('MaintenanceViewCard::infoUpkeep');
  }

  getCleaning() {
    return cy.getByTestId('MaintenanceViewCard::cleaning');
  }
}
