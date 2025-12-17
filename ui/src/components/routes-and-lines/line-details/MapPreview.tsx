import { FC } from 'react';
import { twJoin } from 'tailwind-merge';
import { Column } from '../../../layoutComponents';

type MapPreviewProps = {
  readonly className?: string;
};

export const MapPreview: FC<MapPreviewProps> = ({ className }) => {
  return (
    <Column className={twJoin('items-center border', className)}>
      <i className="icon-show-on-map text-9xl" />
    </Column>
  );
};
