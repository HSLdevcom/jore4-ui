import { Visible } from '../../../../layoutComponents';

type StopTypeLabelProps = {
  readonly hasType: boolean;
  readonly text: string;
};

export const StopTypeLabel: React.FC<StopTypeLabelProps> = ({
  hasType,
  text,
}) => {
  return (
    <Visible visible={hasType}>
      <div className="text-center text-sm leading-normal text-dark-grey">
        {text}
      </div>
    </Visible>
  );
};
