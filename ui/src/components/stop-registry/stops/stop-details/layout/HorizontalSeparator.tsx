import { twMerge } from 'tailwind-merge';

interface Props {
  className?: string;
}
export const HorizontalSeparator = ({ className = '' }: Props): JSX.Element => (
  <hr className={twMerge('my-2', className)} />
);
