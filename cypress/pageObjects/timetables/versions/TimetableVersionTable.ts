import { TimetableVersionTableRow } from '../TimetableVersionTableRow';

export class TimetableVersionTable {
  static timetableVersionTableRow = TimetableVersionTableRow;

  static getRows() {
    return cy.getByTestId('TimetableVersionTableRow::row');
  }

  static getNthRow(nth: number) {
    return cy.getByTestId('TimetableVersionTableRow::row').eq(nth);
  }
}
