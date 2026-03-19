import { FC } from 'react';
import { normalizeEmptyValue } from '../../../common/ChangeHistory';
import { LineChangeHistoryItem } from '../types';

const testIds = { comment: 'ChangeHistory::SectionHeader::VersionComment' };

type VersionCommentProps = { readonly item: LineChangeHistoryItem };

export const VersionComment: FC<VersionCommentProps> = ({ item }) => {
  const comment = normalizeEmptyValue(item.versionComment);

  if (!comment) {
    return null;
  }

  return <p data-testid={testIds.comment}>{comment}</p>;
};
