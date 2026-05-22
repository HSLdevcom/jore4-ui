import { UUID } from '../../types';
import { LineRouteList } from './LineRouteList';

export class LineDetailsPage {
  static lineRouteList = LineRouteList;

  static visit(lineId: UUID) {
    cy.visit(`/lines/${lineId}`);
  }

  static getEditLineButton() {
    return cy.getByTestId('AdditionalInformation::editLineButton');
  }

  static getLineName() {
    return cy.getByTestId('AdditionalInformation::name');
  }

  static getLineLabel() {
    return cy.getByTestId('AdditionalInformation::label');
  }

  static getTypeOfLine() {
    return cy.getByTestId('AdditionalInformation::typeOfLine');
  }

  static getTransportTarget() {
    return cy.getByTestId('AdditionalInformation::transportTarget');
  }

  static getPrimaryVehicleMode() {
    return cy.getByTestId('AdditionalInformation::primaryVehicleMode');
  }

  static getShowDraftsButton() {
    return cy.getByTestId('ActionsRow::showDraftsButton');
  }

  static getChangeHistoryLink() {
    return cy.getByTestId('LineTitle::changeHistoryLink');
  }

  static latestChangeHistory = {
    container: () => cy.getByTestId('LatestLineChangeHistoryTable::Container'),
    title: () => cy.getByTestId('LatestLineChangeHistoryTable::Title'),
    showAllLink: () =>
      cy.getByTestId('LatestLineChangeHistoryTable::ShowAllLink'),
    getItems: () =>
      cy.get('[data-testid^="LatestLineChangeHistoryTable::Item"]'),
    getNthItem: (index: number) =>
      cy.get('[data-testid^="LatestLineChangeHistoryTable::Item"]').eq(index),
  };
}
