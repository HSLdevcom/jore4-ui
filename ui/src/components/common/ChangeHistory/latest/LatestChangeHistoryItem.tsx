import { FC, isValidElement } from 'react';
import { FaPlay } from 'react-icons/fa';
import { Link, To } from 'react-router';
import { useGetUserNames } from '../../../../hooks';
import { mapToShortDateTime } from '../../../../time';
import { EmptyCell } from '../EmptyCell';
import { BaseChangeHistoryItemDetails, ChangedValue } from '../types';

function changeKey(change: ChangedValue): string {
  return change.key ?? change.field;
}

const testIds = {
  change: (change: ChangedValue) =>
    `LatestChangeHistoryItemChange::${changeKey(change)}`,
  fieldName: 'LatestChangeHistoryItemChange::FieldName',
  oldValue: 'LatestChangeHistoryItemChange::OldValue',
  newValue: 'LatestChangeHistoryItemChange::NewValue',
};

type ChangeSection = {
  readonly title: string;
  readonly changes: ReadonlyArray<ChangedValue>;
};

function isEmptyCell(value: unknown): boolean {
  return isValidElement(value) && value.type === EmptyCell;
}

type ChangeProps = {
  readonly changedValue: ChangedValue;
};
const LatestChangeHistoryItemChange: FC<ChangeProps> = ({ changedValue }) => {
  const { field, newValue, oldValue } = changedValue;
  const hasOldValue = oldValue && !isEmptyCell(oldValue);

  return (
    <div data-testid={testIds.change(changedValue)}>
      {field ? (
        <>
          <span data-testid={testIds.fieldName}>{field}</span>
          <span>{': '}</span>
        </>
      ) : null}

      {hasOldValue ? (
        <>
          <span data-testid={testIds.oldValue}>{oldValue}</span>{' '}
          <FaPlay className="mx-1 inline text-[8px]" />{' '}
        </>
      ) : (
        <span data-testid={testIds.oldValue} />
      )}

      <span data-testid={testIds.newValue}>{newValue}</span>
    </div>
  );
};

type SectionProps = ChangeSection & {
  readonly historyItem: BaseChangeHistoryItemDetails;
  readonly link: To;
};
const LatestChangeHistoryItemSection: FC<SectionProps> = ({
  changes,
  historyItem,
  link,
  title,
}) => {
  return (
    <div>
      <Link to={link} className="font-semibold text-brand hover:underline">
        {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
        {historyItem.versionComment || title}
      </Link>
      {changes.map((changedValue) => (
        <LatestChangeHistoryItemChange
          key={changeKey(changedValue)}
          changedValue={changedValue}
        />
      ))}
    </div>
  );
};

type LatestChangeHistoryItemProps = {
  readonly historyItem: BaseChangeHistoryItemDetails;
  readonly sections: ReadonlyArray<ChangeSection>;
  readonly link: To;
  readonly testId: string;
};

export const LatestChangeHistoryItem: FC<LatestChangeHistoryItemProps> = ({
  historyItem,
  sections,
  link,
  testId,
}) => {
  const { getUserNameById } = useGetUserNames();

  const changedBy = getUserNameById(historyItem.changedBy) ?? 'HSL';
  const changedAt = mapToShortDateTime(historyItem.changed);

  if (sections.length === 0) {
    return null;
  }

  return (
    <div className="mb-3 text-sm" data-testid={testId}>
      {sections.map(({ title, changes }) => (
        <LatestChangeHistoryItemSection
          key={title}
          changes={changes}
          historyItem={historyItem}
          link={link}
          title={title}
        />
      ))}
      <div>
        {changedAt} | {changedBy}
      </div>
    </div>
  );
};
