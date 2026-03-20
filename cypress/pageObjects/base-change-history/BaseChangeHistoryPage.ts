import { createSimplePageObject } from '../createSimplePageObject';

export const BaseChangeHistoryPage = createSimplePageObject(
  'ChangeHistoryPage',
  [
    // DateRangeFilter
    'ChangeHistoryPage::DateFilter::FromDate',
    'ChangeHistoryPage::DateFilter::ToDate',

    // FailedToLoadChangeHistory
    'ChangeHistoryPage::FailedToLoad',
    'ChangeHistoryPage::RetryButton',

    // LoadingChangeHistory
    'ChangeHistoryPage::Loading',
  ],
);
