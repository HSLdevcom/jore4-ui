import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearch } from '../../../../hooks';
import { SimpleSmallButton } from '../../../../uiComponents';

export const ResultSelector = (): JSX.Element => {
  const { t } = useTranslation();
  const { queryParameters, setFilter } = useSearch();
  const { displayRoutes } = queryParameters.filter;

  const toggleDisplayRoutes = () => setFilter('displayRoutes', !displayRoutes);

  return (
    <div>
      <SimpleSmallButton
        inverted={displayRoutes}
        onClick={toggleDisplayRoutes}
        label={t('lines.lines')}
      />
      <SimpleSmallButton
        onClick={toggleDisplayRoutes}
        inverted={!displayRoutes}
        label={t('lines.routes')}
      />
    </div>
  );
};
