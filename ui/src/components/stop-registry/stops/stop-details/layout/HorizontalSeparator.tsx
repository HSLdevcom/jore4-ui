import { twMerge } from 'tailwind-merge';

interface Props {
  className?: string;
}
export const HorizontalSeparator = ({
  className = '',
}: Props): React.ReactElement => <hr className={twMerge('my-2', className)} />;
