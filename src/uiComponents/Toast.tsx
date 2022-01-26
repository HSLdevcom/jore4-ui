import React from 'react';
import { Row } from '../layoutComponents';

export type ToastType = 'primary' | 'success' | 'danger';

interface Props {
  message: string;
  type?: ToastType;
  className?: string;
}

const propsByType: Record<
  ToastType,
  { icon: string; textColor: string; bg: string; border: string }
> = {
  primary: {
    icon: 'icon-info text-white text-3xl',
    textColor: 'text-white',
    bg: 'bg-tweaked-brand',
    border: 'border-tweaked-brand',
  },
  success: {
    icon: 'icon-check-circle text-hsl-dark-green text-3xl',
    textColor: 'text-black',
    bg: 'bg-hsl-dark-green bg-opacity-25',
    border: 'border-hsl-dark-green',
  },
  danger: {
    icon: 'icon-alert-filled text-hsl-red text-3xl',
    textColor: 'text-black',
    bg: 'bg-hsl-red bg-opacity-25',
    border: ' border-hsl-red',
  },
};

export const Toast = ({
  message,
  type = 'primary',
  className,
}: Props): JSX.Element => {
  const { icon, textColor, bg, border } = propsByType[type];
  return (
    <div className={`bg-white rounded-md ${className}`}>
      <div className={`${bg} ${border} border rounded-md`}>
        <Row className="items-center ml-16 mr-12 my-6">
          <i className={icon} />
          <p className={`${textColor} text-sm ml-2`}>{message}</p>
        </Row>
      </div>
    </div>
  );
};
