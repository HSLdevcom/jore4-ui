import { createSimplePageObject } from '../createSimplePageObject';

export const BaseChangeHistoryTable = createSimplePageObject(
  'ChangeHistory',
  [
    // Shared generic component getters
    // ChangeHistoryTable
    'ChangeHistory::Table',
    'ChangeHistory::Heading::Name',
    'ChangeHistory::Heading::OldValue',
    'ChangeHistory::Heading::NewValue',
    'ChangeHistory::Heading::ValidityStart',
    'ChangeHistory::Heading::ValidityEnd',
    'ChangeHistory::Heading::ValidityCombined',
    'ChangeHistory::Heading::Changed',
    'ChangeHistory::Heading::ChangedBy',
    'ChangeHistory::Heading::ChangedCombined',

    // SortByButton(s)
    'ChangeHistory::SortByButton::ValidityStart',
    'ChangeHistory::SortByButton::ValidityEnd',
    'ChangeHistory::SortByButton::Changed',
    'ChangeHistory::SortByButton::ChangedBy',

    // ChangeHistoryItemSectionHeaderRow
    'ChangeHistory::SectionHeader::Title',
    'ChangeHistory::SectionHeader::ValidityStart',
    'ChangeHistory::SectionHeader::ValidityEnd',
    'ChangeHistory::SectionHeader::ValidityCombined',
    'ChangeHistory::SectionHeader::ChangedBy',
    'ChangeHistory::SectionHeader::Changed',
    'ChangeHistory::SectionHeader::ChangedCombined',

    // ChangedValueRow
    'ChangeHistory::ChangedValues::Name',
    'ChangeHistory::ChangedValues::OldValue',
    'ChangeHistory::ChangedValues::NewValue',
  ],
  (base) => ({
    ...base,
    sectionHeader: {
      ...base.sectionHeader,
      getAll: () => cy.get('tr[data-testid^="ChangeHistory::SectionHeader::"]'),
    },
    group: {
      getAllGroupElements: () =>
        cy.get('[data-testid^="ChangeHistory::Group::"]'),
      getGroup: (id: string) => cy.getByTestId(`ChangeHistory::Group::${id}`),
    },
  }),
);
