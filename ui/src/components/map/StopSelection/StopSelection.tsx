import { Popover, PopoverButton } from '@headlessui/react';
import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MdList } from 'react-icons/md';
import { twMerge } from 'tailwind-merge';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { selectMapStopSelection, setStopSelectionAction } from '../../../redux';
import { IconButton } from '../../../uiComponents';
import { hasMeaningfulFilters } from '../../stop-registry';
import { useMapUrlStateContext } from '../utils/mapUrlState';
import { StopSelectionPanel } from './StopSelectionPanel';

const testIds = { button: 'Map::StopSelection::openButton' };

type ResolveProperSelectionModeResult = {
  readonly hasSelections: boolean;
};

function useResolveProperSelectionMode(): ResolveProperSelectionModeResult {
  const dispatch = useAppDispatch();
  const selectedStops = useAppSelector(selectMapStopSelection);
  const {
    state: { filters },
  } = useMapUrlStateContext();

  useEffect(() => {
    // If on by-resul-mode (default if not changed before navigation to the map)
    // change that to by-list mode, if there are no filters defined.
    if (selectedStops.byResultSelection && !hasMeaningfulFilters(filters)) {
      dispatch(
        setStopSelectionAction({
          byResultSelection: false,
          selected: [],
        }),
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    hasSelections: selectedStops.byResultSelection
      ? hasMeaningfulFilters(filters)
      : selectedStops.selected.length > 0,
  };
}

type StopSelectionProps = {
  readonly align: 'left' | 'right';
  readonly className?: string;
};

export const StopSelection: FC<StopSelectionProps> = ({ align, className }) => {
  const { t } = useTranslation();

  const { hasSelections } = useResolveProperSelectionMode();

  const alignClassName = align === 'right' ? 'right-0 top-24' : 'left-0 top-20';

  return (
    <Popover
      className={twMerge('flex items-stretch justify-stretch', className)}
    >
      {({ open }) => (
        <>
          <PopoverButton
            as={IconButton}
            className="relative grow"
            tooltip={
              open
                ? t('map.stopSelection.hideSelection')
                : t('map.stopSelection.showSelection')
            }
            icon={
              <>
                <MdList
                  aria-hidden
                  className="inline text-2xl text-tweaked-brand"
                />
                {hasSelections ? (
                  <div
                    aria-hidden
                    className="absolute right-1 bottom-2 h-2 w-2 rounded-full bg-accent-secondary"
                  />
                ) : null}
              </>
            }
            testId={testIds.button}
          />

          <StopSelectionPanel className={alignClassName} />
        </>
      )}
    </Popover>
  );
};
