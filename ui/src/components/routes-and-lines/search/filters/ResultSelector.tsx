import React from 'react';
import { useTranslation } from 'react-i18next';
import { DisplayedSearchResultType, useSearch } from '../../../../hooks';
import { SimpleSmallButton } from '../../../../uiComponents';

export const ResultSelector = (): JSX.Element => {
  const { t } = useTranslation();
  const { queryParameters, setFilter } = useSearch();
  const { displayedData } = queryParameters.filter;

  const displayRoutes = () =>
    setFilter('displayedData', DisplayedSearchResultType.Routes);
  const displayLines = () =>
    setFilter('displayedData', DisplayedSearchResultType.Lines);

  const testIds = {
    linesResultsButton: 'ResultSelector::lines',
    routesResultsButton: 'ResultSelector::routes',
  };

  return (
    <div>
      <SimpleSmallButton
        inverted={displayedData !== DisplayedSearchResultType.Lines}
        onClick={displayLines}
        label={t('lines.lines')}
        testId={testIds.linesResultsButton}
      />
      <SimpleSmallButton
        onClick={displayRoutes}
        inverted={displayedData !== DisplayedSearchResultType.Routes}
        label={t('lines.routes')}
        testId={testIds.routesResultsButton}
      />
    </div>
  );
};
