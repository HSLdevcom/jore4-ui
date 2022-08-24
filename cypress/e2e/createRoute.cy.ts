import {
  ConfirmSaveForm,
  Map,
  MapFooter,
  RoutePropertiesForm,
  TerminusNameInputs,
  Toast,
} from '../pageObjects';

const deleteRouteByLabel = (label: string) => {
  const query = 'DELETE FROM "route"."route" WHERE label=?';
  cy.task('executeRawDbQuery', { query, bindings: label });
};

if (!Cypress.env('SKIP_MAP_TESTS')) {
  describe('Verify that creating new route works', () => {
    let map: Map;
    let mapFooter: MapFooter;
    let routePropertiesForm: RoutePropertiesForm;
    let terminusNameInputs: TerminusNameInputs;
    let confirmSaveForm: ConfirmSaveForm;
    let toast: Toast;

    beforeEach(() => {
      map = new Map();
      mapFooter = new MapFooter();
      routePropertiesForm = new RoutePropertiesForm();
      terminusNameInputs = new TerminusNameInputs();
      confirmSaveForm = new ConfirmSaveForm();
      toast = new Toast();

      cy.mockLogin();
      cy.visit(
        '/routes?mapOpen=true&lng=24.93021804533524&lat=60.164074274478054&z=15',
      );
      map.waitForMapToLoad();
    });

    const testRouteLabel = 'T-reitti 1';
    beforeEach(() => {
      deleteRouteByLabel(testRouteLabel);
    });

    after(() => {
      deleteRouteByLabel(testRouteLabel);
    });

    it(
      'Creates new route as expected',
      { scrollBehavior: 'bottom', defaultCommandTimeout: 10000 },
      () => {
        mapFooter.createRoute();

        const routeName = 'Testireitti 1';

        routePropertiesForm.fillRouteProperties({
          label: testRouteLabel,
          finnishName: routeName,
          direction: '1',
          line: '65',
        });

        terminusNameInputs.fillTerminusNameInputsForm(
          {
            finnishName: 'Lähtöpaikka',
            swedishName: 'Ursprung',
            finnishShortName: 'LP',
            swedishShortName: 'UP',
          },
          {
            finnishName: 'Määränpää',
            swedishName: 'Ändstation',
            finnishShortName: 'MP',
            swedishShortName: 'ÄS',
          },
        );

        confirmSaveForm.setAsStandard();
        confirmSaveForm.setStartDate('2022-01-01');
        confirmSaveForm.setEndDate('2022-12-01');

        routePropertiesForm.save();

        map.clickAtPositionFromMapMarkerByTestId(
          'Map::Stops::stopMarker::H1234_Standard',
          -10,
          25,
        );
        map.clickAtPositionFromMapMarkerByTestId(
          'Map::Stops::stopMarker::H1236_Standard',
          35,
          -20,
        );

        map.clickNthSnappingPointHandle(1);
        mapFooter.save();
        toast.checkRouteSubmitSuccess();

        cy.getByTestId('RouteStopsOverlay::mapOverlayHeader')
          .get('div')
          .contains(routeName)
          .should('exist');
      },
    );
  });
}
