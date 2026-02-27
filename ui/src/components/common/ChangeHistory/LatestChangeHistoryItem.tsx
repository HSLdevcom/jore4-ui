import { ReactNode } from 'react';
import { FaPlay } from 'react-icons/fa';
import { Link } from 'react-router';
import { useGetUserNames } from '../../../hooks';
import { mapUTCToDateTime } from '../../../time';
import { ChangedValue } from './types';

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
  readonly link: string;
};

export const LatestChangeHistoryItem = ({
  historyItem,
  sections,
  link,
}: LatestChangeHistoryItemProps): ReactNode => {
  const { getUserNameById } = useGetUserNames();

  const changedBy = getUserNameById(historyItem.changedBy) ?? 'HSL';
  const changedAt = mapUTCToDateTime(historyItem.changed);

  if (sections.length === 0) {
    return null;
  }

  return (
    <div className="mb-3 text-sm">
      {sections.map((section) => (
        <div key={section.title}>
          <Link to={link} className="font-semibold text-brand hover:underline">
            {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
            {historyItem.versionComment || section.title}
          </Link>
          {section.changes.map((c) => (
            <span className="block" key={c.key ?? String(c.field)}>
              {c.field}: {c.oldValue}{' '}
              <FaPlay className="mx-1 inline text-[8px]" /> {c.newValue}
            </span>
          ))}
        </div>
      ))}
      <div>
        {changedAt} | {changedBy}
      </div>
    </div>
  );
};
