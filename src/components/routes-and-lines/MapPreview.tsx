import React from 'react';
import { Column } from '../../layoutComponents';

interface Props {
  className?: string;
}

export const MapPreview: React.FC<Props> = ({ className }) => {
  return (
    <Column className={`border ${className} items-center`}>
      <i className="icon-show-on-map text-9xl" />
    </Column>
  );
};
