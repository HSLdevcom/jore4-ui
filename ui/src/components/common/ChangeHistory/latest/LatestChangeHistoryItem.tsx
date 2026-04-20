import { ReactNode, isValidElement } from 'react';
import { FaPlay } from 'react-icons/fa';
import { Link, To } from 'react-router';
import { useGetUserNames } from '../../../../hooks';
import { mapUTCToDateTime } from '../../../../time';
import { EmptyCell } from '../EmptyCell';
import { ChangedValue } from '../types';

type ChangeSection = {
  readonly title: string;
  readonly changes: ReadonlyArray<ChangedValue>;
};

type LatestChangeHistoryItemProps = {
  readonly historyItem: {
    readonly changed?: string | null;
    readonly changedBy?: string | null;
    readonly versionComment?: string | null;
  };
  readonly sections: ReadonlyArray<ChangeSection>;
  readonly link: To;
  readonly testId: string;
};

const isEmptyCell = (value: unknown): boolean => {
  return isValidElement(value) && value.type === EmptyCell;
};

export const LatestChangeHistoryItem = ({
  historyItem,
  sections,
  link,
  testId,
}: LatestChangeHistoryItemProps): ReactNode => {
  const { getUserNameById } = useGetUserNames();

  const changedBy = getUserNameById(historyItem.changedBy) ?? 'HSL';
  const changedAt = mapUTCToDateTime(historyItem.changed);

  if (sections.length === 0) {
    return null;
  }

  return (
    <div className="mb-3 text-sm" data-testid={testId}>
      {sections.map((section) => (
        <div key={section.title}>
          <Link to={link} className="font-semibold text-brand hover:underline">
            {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
            {historyItem.versionComment || section.title}
          </Link>
          {section.changes.map((c) => {
            const hasOldValue = c.oldValue && !isEmptyCell(c.oldValue);
            return (
              <span className="block" key={c.key ?? c.field}>
                {c.field && `${c.field}: `}
                {hasOldValue && (
                  <>
                    {c.oldValue}{' '}
                    <FaPlay className="mx-1 inline text-[8px]" />{' '}
                  </>
                )}
                {c.newValue}
              </span>
            );
          })}
        </div>
      ))}
      <div>
        {changedAt} | {changedBy}
      </div>
    </div>
  );
};
