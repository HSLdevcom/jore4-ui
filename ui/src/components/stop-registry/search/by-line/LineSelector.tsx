import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StopGroupSelector } from '../components';
import { FindStopByLineInfo } from './useFindLinesByStopSearch';

type LineSelectorProps = {
  readonly activeLineIds: ReadonlyArray<UUID> | null;
  readonly className?: string;
  readonly lines: ReadonlyArray<FindStopByLineInfo>;
  readonly setActiveLineIds: (activeLineId: ReadonlyArray<UUID> | null) => void;
};

export const LineSelector: FC<LineSelectorProps> = ({
  activeLineIds,
  className,
  lines,
  setActiveLineIds,
}) => {
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
      label={t('stopRegistrySearch.lines')}
      onSelect={setActiveLineIds}
      selected={activeLineIds}
    />
  );
};
