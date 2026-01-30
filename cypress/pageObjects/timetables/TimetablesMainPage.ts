import { ExportToolBar } from '../routes-and-lines/ExportToolBar';
import { RouteLineTableRow } from '../routes-and-lines/RouteLineTableRow';
import { SearchContainer } from '../routes-and-lines/SearchContainer';

export class TimetablesMainPage {
  static searchContainer = SearchContainer;

  static exportToolBar = ExportToolBar;

  static routeLineTableRow = RouteLineTableRow;

  static getImportButton() {
    return cy.getByTestId('TimetablesMainPage::importButton');
  }

  static getSettingsButton() {
    return cy.getByTestId('TimetablesMainPage::settingsButton');
  }

  static openSettings() {
    return cy.getByTestId('TimetablesMainPage::settingsButton').click();
  }
}
