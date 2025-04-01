import { FC } from 'react';
import { InfoSpotDetailsFragment } from '../../../../../generated/graphql';
import { Point } from '../../../../../types';
import { InfoSpotsViewCard } from './InfoSpotsViewCard';

type Props = {
  infoSpots: ReadonlyArray<InfoSpotDetailsFragment>;
  location: Point;
  stopName: string;
};

export const InfoSpotsViewList: FC<Props> = ({
  infoSpots,
  location,
  stopName,
}) => {
  return (
    <>
      {infoSpots.map((infoSpot) => (
        <div key={infoSpot.id}>
          <InfoSpotsViewCard
            infoSpot={infoSpot}
            location={location}
            stopName={stopName}
          />
        </div>
      ))}
    </>
  );
};
