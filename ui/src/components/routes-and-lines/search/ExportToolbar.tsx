import isEqual from 'lodash/isEqual';
import uniq from 'lodash/uniq';
import { useTranslation } from 'react-i18next';
import { pipe } from 'remeda';
import {
  DisplayedSearchResultType,
  useAppDispatch,
  useAppSelector,
  useSearchResults,
} from '../../../hooks';
import { Row, Visible } from '../../../layoutComponents';
import {
  resetSelectedRoutesAction,
  selectExport,
  selectRouteLabelsAction,
  setIsSelectingAction,
} from '../../../redux';
import { SimpleSmallButton } from '../../../uiComponents';

export const ExportToolbar = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { resultCount, resultType, routes, lines } = useSearchResults();
  const { isSelecting, selectedRouteLabels } = useAppSelector(selectExport);

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
    dispatch(setIsSelectingAction(!isSelecting));
    dispatch(resetSelectedRoutesAction());
  };

  return (
    <Row className="items-center gap-3">
      <Visible visible={isSelecting}>
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
        inverted={isSelecting}
        onClick={toggleIsSelecting}
        label={t(`export.${isSelecting ? 'quitSelecting' : 'startSelecting'}`)}
        className="w-auto rounded-full px-4"
      />
    </Row>
  );
};
