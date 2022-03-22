import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearch } from '../../../../hooks/search';
import { SimpleSmallButton } from '../../../../uiComponents';

export const ResultSelector = (): JSX.Element => {
  const { t } = useTranslation();
  const { queryParameters, setFilter } = useSearch();
  const { displayRoutes } = queryParameters.filter;

  return (
    <div>
      <SimpleSmallButton
        label={t('lines.lines')}
        inverted={displayRoutes}
        onClick={() => setFilter('displayRoutes', !displayRoutes)}
      />
      <SimpleSmallButton
        label={t('lines.routes')}
        onClick={() => setFilter('displayRoutes', !displayRoutes)}
        inverted={!displayRoutes}
      />
    </div>
  );
};
