import { ExportToolBar } from './ExportToolBar';
import { RouteLineTableRow } from './RouteLineTableRow';
import { SearchContainer } from './SearchContainer';
import { Toast } from './Toast';

export class RoutesAndLinesPage {
  searchContainer = new SearchContainer();

  exportToolBar = new ExportToolBar();

  routeLineTableRow = new RouteLineTableRow();

  toast = new Toast();

  getImportButton() {
    return cy.getByTestId('TimetablesMainPage::importButton');
  }
}
