import { FC } from 'react';
import { InfoSpotDetailsFragment } from '../../../../../generated/graphql';
import { Point } from '../../../../../types';
import { InfoSpotsViewCard } from './InfoSpotsViewCard';

type InfoSpotsViewListProps = {
  readonly infoSpots: ReadonlyArray<InfoSpotDetailsFragment>;
  readonly location: Point;
  readonly stopName: string;
};

export const InfoSpotsViewList: FC<InfoSpotsViewListProps> = ({
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
