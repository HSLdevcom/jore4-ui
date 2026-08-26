import { TFunction } from 'i18next';

export type FilterItem = {
  readonly id: string;
  readonly isActive: boolean;
  readonly label: string;
  readonly toggleFunction: (isActive: boolean) => void;
  readonly disabled: boolean;
};

export type ClassNameProps = {
  readonly className?: string;
};

export type ToggleProps = {
  readonly active: boolean;
  readonly onToggle: (active: boolean) => void;
  readonly testId: string;
};

export type IconToggleProps = ToggleProps & {
  readonly iconClassName: string;
  readonly activeColorClassName?: string;
  readonly inactiveColorClassName?: string;
  readonly disabled?: boolean;
  readonly tooltip: (t: TFunction) => string;
  readonly colorClassNames: {
    readonly active: string;
    readonly inactive: string;
  };
};
