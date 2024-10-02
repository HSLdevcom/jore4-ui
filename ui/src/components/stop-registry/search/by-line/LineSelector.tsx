import { RadioGroup } from '@headlessui/react';
import { FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { twJoin, twMerge } from 'tailwind-merge';
import { Visible } from '../../../../layoutComponents';
import { FindStopByLineInfo } from './useFindLinesByStopSearch';
import { useVisibilityMap } from './useVisibilityMap';

const testIds = {
  lineSelector: (lineId: UUID) =>
    `StopSearchByLine::line::lineSelector::${lineId}`,
  showAll: `StopSearchByLine::line::showAllButton`,
  showLess: `StopSearchByLine::line::showLessButton`,
};

type LineSelectorProps = {
  readonly activeLineId: UUID | null;
  readonly className?: string;
  readonly lines: ReadonlyArray<FindStopByLineInfo>;
  readonly setActiveLineId: (activeLineId: UUID | null) => void;
};

const SHOW_ALL_BY_DEFAULT_MAX = 20;
const MAX_PADDING = 5;
const NO_BREAK_SPACE = '\xa0';

export const LineSelector: FC<LineSelectorProps> = ({
  activeLineId,
  className,
  lines,
  setActiveLineId,
}) => {
  const { t } = useTranslation();

  const showAllByDefault = lines.length <= SHOW_ALL_BY_DEFAULT_MAX;
  const [showAll, setShowAll] = useState(showAllByDefault);
  useEffect(() => setShowAll(showAllByDefault), [showAllByDefault]);

  const lineListRef = useRef<HTMLDivElement | null>(null);
  const visibilityMap = useVisibilityMap(showAll, lines, lineListRef);

  const someLineIsHidden = Object.values(visibilityMap).some(
    (visible) => !visible,
  );

  const longestLabel = Math.min(
    Math.max(...lines.map((line) => line.label.length)),
    MAX_PADDING,
  );

  return (
    <RadioGroup
      className={twMerge('flex gap-2', className)}
      onChange={setActiveLineId}
      value={activeLineId}
    >
      <RadioGroup.Label className="mt-2">
        {t('stopRegistrySearch.lines')}
      </RadioGroup.Label>

      <div
        className={twJoin(
          'flex items-center gap-2 overflow-hidden',
          showAll ? 'flex-wrap' : '',
        )}
        ref={lineListRef}
      >
        {lines.map(
          ({ line_id: lineId, label, name_i18n: { fi_FI: title } }) => (
            <RadioGroup.Option
              className={twJoin(
                'cursor-pointer rounded border px-2 py-1 text-center font-bold text-dark-grey',
                'ui-checked:border-brand ui-checked:bg-brand ui-checked:text-white',
                'hover:border-black hover:bg-background-hsl-blue hover:text-black',
                'font-mono', // Helps to align the items into a grid
                showAll || visibilityMap[lineId] ? '' : 'invisible',
              )}
              data-line-id={lineId}
              data-visible={visibilityMap[lineId]}
              data-testid={testIds.lineSelector(lineId)}
              id={`select-line-${lineId}`}
              key={lineId}
              title={title}
              value={lineId}
            >
              {label.padEnd(
                showAll && !showAllByDefault ? longestLabel : 0,
                NO_BREAK_SPACE,
              )}
            </RadioGroup.Option>
          ),
        )}

        {/* Hide button is nested in here to render the button as a last element in the list. */}
        <Visible visible={!showAllByDefault && showAll}>
          <button
            className="text-nowrap text-base font-bold text-brand"
            data-testid={testIds.showLess}
            onClick={() => setShowAll(false)}
            type="button"
          >
            {t('stopRegistrySearch.showLessLines')}
          </button>
        </Visible>
      </div>

      {/* Show more button is outside the list as to exclude from the overflow calculations.  */}
      <Visible visible={!showAll && someLineIsHidden}>
        <button
          className="text-nowrap text-base font-bold text-brand"
          data-testid={testIds.showAll}
          onClick={() => setShowAll(true)}
          type="button"
        >
          {t('stopRegistrySearch.showAllLines', { count: lines.length })}
        </button>
      </Visible>
    </RadioGroup>
  );
};
