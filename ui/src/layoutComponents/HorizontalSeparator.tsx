import { twMerge } from 'tailwind-merge';

type HorizontalSeparatorProps = {
  readonly className?: string;
};

export const HorizontalSeparator = ({
  className,
}: HorizontalSeparatorProps) => <hr className={twMerge('my-2', className)} />;
