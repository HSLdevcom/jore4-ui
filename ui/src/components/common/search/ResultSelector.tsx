import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../../hooks';
import { resetSelectedRowsAction } from '../../../redux';
import { SimpleButton } from '../../../uiComponents';
import { DisplayedSearchResultType } from '../../../utils';
import { useSearch } from './useSearch';
import { SearchQueryParameterNames } from './useSearchQueryParser';

const testIds = {
  linesResultsButton: 'ResultSelector::lines',
  routesResultsButton: 'ResultSelector::routes',
};

export const ResultSelector: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { queryParameters, setFilter } = useSearch();
  const { displayedType } = queryParameters.filter;

  const displayRoutes = () => {
    dispatch(resetSelectedRowsAction());
    setFilter(
      SearchQueryParameterNames.DisplayedType,
      DisplayedSearchResultType.Routes,
    );
  };
  const displayLines = () => {
    dispatch(resetSelectedRowsAction());
    setFilter(
      SearchQueryParameterNames.DisplayedType,
      DisplayedSearchResultType.Lines,
    );
  };

  return (
    <div className="flex gap-2">
      <SimpleButton
        shape="compact"
        inverted={displayedType !== DisplayedSearchResultType.Lines}
        onClick={displayLines}
        testId={testIds.linesResultsButton}
      >
        {t('lines.lines')}
      </SimpleButton>
      <SimpleButton
        shape="compact"
        onClick={displayRoutes}
        inverted={displayedType !== DisplayedSearchResultType.Routes}
        testId={testIds.routesResultsButton}
      >
        {t('lines.routes')}
      </SimpleButton>
    </div>
  );
};
