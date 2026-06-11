import { DateTime } from 'luxon';
import Chainable = Cypress.Chainable;

export type TranslatedStatus =
  | 'Voimassa'
  | 'Perusversio'
  | 'Väliaikainen'
  | 'Luonnos';

export type VersionRowValues = {
  readonly status?: TranslatedStatus;
  readonly validityStart?: string | DateTime | null;
  readonly validityEnd?: string | DateTime | null;
  readonly versionComment?: string | null;
  readonly changed?: string | null;
  readonly changedBy?: string | null;
};

export const active: VersionRowValues = { status: 'Voimassa' };
export const standard: VersionRowValues = { status: 'Perusversio' };
export const temporary: VersionRowValues = { status: 'Väliaikainen' };
export const draft: VersionRowValues = { status: 'Luonnos' };

/**
 * Check that the column/Cypress jQuery element has the given value
 * @param column Version row column
 * @param value Expected value
 */
export function checkColumn(
  column: Chainable<JQuery>,
  value: string | DateTime | undefined | null,
) {
  if (value === null || value === '') {
    column.should('be.empty');
  } else if (value instanceof DateTime) {
    column.shouldHaveDate(value);
  } else if (typeof value === 'string') {
    column.shouldHaveText(value);
  }

  // Else undefined → Ignore / dont test
}

export type VersionRowPageObject = {
  rows: () => Chainable<JQuery>;
  status: () => Chainable<JQuery>;
  validityStart: () => Chainable<JQuery>;
  validityEnd: () => Chainable<JQuery>;
  versionComment: () => Chainable<JQuery>;
  changed: () => Chainable<JQuery>;
  changedBy: () => Chainable<JQuery>;
};

export type VersionPageObject = {
  scheduledVersions: () => Chainable<JQuery>;
  draftVersions: () => Chainable<JQuery>;
};

export type VersionTableHeaderPageObject<TColumn extends string> = {
  setSorting: (column: TColumn, direction: 'ascending' | 'descending') => void;
};

export function checkRowColumns(
  versionRow: VersionRowPageObject,
  version: Partial<VersionRowValues>,
) {
  checkColumn(versionRow.status(), version.status);
  checkColumn(versionRow.validityStart(), version.validityStart);
  checkColumn(versionRow.validityEnd(), version.validityEnd);
  checkColumn(versionRow.versionComment(), version.versionComment);
  checkColumn(versionRow.changed(), version.changed);
  checkColumn(versionRow.changedBy(), version.changedBy);
}

// Get row by index and check it has the given version info.
export function checkRow(
  versionRow: VersionRowPageObject,
  index: number,
  ...versionInfoFragments: ReadonlyArray<Partial<VersionRowValues>>
) {
  const versionInfo = versionInfoFragments.reduce(
    (r, f) => ({ ...r, ...f }),
    {},
  );

  versionRow.rows().should('have.length.at.least', index + 1);
  versionRow
    .rows()
    .eq(index)
    .within(() => checkRowColumns(versionRow, versionInfo));
}

export function checkScheduledRow(
  versionPage: VersionPageObject,
  versionRow: VersionRowPageObject,
  index: number,
  ...versionInfoFragments: ReadonlyArray<Partial<VersionRowValues>>
) {
  versionPage
    .scheduledVersions()
    .within(() => checkRow(versionRow, index, ...versionInfoFragments));
}

export function checkDraftRow(
  versionPage: VersionPageObject,
  versionRow: VersionRowPageObject,
  index: number,
  ...versionInfoFragments: ReadonlyArray<Partial<VersionRowValues>>
) {
  versionPage
    .draftVersions()
    .within(() => checkRow(versionRow, index, ...versionInfoFragments));
}

export function getTdsByTableColumn<TColumn extends string>(
  versionRow: VersionRowPageObject,
  column: TColumn,
): Chainable<JQuery> {
  switch (column) {
    case 'STATUS':
      return versionRow.status();

    case 'VALIDITY_START':
      return versionRow.validityStart();

    case 'VALIDITY_END':
      return versionRow.validityEnd();

    case 'VERSION_COMMENT':
      return versionRow.versionComment();

    case 'CHANGED':
      return versionRow.changed();

    case 'CHANGED_BY':
      return versionRow.changedBy();

    default:
      throw new Error(`Unknown Table column: ${column}`);
  }
}

// Check whether the table is sorted on a column
export function checkSortedOnColumn<TColumn extends string>(
  versionRow: VersionRowPageObject,
  column: TColumn,
  expectedValues: ReadonlyArray<string | DateTime | null>,
) {
  const rows = versionRow.rows();

  rows.should('have.length', expectedValues.length);

  for (let i = 0; i < expectedValues.length; i += 1) {
    const expectedValue = expectedValues[i];
    versionRow
      .rows()
      .eq(i)
      .within(() =>
        checkColumn(getTdsByTableColumn(versionRow, column), expectedValue),
      );
  }
}

export function checkSortingWorksOnColumnInBothDirections<
  TColumn extends string,
>(
  versionPage: VersionPageObject,
  versionRow: VersionRowPageObject,
  versionTableHeader: VersionTableHeaderPageObject<TColumn>,
  table: 'scheduled' | 'drafts',
  column: TColumn,
  expectedAscendingOrder: ReadonlyArray<string | DateTime | null>,
) {
  (table === 'scheduled'
    ? versionPage.scheduledVersions()
    : versionPage.draftVersions()
  ).within(() => {
    versionTableHeader.setSorting(column, 'ascending');
    checkSortedOnColumn(versionRow, column, expectedAscendingOrder);

    versionTableHeader.setSorting(column, 'descending');
    checkSortedOnColumn(
      versionRow,
      column,
      [...expectedAscendingOrder].reverse(),
    );
  });
}

export function testScheduledVersionsSorting<TColumn extends string>(
  versionPage: VersionPageObject,
  versionRow: VersionRowPageObject,
  versionTableHeader: VersionTableHeaderPageObject<TColumn>,
  column: TColumn,
  expectedAscendingOrder: ReadonlyArray<string | DateTime | null>,
) {
  checkSortingWorksOnColumnInBothDirections(
    versionPage,
    versionRow,
    versionTableHeader,
    'scheduled',
    column,
    expectedAscendingOrder,
  );
}

export function testDraftVersionsSorting<TColumn extends string>(
  versionPage: VersionPageObject,
  versionRow: VersionRowPageObject,
  versionTableHeader: VersionTableHeaderPageObject<TColumn>,
  column: TColumn,
  expectedAscendingOrder: ReadonlyArray<string | DateTime | null>,
) {
  checkSortingWorksOnColumnInBothDirections(
    versionPage,
    versionRow,
    versionTableHeader,
    'drafts',
    column,
    expectedAscendingOrder,
  );
}
