import { FC, ReactNode } from 'react';
import { twJoin, twMerge } from 'tailwind-merge';
import { CloseIconButton } from '../../uiComponents';

type FloatingFooterProps = {
  readonly className?: string;
  readonly children?: ReactNode;
  readonly onClose: () => void;
  readonly testId: string;
};

export const FloatingFooter: FC<FloatingFooterProps> = ({
  className,
  children,
  testId,
  onClose,
}) => {
  return (
    <div
      className={twMerge(
        twJoin(
          // Floating on bottom center
          'absolute bottom-8 left-1/2 z-10 min-w-80 -translate-x-1/2',
          // Rounded blue border with dropdown shadow
          'rounded border-2 border-tweaked-brand shadow-md',
          // Blue text on white background

          'bg-white p-5 font-bold text-tweaked-brand',
          'flex items-center justify-center',
        ),
        className,
      )}
      data-testid={testId}
    >
      {children}

      <CloseIconButton onClick={onClose} testId={`${testId}::closeButton`} />
    </div>
  );
};
