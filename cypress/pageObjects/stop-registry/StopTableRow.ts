// eslint-disable-next-line max-classes-per-file
class StopTableRowInstance {
  public label: string;

  constructor(label: string) {
    this.label = label;
  }

  getSelf = () => cy.getByTestId(`StopTableRow::row::${this.label}`);

  getLink = () => this.getNested('StopTableRow::link');

  getShowOnMapButton = () => this.getNested('LocatorButton::button');

  getActionMenu = () => this.getNested('StopTableRow::actionMenu');

  getShowStopDetailsMenuItem = () =>
    this.getNested('StopTableRow::ActionMenu::ShowStopDetails');

  getShowOnMapMenuItem = () =>
    this.getNested('StopTableRow::ActionMenu::ShowOnMap');

  getRemoveStopMenuItem = () =>
    this.getNested('StopTableRow::ActionMenu::removeStopMenuItem');

  private getNested = (testId: string) =>
    cy.get(
      `[data-testid="StopTableRow::row::${this.label}"] [data-testid="${testId}"]`,
    );
}

export class StopTableRow {
  row = (label: string) => new StopTableRowInstance(label);
}
