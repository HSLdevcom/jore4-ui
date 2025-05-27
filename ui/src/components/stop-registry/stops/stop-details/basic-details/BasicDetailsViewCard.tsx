import { FC } from 'react';
import { StopWithDetails } from '../../../../../types';
import { StopAreaDetailsSection } from './BasicDetailsStopAreaFields';
import { StopDetailsSection } from './BasicDetailsStopFields';

type BasicDetailsViewCardProps = {
  readonly stop: StopWithDetails;
};

export const BasicDetailsViewCard: FC<BasicDetailsViewCardProps> = ({
  stop,
}) => {
  return (
    <>
      <StopAreaDetailsSection stop={stop} />
      <StopDetailsSection stop={stop} />
    </>
  );
};
