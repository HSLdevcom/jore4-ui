import { Switch as HuiSwitch } from '@headlessui/react';
import React, { FC, ReactNode } from 'react';

interface Props {
  className?: string;
  checked: boolean;
  onChange: (enabled: boolean) => void;
  testId?: string;
}

// a pre-styled version of the Headless UI Switch component
export const Switch: React.FC<Props> = ({
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

interface LabelProps {
  className?: string;
  children: ReactNode;
}

export const SwitchLabel: FC<LabelProps> = ({ className = '', children }) => {
  return (
    <HuiSwitch.Label className={`${className} text-base font-normal`}>
      {children}
    </HuiSwitch.Label>
  );
};
