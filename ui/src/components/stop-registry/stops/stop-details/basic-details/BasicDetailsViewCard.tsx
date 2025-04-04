import { StopWithDetails } from '../../../../../types';
import { StopAreaDetailsSection } from './BasicDetailsStopAreaFields';
import { StopDetailsSection } from './BasicDetailsStopFields';

type Props = {
  readonly stop: StopWithDetails;
};

export const BasicDetailsViewCard = ({ stop }: Props) => {
  return (
    <>
      <StopAreaDetailsSection stop={stop} />
      <StopDetailsSection stop={stop} />
    </>
  );
};
