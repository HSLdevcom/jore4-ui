import { Switch as HuiSwitch } from '@headlessui/react';
import React, { FC, PropsWithChildren } from 'react';

type SwitchProps = {
  readonly className?: string;
  readonly checked: boolean;
  readonly onChange: (enabled: boolean) => void;
  readonly testId?: string;
};

// a pre-styled version of the Headless UI Switch component
export const Switch: React.FC<SwitchProps> = ({
  testId,
  className = '',
  checked,
  onChange,
}) => {
  return (
    <HuiSwitch
      checked={checked}
      onChange={onChange}
      className={`${className} ${
        checked ? 'border-brand bg-brand' : 'border-grey'
      } relative inline-flex h-6 w-11 items-center rounded-full border transition-colors focus-visible:ring`}
      data-testid={testId}
    >
      <span
        className={`${
          checked
            ? 'translate-x-5 border-brand'
            : '-translate-x-0.5 border-grey'
        } inline-block h-6 w-6 transform rounded-full border bg-white transition-transform`}
      />
    </HuiSwitch>
  );
};

type LabelProps = {
  readonly className?: string;
};

export const SwitchLabel: FC<PropsWithChildren<LabelProps>> = ({
  className = '',
  children,
}) => {
  return (
    <HuiSwitch.Label className={`${className} text-base font-normal`}>
      {children}
    </HuiSwitch.Label>
  );
};
