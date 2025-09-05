import { forwardRef } from 'react';
import { SimpleDropdownMenuItem } from '../../../../../../uiComponents';

type ShowOnMapProps = {
  readonly className?: string;
  readonly onClick: () => void;
  readonly testId: string;
  readonly text: string;
};

export const ShowOnMap = forwardRef<HTMLButtonElement, ShowOnMapProps>(
  ({ className, onClick, testId, text }, ref) => {
    return (
      <SimpleDropdownMenuItem
        className={className}
        text={text}
        onClick={onClick}
        testId={testId}
        ref={ref}
      />
    );
  },
);

ShowOnMap.displayName = 'ShowOnMap';
