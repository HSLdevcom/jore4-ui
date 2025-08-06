import { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StopGroupSelector } from '../components';
import { FindStopByLineInfo } from './useFindLinesByStopSearch';

type LineSelectorProps = {
  readonly activeLineId: UUID | null;
  readonly className?: string;
  readonly lines: ReadonlyArray<FindStopByLineInfo>;
  readonly setActiveLineId: (activeLineId: UUID | null) => void;
};

export const LineSelector: FC<LineSelectorProps> = ({
  activeLineId,
  className,
  lines,
  setActiveLineId,
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

  // Line selection will still support only one line being selected and this function handles that
  const onSelectWrapper = useCallback(
    (selected: string[] | null) => {
      if (selected) {
        // Set the active line id to be last (most recently selected) line id
        setActiveLineId(selected.at(-1) ?? null);
      } else {
        setActiveLineId(null);
      }
    },
    [setActiveLineId],
  );

  return (
    <StopGroupSelector
      className={className}
      groups={groups}
      label={t('stopRegistrySearch.lines')}
      onSelect={onSelectWrapper}
      selected={activeLineId ? [activeLineId] : null}
    />
  );
};
