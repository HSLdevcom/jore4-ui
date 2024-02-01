import { ScheduledStopPointDefaultFieldsFragment } from '../../../../generated/graphql';

interface Props {
  stopDetails: ScheduledStopPointDefaultFieldsFragment;
}

export const StopTitleRow: React.FC<Props> = ({ stopDetails }) => {
  return (
    <div className="flex items-center">
      <i className="icon-bus-alt mr-2 text-3xl text-tweaked-brand" />
      <h2 className="mr-2 font-bold">{stopDetails.label}</h2>
      <div className="text-xl">
        <span>Pohjoisesplanadi{/* TODO */}</span>
        <span className="mx-2">|</span>
        <span>Norra Esplanaden{/* TODO */}</span>
      </div>
    </div>
  );
};
