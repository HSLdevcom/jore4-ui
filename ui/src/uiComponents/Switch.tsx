import { Switch as HuiSwitch } from '@headlessui/react';
import { FC, PropsWithChildren } from 'react';
import { twJoin, twMerge } from 'tailwind-merge';

type SwitchProps = {
  readonly className?: string;
  readonly checked: boolean;
  readonly onChange: (enabled: boolean) => void;
  readonly testId?: string;
};

// a pre-styled version of the Headless UI Switch component
export const Switch: FC<SwitchProps> = ({
  testId,
  className,
  checked,
  onChange,
}) => {
  return (
    <HuiSwitch
      checked={checked}
      onChange={onChange}
      className={twMerge(
        'relative inline-flex h-6 w-11 items-center rounded-full border transition-colors focus-visible:ring',
        checked ? 'border-brand bg-brand' : 'border-grey',
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
    <HuiSwitch.Label className={twMerge('text-base font-normal', className)}>
      {children}
    </HuiSwitch.Label>
  );
};
