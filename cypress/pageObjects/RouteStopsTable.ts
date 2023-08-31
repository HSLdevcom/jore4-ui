import { TimingSettingsForm } from './TimingSettingsForm';
import { ViaForm } from './ViaForm';

export class RouteStopsTable {
  viaForm = new ViaForm();

  timingSettingsForm = new TimingSettingsForm();

  toggleShowUnusedStops() {
    return cy.getByTestId('show-unused-stops-switch').click();
  }

  getRouteHeaderRow(routeLabel: string) {
    return cy.getByTestId(`ExpandableRouteRow::${routeLabel}`);
  }

  toggleRouteSection(routeLabel: string) {
    return this.getRouteHeaderRow(routeLabel)
      .getByTestId('ExpandableRouteRow::toggleAccordion')
      .click();
  }

  getRouteName() {
    return cy.getByTestId('ExpandableRouteRow::name');
  }

  getRouteValidityPeriod(routeLabel: string) {
    return this.getRouteHeaderRow(routeLabel).findByTestId(
      'ExpandableRouteRow::validityPeriod',
    );
  }

  getStopRow(stopLabel: string) {
    return cy.getByTestId(`RouteStopsRow::${stopLabel}`);
  }

  getStopDropdown(stopLabel: string) {
    return this.getStopRow(stopLabel).findByTestId('StopActionsDrowdown::menu');
  }

  addStopToRoute(stopLabel: string) {
    return this.getStopDropdown(stopLabel)
      .click()
      .getByTestId('StopActionsDrowdown::addStopToRouteButton')
      .click();
  }

  removeStopFromRoute(stopLabel: string) {
    return this.getStopDropdown(stopLabel)
      .click()
      .getByTestId('StopActionsDrowdown::removeStopFromRouteButton')
      .click();
  }

  openCreateViaPointModal(stopLabel: string) {
    this.getStopDropdown(stopLabel).click();
    cy.getByTestId('StopActionsDrowdown::createViaPoint').click();
  }

  openEditViaPointModal(stopLabel: string) {
    this.getStopDropdown(stopLabel).click();
    cy.getByTestId('StopActionsDrowdown::editViaPoint').click();
  }

  openTimingSettingsForm(stopLabel: string) {
    this.getStopDropdown(stopLabel).click();
    cy.getByTestId('StopActionsDrowdown::openTimingSettings').click();
  }

  getRouteDirection(routeLabel: string) {
    return this.getRouteHeaderRow(routeLabel).findByTestId(
      'DirectionBadge::value',
    );
  }

  // TODO: check later if RouteDirectionEnum could be used instead of the numbers 1 and 2
  routeDirectionShouldBeOutbound(routeLabel: string) {
    this.getRouteDirection(routeLabel).should('contain', '1');
  }

  routeDirectionShouldBeInbound(routeLabel: string) {
    this.getRouteDirection(routeLabel).should('contain', '2');
  }
}
