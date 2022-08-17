import { LineTableRowFragment } from '../../../generated/graphql';
import { LineTableRow } from './LineTableRow';
import { RoutesTable } from './RoutesTable';

type Props = {
  lines?: LineTableRowFragment[];
};

export const LinesList = ({ lines }: Props): JSX.Element => (
  <RoutesTable>
    {lines?.map((item: LineTableRowFragment) => (
      <LineTableRow key={item.line_id} line={item} />
    ))}
  </RoutesTable>
);
