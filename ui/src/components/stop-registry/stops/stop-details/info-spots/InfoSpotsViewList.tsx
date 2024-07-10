import { Position } from 'geojson';
import { InfoSpotDetailsFragment } from '../../../../../generated/graphql';
import { HorizontalSeparator, Visible } from '../../../../../layoutComponents';
import { InfoSpotsViewCard } from './InfoSpotsViewCard';

interface Props {
  infoSpots: Array<InfoSpotDetailsFragment>;
  location: Position;
  stopName: string;
}

export const InfoSpotsViewList = ({
  infoSpots,
  location,
  stopName,
}: Props): JSX.Element => {
  return (
    <div>
      {infoSpots.map((infoSpot, idx) => (
        <div key={infoSpot.id}>
          <InfoSpotsViewCard
            infoSpot={infoSpot}
            location={location}
            stopName={stopName}
          />
          <Visible visible={idx !== infoSpots.length - 1}>
            <HorizontalSeparator className="-ml-5 -mr-5 mb-4 mt-0 border-[--borderColor]" />
            <HorizontalSeparator className="-ml-5 -mr-5 mb-0 mt-4 border-[--borderColor]" />
          </Visible>
        </div>
      ))}
    </div>
  );
};
