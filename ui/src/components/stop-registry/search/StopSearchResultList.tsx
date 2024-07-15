import { StopSearchRow } from '../../../hooks';
import { StopTableRow } from './StopTableRow';

interface Props {
  stops: Array<StopSearchRow>;
}

const testIds = {
  table: 'StopSearchResultList::table',
};

export const StopSearchResultList = ({ stops }: Props): React.ReactElement => {
  return (
    <table
      className="h-1 w-full border-x border-x-light-grey"
      data-testid={testIds.table}
    >
      <tbody>
        {stops?.map((item: StopSearchRow) => (
          <StopTableRow key={item.scheduled_stop_point_id} stop={item} />
        ))}
      </tbody>
    </table>
  );
};
