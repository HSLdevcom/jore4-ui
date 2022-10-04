import {
  buildLine,
  buildRoute,
  LineInsertInput,
  RouteInsertInput,
  RouteDirectionEnum,
} from '@hsl/jore4-test-db-manager';
import {
  ConfirmSaveForm,
  EditRoutePage,
  RoutePropertiesForm,
  RouteStopsTable,
  TerminusNameInputs,
  TerminusValues,
} from '../pageObjects';
import { insertToDbHelper, removeFromDbHelper } from '../utils';

const routeFormTestInputs = {
  finnishName: 'Muokattu reitin nimi',
  label: 'Muokattu label',
  direction: RouteDirectionEnum.Outbound,
  line: '3999',
};

const originTestInputs: TerminusValues = {
  finnishName: 'Muokattu lähtöpaikka FIN',
  finnishShortName: 'Muokattu lähtöpaikka FIN lyhennys',
  swedishName: 'Muokattu lähtöpaikka SWE',
  swedishShortName: 'Muokattu lähtöpaikka SWE lyhennys',
};

const destinationTestInputs: TerminusValues = {
  finnishName: 'Muokattu määränpää FIN',
  finnishShortName: 'Muokattu määränpää FIN lyhennys',
  swedishName: 'Muokattu määränpää SWE',
  swedishShortName: 'Muokattu määränpää SWE lyhennys',
};

const lines: LineInsertInput[] = [
  {
    ...buildLine({ label: '3999' }),
    line_id: '77410a6f-7f6a-4f4f-b303-d03f4a56a38e',
  },
];

const routes: RouteInsertInput[] = [
  {
    ...buildRoute({ label: '9999' }),
    route_id: '053a5d5d-5b44-488b-9f52-5839a63c3c21',
    name_i18n: 'Alkuperäinen nimi',
    direction: RouteDirectionEnum.Inbound,
    on_line_id: lines[0].line_id,
  },
];

const dbResources = {
  lines,
  routes,
};

const deleteCreatedResources = () => {
  removeFromDbHelper(dbResources);
};

describe('Route meta information editing', () => {
  let routeForm: RoutePropertiesForm;
  let confirmSaveForm: ConfirmSaveForm;
  let editRoutePage: EditRoutePage;
  let terminusNameInputs: TerminusNameInputs;
  let routeStopsTable: RouteStopsTable;

  before(() => {
    deleteCreatedResources();
  });
  beforeEach(() => {
    confirmSaveForm = new ConfirmSaveForm();
    routeForm = new RoutePropertiesForm();
    editRoutePage = new EditRoutePage();
    terminusNameInputs = new TerminusNameInputs();
    routeStopsTable = new RouteStopsTable();

    cy.setupTests();
    cy.mockLogin();
    insertToDbHelper(dbResources);
    editRoutePage.visit(routes[0].route_id);
  });
  afterEach(() => {
    deleteCreatedResources();
  });

  it("Edits a routes's information", () => {
    routeForm.fillRouteProperties(routeFormTestInputs);
    terminusNameInputs.fillTerminusNameInputsForm(
      originTestInputs,
      destinationTestInputs,
    );
    confirmSaveForm.setAsTemporary();
    confirmSaveForm.getIndefiniteCheckbox().click();
    confirmSaveForm.setStartDate('2022-01-01');
    confirmSaveForm.setEndDate('2030-12-31');

    editRoutePage.getSaveRouteButton().click();

    routeStopsTable
      .getRouteName()
      .should('contain', routeFormTestInputs.finnishName);
    routeStopsTable.getRouteHeaderRow(routeFormTestInputs.label);
    routeStopsTable.routeDirectionShouldBeOutbound(routeFormTestInputs.label);
    routeStopsTable
      .getRouteValidityPeriod(routeFormTestInputs.label)
      .should('contain', '1.1.2022 - 31.12.2030');

    editRoutePage.visit(routes[0].route_id);
    terminusNameInputs.verifyOriginValues(originTestInputs);
    terminusNameInputs.verifyDestinationValues(destinationTestInputs);
  });
});
