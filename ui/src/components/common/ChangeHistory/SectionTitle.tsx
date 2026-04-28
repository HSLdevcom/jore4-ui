import { FC, ReactNode } from 'react';
import { StopPlaceChangeHistoryItem } from '../../../generated/graphql';

const testIds = { comment: 'ChangeHistory::SectionHeader::VersionComment' };

type SectionTitleProps = {
  readonly historyItem: StopPlaceChangeHistoryItem;
  readonly section: ReactNode;
  readonly children?: ReactNode;
};

export const SectionTitle: FC<SectionTitleProps> = ({
  historyItem,
  section,
  children,
}) => {
  const content = children ?? section;
  const { versionComment } = historyItem;

  if (versionComment) {
    return (
      <div className="flex gap-x-2">
        <h5>{content}</h5>
        <span>|</span>
        <span data-testid={testIds.comment}>{versionComment}</span>
      </div>
    );
  }

  return <h5>{content}</h5>;
};
