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
    <div className={`rounded-md bg-white ${className}`}>
      <div className={`${bg} ${border} rounded-md border`}>
        <Row className="my-6 ml-16 mr-12 items-center">
          <i className={icon} />
          <p className={`${textColor} ml-2 text-sm`}>{message}</p>
        </Row>
      </div>
    </div>
  );
};
