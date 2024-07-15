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

interface Props<T> {
  title: string;
  detail: T | null | undefined;
  testId?: string;
  className?: string;
}

export const LabeledDetail = <T extends ExplicitAny>({
  title,
  detail,
  testId = '',
  className = '',
}: Props<T>): React.ReactElement => {
  return (
    <div className={`inline-flex flex-col ${className}`}>
      <div className="text-sm">{title}</div>
      <div className="text-sm font-bold" data-testid={testId}>
        {detailOrPlaceholder(detail)}
      </div>
    </div>
  );
};
