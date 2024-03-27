import { Visible } from '../../../../layoutComponents';

interface Props {
  hasType: boolean;
  text: string;
}

export const StopTypeBox: React.FC<Props> = ({ hasType, text }) => {
  return (
    <Visible visible={hasType}>
      <div className="rounded border border-tweaked-brand py-0.5 px-5 text-center text-sm leading-normal">
        {text}
      </div>
    </Visible>
  );
};
