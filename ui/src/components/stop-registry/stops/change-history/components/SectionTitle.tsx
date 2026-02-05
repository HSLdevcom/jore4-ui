import { FC, ReactNode } from 'react';
import { QuayChangeHistoryItem } from '../../../../../generated/graphql';

type SectionTittleProps = {
  readonly historyItem: QuayChangeHistoryItem;
  readonly section: ReactNode;
};

export const SectionTitle: FC<SectionTittleProps> = ({
  historyItem: { versionComment },
  section,
}) => {
  if (versionComment) {
    return (
      <div className="flex gap-x-2">
        <h5>{section}</h5>
        <span>|</span>
        <span>{versionComment}</span>
      </div>
    );
  }

  return <h5>{section}</h5>;
};
