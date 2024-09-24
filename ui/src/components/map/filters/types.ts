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
