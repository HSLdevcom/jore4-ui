import { ReactElement } from 'react';
import { twMerge } from 'tailwind-merge';

function detailOrPlaceholder(detail: unknown): string {
  // Cases where the falsy value is OK.
  if (
    typeof detail === 'number' ||
    typeof detail === 'bigint' ||
    typeof detail === 'boolean'
  ) {
    return detail.toString(10);
  }

  return detail ? String(detail) : '-';
}

type LabeledDetailProps<T> = {
  readonly title: string;
  readonly detail: T | null | undefined;
  readonly testId?: string;
  readonly className?: string;
};

export const LabeledDetail = <T extends ExplicitAny>({
  title,
  detail,
  testId = '',
  className,
}: LabeledDetailProps<T>): ReactElement => {
  return (
    <div className={twMerge('inline-flex flex-col', className)}>
      <div className="text-sm">{title}</div>
      <div className="text-sm font-bold" data-testid={testId}>
        {detailOrPlaceholder(detail)}
      </div>
    </div>
  );
};
