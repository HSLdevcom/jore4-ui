import { Switch as HuiSwitch, Label } from '@headlessui/react';
import { FC, PropsWithChildren } from 'react';
import { twJoin, twMerge } from 'tailwind-merge';

type SwitchProps = {
  readonly className?: string;
  readonly checked: boolean;
  readonly onChange: (enabled: boolean) => void;
  readonly disabled?: boolean;
  readonly testId?: string;
};

// a pre-styled version of the Headless UI Switch component
export const Switch: FC<SwitchProps> = ({
  testId,
  className,
  checked,
  onChange,
  disabled = false,
}) => {
  return (
    <HuiSwitch
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className={twMerge(
        'relative inline-flex h-6 w-11 items-center rounded-full border transition-colors focus-visible:ring-3',
        checked ? 'border-brand bg-brand' : 'border-grey',
        'disabled:cursor-default disabled:border-grey disabled:bg-grey disabled:opacity-50',
        className,
      )}
      data-testid={testId}
    >
      <span
        className={twJoin(
          'inline-block h-6 w-6 transform rounded-full border bg-white transition-transform',
          checked
            ? 'translate-x-5 border-brand'
            : '-translate-x-0.5 border-grey',
          disabled && 'border-grey',
        )}
      />
    </HuiSwitch>
  );
};

type LabelProps = {
  readonly className?: string;
};

export const SwitchLabel: FC<PropsWithChildren<LabelProps>> = ({
  className,
  children,
}) => {
  return (
    <Label className={twMerge('text-base font-normal', className)}>
      {children}
    </Label>
  );
};
