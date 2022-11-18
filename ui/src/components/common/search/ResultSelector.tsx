import { useTranslation } from 'react-i18next';
import { useAppDispatch, useSearch } from '../../../hooks';
import { resetSelectedRoutesAction } from '../../../redux';
import { SimpleSmallButton } from '../../../uiComponents';
import { DisplayedSearchResultType } from '../../../utils';

export const ResultSelector = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { queryParameters, setFilter } = useSearch();
  const { displayedData } = queryParameters.filter;

  const displayRoutes = () => {
    dispatch(resetSelectedRoutesAction());
    setFilter('displayedData', DisplayedSearchResultType.Routes);
  };
  const displayLines = () => {
    dispatch(resetSelectedRoutesAction());
    setFilter('displayedData', DisplayedSearchResultType.Lines);
  };
  const testIds = {
    linesResultsButton: 'ResultSelector::lines',
    routesResultsButton: 'ResultSelector::routes',
  };

  return (
    <div className="space-x-2">
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
