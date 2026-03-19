import { FC, ReactNode } from 'react';
import { QuayChangeHistoryItem } from '../../../../../generated/graphql';

const testIds = { comment: 'ChangeHistory::SectionHeader::VersionComment' };

type SectionTitleProps = {
  readonly historyItem: QuayChangeHistoryItem;
  readonly section: ReactNode;
};

export const SectionTitle: FC<SectionTitleProps> = ({
  historyItem: { versionComment },
  section,
}) => {
  if (versionComment) {
    return (
      <div className="flex gap-x-2">
        <h5>{section}</h5>
        <span>|</span>
        <span data-testid={testIds.comment}>{versionComment}</span>
      </div>
    );
  }

  return <h5>{section}</h5>;
};
