import { StopWithDetails } from '../../../../hooks';

interface Props {
  stopDetails: StopWithDetails;
}

export const StopTitleRow: React.FC<Props> = ({ stopDetails }) => {
  return (
    <div className="flex items-center">
      <i className="icon-bus-alt mr-2 text-3xl text-tweaked-brand" />
      <h2 className="mr-2 font-bold">{stopDetails.label}</h2>
      <div className="text-xl">
        <span>{stopDetails.stopPlace?.finnishName || '-'}</span>
        <span className="mx-2">|</span>
        <span>{stopDetails.stopPlace?.swedishName || '-'}</span>
      </div>
    </div>
  );
};
