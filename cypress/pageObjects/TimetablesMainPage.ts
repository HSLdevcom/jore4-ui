import { ExportToolBar } from './ExportToolBar';
import { RouteLineTableRow } from './RouteLineTableRow';
import { SearchContainer } from './SearchContainer';

export class TimetablesMainPage {
  searchContainer = new SearchContainer();

  exportToolBar = new ExportToolBar();

  routeLineTableRow = new RouteLineTableRow();

  getImportButton() {
    return cy.getByTestId('TimetablesMainPage::importButton');
  }

  getSettingsButton() {
    return cy.getByTestId('TimetablesMainPage::settingsButton');
  }

  openSettings = () => {
    return cy.getByTestId('TimetablesMainPage::settingsButton').click();
  };
}
