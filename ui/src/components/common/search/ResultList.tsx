import { FC } from 'react';
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

type ResultListProps = {
  readonly lines?: ReadonlyArray<LineTableRowFragment>;
  readonly routes?: ReadonlyArray<RouteTableRowFragment>;
  readonly displayedType: DisplayedSearchResultType;
  readonly rowVariant: RouteLineTableRowVariant;
};

/** Depending on displayedType this component will return the
 * corresponding list element
 */
export const ResultList: FC<ResultListProps> = ({
  lines,
  routes,
  displayedType,
  rowVariant,
}) => {
  const { isSelectingRoutesForExport } = useAppSelector(selectExport);

  switch (displayedType) {
    case DisplayedSearchResultType.Lines:
      return (
        <LinesList
          lines={lines}
          rowVariant={rowVariant}
          areItemsSelectable={isSelectingRoutesForExport}
        />
      );
    case DisplayedSearchResultType.Routes:
      return (
        <RoutesList
          rowVariant={rowVariant}
          routes={routes}
          areItemsSelectable={isSelectingRoutesForExport}
        />
      );
    default:
      // eslint-disable-next-line no-console
      console.error(`Error: ${displayedType} does not exist.`);
      return null;
  }
};
