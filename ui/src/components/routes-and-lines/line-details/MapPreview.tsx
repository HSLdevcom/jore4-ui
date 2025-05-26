import React from 'react';
import { Column } from '../../../layoutComponents';

type MapPreviewProps = {
  readonly className?: string;
};

export const MapPreview: React.FC<MapPreviewProps> = ({ className = '' }) => {
  return (
    <Column className={`border ${className} items-center`}>
      <i className="icon-show-on-map text-9xl" />
    </Column>
  );
};
