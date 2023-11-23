import {
  LineTableRowFragment,
  RouteTableRowFragment,
} from '../../../generated/graphql';
import { useAppSelector } from '../../../hooks';
import { selectExport } from '../../../redux';
import { DisplayedSearchResultType } from '../../../utils';
import { RouteLineTableRowVariant } from '../RouteLineTableRow';
import { LinesList } from './LinesList';
import { RoutesList } from './RoutesList';

interface Props {
  lines?: LineTableRowFragment[];
  routes?: RouteTableRowFragment[];
  displayedType: DisplayedSearchResultType;
  rowVariant: RouteLineTableRowVariant;
  selectedAlert?: unknown;
  setSelectedAlert: (selectedAlert: unknown | undefined) => void;
}

/** Depending on displayedType this component will return the
 * corresponding list element
 */
export const ResultList = ({
  lines,
  routes,
  displayedType,
  rowVariant,
  selectedAlert,
  setSelectedAlert,
}: Props): JSX.Element => {
  const { isSelectingRoutesForExport } = useAppSelector(selectExport);

  switch (displayedType) {
    case DisplayedSearchResultType.Lines:
      return (
        <LinesList
          lines={lines}
          rowVariant={rowVariant}
          areItemsSelectable={isSelectingRoutesForExport}
          selectedAlert={selectedAlert}
          setSelectedAlert={setSelectedAlert}
        />
      );
    case DisplayedSearchResultType.Routes:
      return (
        <RoutesList
          rowVariant={rowVariant}
          routes={routes}
          areItemsSelectable={isSelectingRoutesForExport}
          selectedAlert={selectedAlert}
          setSelectedAlert={setSelectedAlert}
        />
      );
    default:
      // eslint-disable-next-line no-console
      console.error(`Error: ${displayedType} does not exist.`);
      return <></>;
  }
};
