import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StopGroupSelector } from '../components';
import { FindStopByLineInfo } from './useFindLinesByStopSearch';

type LineSelectorProps = {
  readonly className?: string;
  readonly lines: ReadonlyArray<FindStopByLineInfo>;
};

export const LineSelector: FC<LineSelectorProps> = ({ className, lines }) => {
  const { t } = useTranslation();

  const groups = useMemo(
    () =>
      lines.map(({ line_id: id, label, name_i18n: { fi_FI: title = '' } }) => ({
        id,
        label,
        title,
      })),
    [lines],
  );

  return (
    <StopGroupSelector
      className={className}
      groups={groups}
      label={(count) => t('stopRegistrySearch.lines', { count })}
    />
  );
};
