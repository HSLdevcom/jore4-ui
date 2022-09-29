import { useTranslation } from 'react-i18next';
import {
  DisplayedSearchResultType,
  useAppDispatch,
  useSearch,
} from '../../../../hooks';
import { resetSelectedRoutesAction } from '../../../../redux';
import { SimpleSmallButton } from '../../../../uiComponents';

export const ResultSelector = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { queryParameters, setFilter } = useSearch();
  const { displayedData } = queryParameters.filter;

  const displayRoutes = () => {
    dispatch(resetSelectedRoutesAction());
    setFilter('displayedData', DisplayedSearchResultType.Routes);
  };
  const displayLines = () =>
    setFilter('displayedData', DisplayedSearchResultType.Lines);
  return (
    <div>
      <SimpleSmallButton
        inverted={displayedData !== DisplayedSearchResultType.Lines}
        onClick={displayLines}
        label={t('lines.lines')}
        className="mr-2"
      />
      <SimpleSmallButton
        onClick={displayRoutes}
        inverted={displayedData !== DisplayedSearchResultType.Routes}
        label={t('lines.routes')}
        className="mr-2"
      />
    </div>
  );
};
