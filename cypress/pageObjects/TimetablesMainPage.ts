import { ExportToolBar } from './ExportToolBar';
import { RouteLineTableRow } from './RouteLineTableRow';
import { SearchContainer } from './SearchContainer';

export class TimetablesMainpage {
  searchContainer = new SearchContainer();

  exportToolBar = new ExportToolBar();

  routeLineTableRow = new RouteLineTableRow();

  getImportButton() {
    return cy.getByTestId('TimetablesMainPage::importButton');
  }
}
