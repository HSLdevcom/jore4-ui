import { useTranslation } from 'react-i18next';
import {
  SearchQueryParameterNames,
  useAppDispatch,
  useSearch,
} from '../../../hooks';
import { resetSelectedRoutesAction } from '../../../redux';
import { SimpleSmallButton } from '../../../uiComponents';
import { DisplayedSearchResultType } from '../../../utils';

export const ResultSelector = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { queryParameters, setFilter } = useSearch();
  const { displayedType } = queryParameters.filter;

  const displayRoutes = () => {
    dispatch(resetSelectedRoutesAction());
    setFilter(
      SearchQueryParameterNames.DisplayedType,
      DisplayedSearchResultType.Routes,
    );
  };
  const displayLines = () => {
    dispatch(resetSelectedRoutesAction());
    setFilter(
      SearchQueryParameterNames.DisplayedType,
      DisplayedSearchResultType.Lines,
    );
  };
  const testIds = {
    linesResultsButton: 'ResultSelector::lines',
    routesResultsButton: 'ResultSelector::routes',
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
