import {
  NameConsistencyChecker,
  StopAreaDetails,
  StopAreaMemberStops,
  StopAreaMinimap,
  StopAreaTitleRow,
  StopAreaVersioningRow,
} from './stop-area-details';

export class StopAreaDetailsPage {
  details = new StopAreaDetails();

  memberStops = new StopAreaMemberStops();

  minimap = new StopAreaMinimap();

  titleRow = new StopAreaTitleRow();

  versioningRow = new StopAreaVersioningRow();

  nameConsistencyChecker = new NameConsistencyChecker();

  visit(netexId: string) {
    cy.visit(`/stop-registry/stop-areas/${netexId}`);
  }
}
