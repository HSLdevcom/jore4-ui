import { StopSearchRow } from '../../../hooks';
import { StopTableRow } from './StopTableRow';
import { LocatorActionButton } from './StopTableRow/ActionButtons/LocatorActionButton';
import { OpenDetailsPage } from './StopTableRow/MenuItems/OpenDetailsPage';
import { ShowOnMap } from './StopTableRow/MenuItems/ShowOnMap';

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
        {stops?.map((stop: StopSearchRow) => (
          <StopTableRow
            key={stop.scheduled_stop_point_id}
            actionButtons={<LocatorActionButton stop={stop} />}
            menuItems={[
              <ShowOnMap key="showOnMap" stop={stop} />,
              <OpenDetailsPage key="openDetails" stop={stop} />,
            ]}
            stop={stop}
          />
        ))}
      </tbody>
    </table>
  );
};
