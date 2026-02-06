import { Toast } from '../shared-components/Toast';
import { ExportToolBar } from './ExportToolBar';
import { RouteLineTableRow } from './RouteLineTableRow';
import { SearchContainer } from './SearchContainer';

export class RoutesAndLinesPage {
  static searchContainer = SearchContainer;

  static exportToolBar = ExportToolBar;

  static routeLineTableRow = RouteLineTableRow;

  static toast = Toast;

  static getImportButton() {
    return cy.getByTestId('TimetablesMainPage::importButton');
  }
}
