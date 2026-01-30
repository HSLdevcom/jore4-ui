import { ObservationDateControl } from '../timetables/ObservationDateControl';
import {
  CopyStopAreaModal,
  StopAreaDetails,
  StopAreaMemberStops,
  StopAreaMinimap,
  StopAreaTitleRow,
  StopAreaVersioningRow,
} from './stop-area-details';

export class StopAreaDetailsPage {
  static details = StopAreaDetails;

  static memberStops = StopAreaMemberStops;

  static minimap = StopAreaMinimap;

  static titleRow = StopAreaTitleRow;

  static versioningRow = StopAreaVersioningRow;

  static copyModal = CopyStopAreaModal;

  static observationDateControl = ObservationDateControl;

  static visit(netexId: string, observationDate?: string) {
    cy.visit(
      `/stop-registry/stop-areas/${netexId}${observationDate ? `?observationDate=${observationDate}` : ''}`,
    );
  }
}
