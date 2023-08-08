import { Visible } from '../../layoutComponents';

interface Props {
  label: string;
  variant?: number | null;
}

export const RouteLabel = ({ label, variant }: Props) => {
  return (
    <>
      <b>{label}</b>
      <Visible visible={!!variant}>
        <span className="font-normal"> {variant}</span>
      </Visible>
    </>
  );
};
