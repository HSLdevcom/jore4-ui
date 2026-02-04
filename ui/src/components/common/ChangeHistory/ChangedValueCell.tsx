import { FC, ReactNode } from 'react';

const placeholder = '-';
// Strings longer than this are marked as long, and thus should request extra
// space from the table, to prevent the content from being one word per row.
const longStringThreshold = 50;

/**
 * Trims strings and replaces empty content with the placeholder dash.
 *
 * @param value
 */
function getFinalValueForDisplay(value: ReactNode): ReactNode {
  if (value === null || value === undefined) {
    return placeholder;
  }

  if (Array.isArray(value) && value.length === 0) {
    return placeholder;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') {
      return placeholder;
    }

    return trimmed;
  }

  return value;
}

/**
 * Determine the long data attribute value for the cell.
 * @param value
 */
function isLongString(value: ReactNode): string | undefined {
  if (typeof value === 'string' && value.length > longStringThreshold) {
    return 'true';
  }

  return undefined;
}

type ChangedValueCellProps = {
  readonly className?: string;
  readonly colSpan?: number;
  readonly testId: string;
  readonly value: ReactNode;
};

export const ChangedValueCell: FC<ChangedValueCellProps> = ({
  className,
  colSpan,
  testId,
  value,
}) => {
  const finalValue = getFinalValueForDisplay(value);

  return (
    <td
      className={className}
      colSpan={colSpan}
      data-long={isLongString(finalValue)}
      data-testid={testId}
    >
      {finalValue}
    </td>
  );
};
