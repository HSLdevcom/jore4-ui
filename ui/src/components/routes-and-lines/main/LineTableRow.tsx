import { gql } from '@apollo/client';
import { LineTableRowFragment } from '../../../generated/graphql';
import { useShowRoutesOnModal } from '../../../hooks';
import { RouteLineTableRow } from './RouteLineTableRow';

interface Props {
  className?: string;
  line: LineTableRowFragment;
}

const GQL_LINE_TABLE_ROW = gql`
  fragment line_table_row on route_line {
    ...line_all_fields
    line_routes {
      ...route_information_for_map
    }
  }
`;

export const LineTableRow = ({ className = '', line }: Props): JSX.Element => {
  const { showRouteOnMapByLineLabel } = useShowRoutesOnModal();

  const showLineRoutes = () => {
    showRouteOnMapByLineLabel(line);
  };

  return (
    <RouteLineTableRow
      rowItem={line}
      lineId={line.line_id}
      onLocatorButtonClick={showLineRoutes}
      locatorButtonTestId="LineTableRow::showLineRoutes"
      className={className}
    />
  );
};
