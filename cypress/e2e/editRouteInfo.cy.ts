import {
  buildLine,
  buildRoute,
  LineInsertInput,
  RouteInsertInput,
  RouteDirectionEnum,
} from '@hsl/jore4-test-db-manager';
import { DateTime } from 'luxon';
import {
  ConfirmSaveForm,
  EditRoutePage,
  LineDetailsPage,
  RoutePropertiesForm,
} from '../pageObjects';
import { insertToDbHelper, removeFromDbHelper } from '../utils';

const routeFormTestInputs = {
  finnishName: 'Muokattu reitin nimi',
  label: 'Muokattu label',
  direction: RouteDirectionEnum.Outbound,
  line: '3999',
};

const originTestInputs = {
  finnishName: 'Muokattu lähtöpaikka FIN',
  finnishNameShort: 'Muokattu lähtöpaikka FIN lyhennys',
  swedishName: 'Muokattu lähtöpaikka SWE',
  swedishNameShort: 'Muokattu lähtöpaikka SWE lyhennys',
};

const destinationTestInputs = {
  finnishName: 'Muokattu määränpää FIN',
  finnishNameShort: 'Muokattu määränpää FIN lyhennys',
  swedishName: 'Muokattu määränpää SWE',
  swedishNameShort: 'Muokattu määränpää SWE lyhennys',
};

const lines: LineInsertInput[] = [
  {
    ...buildLine({ label: '3999' }),
    line_id: '5dfa82f1-b3f7-4e26-b31d-0d7bd78da0bf',
    validity_start: DateTime.fromISO('2020-05-01 23:11:32Z'),
    validity_end: DateTime.fromISO('2045-05-01 23:11:32Z'),
  },
];

const routes: RouteInsertInput[] = [
  {
    ...buildRoute({ label: '9999' }),
    route_id: '61bef596-84a0-40ea-b818-423d6b9b1fcf',
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
  let lineDetailsPage: LineDetailsPage;

  before(() => {
    deleteCreatedResources();
  });
  beforeEach(() => {
    confirmSaveForm = new ConfirmSaveForm();
    routeForm = new RoutePropertiesForm();
    editRoutePage = new EditRoutePage();
    lineDetailsPage = new LineDetailsPage();

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

    routeForm.fillOriginInputs(originTestInputs);

    routeForm.fillDestinationInputs(destinationTestInputs);

    confirmSaveForm.setAsTemporary();
    confirmSaveForm.getIndefiniteCheckbox().click();
    confirmSaveForm.setStartDate('2022-01-01');
    confirmSaveForm.setEndDate('2030-12-31');

    editRoutePage.getSaveRouteButton().click();

    lineDetailsPage
      .getRouteName()
      .should('contain', routeFormTestInputs.finnishName);
    lineDetailsPage.getRouteHeaderRow(routeFormTestInputs.label);
    lineDetailsPage
      .getRouteDirection(routeFormTestInputs.label)
      .should('contain', '1');
    lineDetailsPage
      .getRouteValidityPeriod(routeFormTestInputs.label)
      .should('contain', '1.1.2022 - 31.12.2030');
    editRoutePage.visit(routes[0].route_id);
    routeForm.verifyOriginValues(originTestInputs);
    routeForm.verifyDestinationValues(destinationTestInputs);
  });
});
