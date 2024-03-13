import { StopWithDetails } from '../../../../hooks';

interface Props {
  stopDetails: StopWithDetails;
}

const testIds = {
  label: 'StopTitleRow::label',
  names: 'StopTitleRow::names',
};

export const StopTitleRow: React.FC<Props> = ({ stopDetails }) => {
  return (
    <div className="flex items-center">
      <i className="icon-bus-alt mr-2 text-3xl text-tweaked-brand" />
      <h2 className="mr-2 font-bold" data-testid={testIds.label}>
        {stopDetails.label}
      </h2>
      <div className="text-xl" data-testid={testIds.names}>
        <span>{stopDetails.stop_place?.nameFin || '-'}</span>
        <span className="mx-2">|</span>
        <span>{stopDetails.stop_place?.nameSwe || '-'}</span>
      </div>
    </div>
  );
};
