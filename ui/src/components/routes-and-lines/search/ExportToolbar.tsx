import isEqual from 'lodash/isEqual';
import uniq from 'lodash/uniq';
import { useTranslation } from 'react-i18next';
import { pipe } from 'remeda';
import {
  useAppDispatch,
  useAppSelector,
  useExportRoutes,
  useSearchResults,
} from '../../../hooks';
import { Row, Visible } from '../../../layoutComponents';
import {
  resetSelectedRoutesAction,
  selectExport,
  selectRouteLabelsAction,
  setIsSelectingRoutesForExportAction,
} from '../../../redux';
import { SimpleSmallButton } from '../../../uiComponents';
import { DisplayedSearchResultType } from '../../../utils';

export const ExportToolbar = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { resultCount, resultType, routes, lines } = useSearchResults();
  const { isSelectingRoutesForExport, selectedRouteLabels } =
    useAppSelector(selectExport);
  const { canExport, exportRoutesToHastus } = useExportRoutes();

  const searchResultRouteLabels = pipe(
    resultType === DisplayedSearchResultType.Routes
      ? routes.map((route) => route.label)
      : lines.flatMap((line) => line.line_routes.map((route) => route.label)),
    uniq,
  );

  const isAllResultsSelected = isEqual(
    [...selectedRouteLabels].sort(),
    [...searchResultRouteLabels].sort(),
  );

  const onSelectAll = () => {
    if (isAllResultsSelected) {
      dispatch(resetSelectedRoutesAction());
    } else {
      dispatch(selectRouteLabelsAction(searchResultRouteLabels));
    }
  };

  const toggleIsSelecting = () => {
    dispatch(setIsSelectingRoutesForExportAction(!isSelectingRoutesForExport));
    // We always want to start selection from scratch
    dispatch(resetSelectedRoutesAction());
  };

  // If no route is selected, export all routes in search results by default
  const isExportingAllSearchResults = selectedRouteLabels.length === 0;

  const exportRoutes = () => {
    exportRoutesToHastus(
      // If we are "exporting all", export all routes in search results
      isExportingAllSearchResults
        ? searchResultRouteLabels
        : selectedRouteLabels,
    );
  };

  return (
    <Row className="items-center gap-3">
      <Visible visible={isSelectingRoutesForExport}>
        <input
          type="checkbox"
          className="h-7 w-7"
          checked={isAllResultsSelected}
          onChange={onSelectAll}
        />
      </Visible>
      <h2 className="my-4 ml-2">
        {t('search.resultCount', {
          resultCount,
        })}
      </h2>
      <SimpleSmallButton
        inverted={isSelectingRoutesForExport}
        onClick={toggleIsSelecting}
        label={t(
          isSelectingRoutesForExport
            ? 'export.quitSelecting'
            : 'export.startSelecting',
        )}
        className="w-auto rounded-full px-4"
      />
      <Visible visible={isSelectingRoutesForExport}>
        <SimpleSmallButton
          inverted
          disabled={!canExport}
          onClick={exportRoutes}
          label={t(
            isExportingAllSearchResults
              ? 'export.exportAll'
              : 'export.exportSelected',
          )}
          className="w-auto rounded-full px-4"
        />
      </Visible>
    </Row>
  );
};
