import {
  LineTableRowFragment,
  RouteAllFieldsFragment,
} from '../../../generated/graphql';
import { DisplayedSearchResultType } from '../../../hooks';
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
  switch (displayedData) {
    case DisplayedSearchResultType.Lines:
      return <LinesList lines={lines} />;
    case DisplayedSearchResultType.Routes:
      return <RoutesList routes={routes} />;
    default:
      // eslint-disable-next-line no-console
      console.error(`Error: ${displayedData} does not exist.`);
      return <></>;
  }
};
