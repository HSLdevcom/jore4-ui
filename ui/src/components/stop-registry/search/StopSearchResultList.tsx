import { EnrichedStopTableRow } from '../../../hooks';
import { StopTableRow } from './StopTableRow';

interface Props {
  stops: Array<EnrichedStopTableRow>;
}

const testIds = {
  table: 'StopSearchResultList::table',
};

export const StopSearchResultList = ({ stops }: Props): JSX.Element => {
  return (
    <table
      className="h-1 w-full border-x border-x-light-grey"
      data-testid={testIds.table}
    >
      {/* <div>Stops: {stops.length},  {JSON.stringify(stops, null, 2)}</div> */}
      <tbody>
        {stops?.map((item: EnrichedStopTableRow) => (
          <StopTableRow key={item.scheduled_stop_point_id} stop={item} />
        ))}
      </tbody>
    </table>
  );
};
