import { FC } from 'react';
import { InfoSpotDetailsFragment } from '../../../../../generated/graphql';
import { HorizontalSeparator, Visible } from '../../../../../layoutComponents';
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
    </>
  );
};
