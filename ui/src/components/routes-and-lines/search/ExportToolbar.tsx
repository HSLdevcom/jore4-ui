import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useAppDispatch,
  useAppSelector,
  useObservationDateQueryParam,
} from '../../../hooks';
import { Row, Visible } from '../../../layoutComponents';
import {
  LoadingState,
  resetSelectedRowsAction,
  selectExport,
  selectLoader,
  selectRowsAction,
  setIsSelectingRoutesForExportAction,
} from '../../../redux';
import { SimpleButton } from '../../../uiComponents';
import {
  DisplayedSearchResultType,
  isRouteActiveOnObservationDate,
  showDangerToast,
} from '../../../utils';
import { useSearchResults } from '../../common/search/useSearchResults';
import { useExportRoutes } from './useExportRoutes';

const testIds = {
  toggleSelectingButton: 'ExportToolBar::toggleSelectingButton',
  exportSelectedButton: 'ExportToolBar::exportSelectedButton',
};

export const ExportToolbar: FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { observationDate } = useObservationDateQueryParam();

  const { resultCount, resultType, routes, reducedRoutes, lines } =
    useSearchResults();
  const { isSelectingRoutesForExport, selectedRows } =
    useAppSelector(selectExport);
  const { canExport, exportRoutesToHastus, findNotEligibleRoutesForExport } =
    useExportRoutes();
  const { exportRoute: exportRouteLoadingState } = useAppSelector(selectLoader);

  const linesWithRoutes = lines.filter((line) => !!line.line_routes.length);

  const exportData =
    resultType === DisplayedSearchResultType.Routes
      ? {
          resultsByType: reducedRoutes,
          searchResultLabels: reducedRoutes.map((route) => route.unique_label),
          toBeExportedRoutes: routes.filter((route) =>
            selectedRows.includes(route.unique_label),
          ),
        }
      : {
          // Lines without routes are filtered out, since they are not selectable (nothing to export)
          // They are also ignored when determining 'isAllResultsSelected'
          resultsByType: linesWithRoutes,
          searchResultLabels: linesWithRoutes.map((line) => line.label),
          toBeExportedRoutes: lines
            .filter((line) => selectedRows.includes(line.label))
            .flatMap((line) =>
              line.line_routes.filter((route) =>
                isRouteActiveOnObservationDate(route, observationDate),
              ),
            ),
        };

  const isAllResultsSelected =
    selectedRows.length === exportData.resultsByType.length;

  const onSelectAll = () => {
    if (isAllResultsSelected) {
      dispatch(resetSelectedRowsAction());
    } else {
      dispatch(selectRowsAction(exportData.searchResultLabels));
    }
  };

  const toggleIsSelecting = () => {
    dispatch(setIsSelectingRoutesForExportAction(!isSelectingRoutesForExport));
    // We always want to start selection from scratch
    dispatch(resetSelectedRowsAction());
  };

  const exportRoutes = async () => {
    const notEligibleRoutes = findNotEligibleRoutesForExport(
      exportData.toBeExportedRoutes,
    );

    if (!notEligibleRoutes.length) {
      await exportRoutesToHastus(
        exportData.toBeExportedRoutes.map((route) => route.unique_label),
      );
    } else {
      showDangerToast(
        t('export.notEligibleRoutesForExport', {
          routes: notEligibleRoutes.join(', '),
        }),
      );
    }
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
      <SimpleButton
        shape="compact"
        inverted={isSelectingRoutesForExport}
        onClick={toggleIsSelecting}
        testId={testIds.toggleSelectingButton}
      >
        {t(
          isSelectingRoutesForExport
            ? 'export.quitSelecting'
            : 'export.startSelecting',
        )}
      </SimpleButton>
      <Visible visible={isSelectingRoutesForExport}>
        <SimpleButton
          shape="compact"
          inverted
          disabled={
            !canExport ||
            !selectedRows.length ||
            exportRouteLoadingState !== LoadingState.NotLoading
          }
          onClick={exportRoutes}
          testId={testIds.exportSelectedButton}
          tooltip={t('export.tooltip')}
          disabledTooltip={t('export.disabledTooltip')}
        >
          {t('export.exportSelected')}
        </SimpleButton>
      </Visible>
    </Row>
  );
};
