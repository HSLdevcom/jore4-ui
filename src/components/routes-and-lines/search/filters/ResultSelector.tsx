import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearch } from '../../../../hooks/search/useSearch';
import { SimpleButton } from '../../../../uiComponents';

export const ResultSelector = () => {
  const { t } = useTranslation();
  const { queryParameters, setFilter } = useSearch();
  const { displayRoutes } = queryParameters.filter;

  const getToggleClassName = (selected: boolean) =>
    selected
      ? 'mr-2 w-20 !rounded  !px-0 !py-0 !text-sm !font-light'
      : 'mr-2 w-20 !rounded  border-light-grey !px-0 !py-0 !text-sm !font-light text-gray-900';

  return (
    <>
      <SimpleButton
        inverted={displayRoutes}
        onClick={() => setFilter('displayRoutes', !displayRoutes)}
        className={getToggleClassName(!displayRoutes)}
      >
        {t('lines.lines')}
      </SimpleButton>
      <SimpleButton
        inverted={!displayRoutes}
        onClick={() => setFilter('displayRoutes', !displayRoutes)}
        className={getToggleClassName(displayRoutes)}
      >
        {t('lines.routes')}
      </SimpleButton>
    </>
  );
};
