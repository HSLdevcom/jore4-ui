import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SearchQueryParameterNames,
  useAppDispatch,
  useSearch,
} from '../../../hooks';
import { resetSelectedRowsAction } from '../../../redux';
import { SimpleSmallButton } from '../../../uiComponents';
import { DisplayedSearchResultType } from '../../../utils';

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
    <div className="space-x-2">
      <SimpleSmallButton
        inverted={displayedType !== DisplayedSearchResultType.Lines}
        onClick={displayLines}
        label={t('lines.lines')}
        testId={testIds.linesResultsButton}
      />
      <SimpleSmallButton
        onClick={displayRoutes}
        inverted={displayedType !== DisplayedSearchResultType.Routes}
        label={t('lines.routes')}
        testId={testIds.routesResultsButton}
      />
    </div>
  );
};
