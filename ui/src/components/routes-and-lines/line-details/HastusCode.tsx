import { GoPrimitiveDot } from 'react-icons/go';

interface Props {
  hastusCode: string;
  isUsedAsTimingPoint?: boolean;
  testId: string;
}

export const HastusCode = ({
  hastusCode,
  isUsedAsTimingPoint,
  testId,
}: Props) => {
  return (
    <>
      {isUsedAsTimingPoint ? (
        <div className="relative">
          <span data-testid={testId}>{hastusCode}</span>
          <span className="absolute my-1 text-green-700">
            <GoPrimitiveDot />
          </span>
        </div>
      ) : (
        <div>
          <span className="text-grey" data-testid={testId}>
            {hastusCode}
          </span>
        </div>
      )}
    </>
  );
};
