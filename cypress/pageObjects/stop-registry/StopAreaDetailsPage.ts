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

  static latestChangeHistory = {
    container: () =>
      cy.getByTestId('LatestStopAreaChangeHistoryTable::Container'),
    title: () => cy.getByTestId('LatestStopAreaChangeHistoryTable::Title'),
    showAllLink: () =>
      cy.getByTestId('LatestStopAreaChangeHistoryTable::ShowAllLink'),
    getItems: () =>
      cy.get('[data-testid^="LatestStopAreaChangeHistoryTable::Item"]'),
    getNthItem: (index: number) =>
      cy
        .get('[data-testid^="LatestStopAreaChangeHistoryTable::Item"]')
        .eq(index),

    changes: {
      byName: (changeName: string) =>
        cy.getByTestId(`LatestChangeHistoryItemChange::${changeName}`),
      fieldName: () =>
        cy.getByTestId('LatestChangeHistoryItemChange::FieldName'),
      oldValue: () => cy.getByTestId('LatestChangeHistoryItemChange::OldValue'),
      newValue: () => cy.getByTestId('LatestChangeHistoryItemChange::NewValue'),
    } as const,
  } as const;
}
