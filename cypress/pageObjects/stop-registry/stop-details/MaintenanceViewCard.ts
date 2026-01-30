import { MaintainerViewCard } from './MaintainerViewCard';

export class MaintenanceViewCard {
  static maintainerViewCard = MaintainerViewCard;

  static getContainer() {
    return cy.getByTestId('MaintenanceViewCard::container');
  }

  static getStopOwner() {
    return cy.getByTestId('MaintenanceViewCard::stopOwner');
  }

  static getStopOwnerName() {
    return cy.getByTestId('MaintenanceViewCard::stopOwnerName');
  }

  static getOwner() {
    return cy.getByTestId('MaintenanceViewCard::owner');
  }

  static getShelterMaintenance() {
    return cy.getByTestId('MaintenanceViewCard::shelterMaintenance');
  }

  static getMaintenance() {
    return cy.getByTestId('MaintenanceViewCard::maintenance');
  }

  static getWinterMaintenance() {
    return cy.getByTestId('MaintenanceViewCard::winterMaintenance');
  }

  static getInfoUpkeep() {
    return cy.getByTestId('MaintenanceViewCard::infoUpkeep');
  }

  static getCleaning() {
    return cy.getByTestId('MaintenanceViewCard::cleaning');
  }
}
