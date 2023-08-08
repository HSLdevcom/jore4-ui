import { Visible } from '../../layoutComponents';

interface Props {
  label: string;
  variant: number | null | undefined; // TODO: Is variant REALLY ever empty? Fix during PR
}

export const RouteLabel = ({ label, variant }: Props) => {
  return (
    <>
      <b>{label}</b>
      <Visible visible={Number.isInteger(variant)}>
        <span className="font-normal"> {variant}</span>
      </Visible>
    </>
  );
};
