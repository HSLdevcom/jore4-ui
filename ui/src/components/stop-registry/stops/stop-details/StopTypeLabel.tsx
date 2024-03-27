import { Visible } from '../../../../layoutComponents';

interface Props {
  hasType: boolean;
  text: string;
}

export const StopTypeLabel: React.FC<Props> = ({ hasType, text }) => {
  return (
    <Visible visible={hasType}>
      <div className="text-center text-sm leading-normal text-dark-grey">
        {text}
      </div>
    </Visible>
  );
};
