import { ForwardRefRenderFunction, ReactNode, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { Row } from '../layoutComponents';

export type ToastType = 'primary' | 'success' | 'danger' | 'warning';

type ToastProps = {
  readonly className?: string;
  readonly message: ReactNode;
  readonly type?: ToastType;
};

const propsByType: Record<
  ToastType,
  {
    icon: string;
    textColor: string;
    bg: string;
    border: string;
    testId: string;
  }
> = {
  primary: {
    icon: 'icon-info text-white text-3xl',
    textColor: 'text-white',
    bg: 'bg-tweaked-brand',
    border: 'border-tweaked-brand',
    testId: 'primary-toast',
  },
  success: {
    icon: 'icon-check-circle text-hsl-dark-green text-3xl',
    textColor: 'text-black',
    bg: 'bg-hsl-dark-green bg-opacity-25',
    border: 'border-hsl-dark-green',
    testId: 'success-toast',
  },
  danger: {
    icon: 'icon-alert-filled text-hsl-red text-3xl',
    textColor: 'text-black',
    bg: 'bg-hsl-red bg-opacity-25',
    border: ' border-hsl-red',
    testId: 'danger-toast',
  },
  warning: {
    icon: 'icon-alert-filled text-hsl-warning-yellow text-3xl',
    textColor: 'text-black',
    bg: 'bg-hsl-warning-yellow bg-opacity-25',
    border: ' border-hsl-warning-yellow',
    testId: 'warning-toast',
  },
};

const ToastImpl: ForwardRefRenderFunction<HTMLDivElement, ToastProps> = (
  { message, type = 'primary', className },
  ref,
) => {
  const { icon, textColor, bg, border, testId } = propsByType[type];

  return (
    <div
      className={twMerge(`rounded-md bg-white`, className)}
      data-test-element-type="toast"
      data-testid={testId}
      ref={ref}
    >
      <div className={`${bg} ${border} rounded-md border`}>
        <Row className="my-6 ml-16 mr-16 items-center">
          <i className={icon} />
          <p className={`${textColor} ml-2 text-sm`}>{message}</p>
        </Row>
      </div>
    </div>
  );
};

export const Toast = forwardRef(ToastImpl);
