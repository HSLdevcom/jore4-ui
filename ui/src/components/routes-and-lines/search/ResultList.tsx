import {
  LineTableRowFragment,
  RouteAllFieldsFragment,
} from '../../../generated/graphql';
import { DisplayedSearchResultType, useAppSelector } from '../../../hooks';
import { selectExport } from '../../../redux';
import { LinesList } from '../main/LinesList';
import { RoutesList } from '../main/RoutesList';

interface Props {
  lines?: LineTableRowFragment[];
  routes?: RouteAllFieldsFragment[];
  displayedData: DisplayedSearchResultType;
}

/** Depending on displayeData this component will return the
 * corresponding list element
 */
export const ResultList = ({
  lines,
  routes,
  displayedData,
}: Props): JSX.Element => {
  const { isSelecting } = useAppSelector(selectExport);

  switch (displayedData) {
    case DisplayedSearchResultType.Lines:
      return <LinesList lines={lines} isSelecting={isSelecting} />;
    case DisplayedSearchResultType.Routes:
      return <RoutesList routes={routes} isSelecting={isSelecting} />;
    default:
      // eslint-disable-next-line no-console
      console.error(`Error: ${displayedData} does not exist.`);
      return <></>;
  }
};
