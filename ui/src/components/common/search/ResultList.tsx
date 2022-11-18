import {
  LineTableRowFragment,
  RouteTableRowFragment,
} from '../../../generated/graphql';
import { useAppSelector } from '../../../hooks';
import { selectExport } from '../../../redux';
import { DisplayedSearchResultType } from '../../../utils';
import { LinesList } from './LinesList';
import { RoutesList } from './RoutesList';

interface Props {
  lines?: LineTableRowFragment[];
  routes?: RouteTableRowFragment[];
  displayedData: DisplayedSearchResultType;
}

/** Depending on displayedData this component will return the
 * corresponding list element
 */
export const ResultList = ({
  lines,
  routes,
  displayedData,
}: Props): JSX.Element => {
  const { isSelectingRoutesForExport } = useAppSelector(selectExport);

  switch (displayedData) {
    case DisplayedSearchResultType.Lines:
      return (
        <LinesList
          lines={lines}
          areItemsSelectable={isSelectingRoutesForExport}
        />
      );
    case DisplayedSearchResultType.Routes:
      return (
        <RoutesList
          routes={routes}
          areItemsSelectable={isSelectingRoutesForExport}
        />
      );
    default:
      // eslint-disable-next-line no-console
      console.error(`Error: ${displayedData} does not exist.`);
      return <></>;
  }
};
