import { FC } from 'react';
import { GoDotFill } from 'react-icons/go';

type HastusCodeProps = {
  readonly hastusCode: string;
  readonly isUsedAsTimingPoint?: boolean;
  readonly testId: string;
};

export const HastusCode: FC<HastusCodeProps> = ({
  hastusCode,
  isUsedAsTimingPoint,
  testId,
}) => {
  if (isUsedAsTimingPoint) {
    return (
      <div className="relative">
        <span data-testid={testId}>{hastusCode}</span>
        <span className="absolute my-1 text-green-700">
          <GoDotFill />
        </span>
      </div>
    );
  }

  return (
    <div>
      <span className="text-grey" data-testid={testId}>
        {hastusCode}
      </span>
    </div>
  );
};
