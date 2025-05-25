import { FC } from 'react';
import { Visible } from '../../layoutComponents';

type RouteLabelProps = {
  readonly label: string;
  readonly variant?: number | null;
};

export const RouteLabel: FC<RouteLabelProps> = ({ label, variant }) => {
  return (
    <>
      <b>{label}</b>
      <Visible visible={!!variant}>
        <span className="font-normal"> {variant}</span>
      </Visible>
    </>
  );
};
