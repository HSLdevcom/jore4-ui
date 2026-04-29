import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import debounce from 'lodash/debounce';
import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdOutlineSearch } from 'react-icons/md';
import { StopRegistryTransportModeType } from '../../../../../generated/graphql';
import { mapStopRegistryTransportModeTypeToUiName } from '../../../../../i18n/uiNameMappings';
import { StopWithDetails } from '../../../../../types';
import {
  JoreListbox,
  ListboxOptionItem,
  Modal,
  ModalBody,
  ModalHeader,
  NewModalFooter,
  SimpleButton,
  comboboxStyles,
} from '../../../../../uiComponents';
import { parseVehicleMode } from '../../../../../utils';
import {
  showDangerToastWithError,
  showSuccessToast,
} from '../../../../../utils/toastService';
import { StopModalStopAreaFormSchema } from '../../../../forms/stop/types';
import {
  formatIsoDateString,
  useFindStopAreas,
} from '../../../../forms/stop/utils';
import { useCreateMirrorQuay } from './useCreateMirrorQuay';

const testIds = {
  modal: 'MakeHybridStopModal',
  transportModeDropdown: 'MakeHybridStopModal::transportMode',
  stopAreaInput: 'MakeHybridStopModal::stopAreaInput',
  stopAreaOption: (code: string) => `MakeHybridStopModal::stopArea::${code}`,
  confirmButton: 'MakeHybridStopModal::confirm',
  cancelButton: 'MakeHybridStopModal::cancel',
};

const SUPPORTED_TRANSPORT_MODES = [
  StopRegistryTransportModeType.Bus,
  StopRegistryTransportModeType.Tram,
] as const;

type MakeHybridStopModalProps = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly parentStop: StopWithDetails | null;
};

export const MakeHybridStopModal: FC<MakeHybridStopModalProps> = ({
  isOpen,
  onClose,
  parentStop,
}) => {
  const { t } = useTranslation();
  const { createMirrorQuay, loading: saving } = useCreateMirrorQuay();

  const currentTransportMode = parentStop?.stop_place?.transportMode ?? null;

  const availableModes = useMemo(
    () =>
      SUPPORTED_TRANSPORT_MODES.filter((mode) => mode !== currentTransportMode),
    [currentTransportMode],
  );

  const transportModeOptions: ReadonlyArray<
    ListboxOptionItem<StopRegistryTransportModeType>
  > = useMemo(
    () =>
      availableModes.map((mode) => ({
        value: mode,
        content: mapStopRegistryTransportModeTypeToUiName(t, mode),
      })),
    [availableModes, t],
  );

  const [selectedMode, setSelectedMode] = useState<
    StopRegistryTransportModeType | undefined
  >(undefined);

  const vehicleMode = selectedMode ? parseVehicleMode(selectedMode) : undefined;

  const [query, setQuery] = useState('');
  const [queryDebounced, setQueryDebounced] = useState(false);
  const { areas, loading: loadingAreas } = useFindStopAreas(query, vehicleMode);

  const [selectedStopArea, setSelectedStopArea] =
    useState<StopModalStopAreaFormSchema | null>(null);

  useEffect(() => {
    if (!loadingAreas) {
      setQueryDebounced(false);
    }
  }, [loadingAreas]);

  const onQueryChange = useMemo(() => {
    const debouncedSetQuery = debounce(setQuery, 500);
    return (newQuery: string) => {
      if (newQuery === '') {
        debouncedSetQuery.cancel();
        setQueryDebounced(false);
        setQuery('');
      } else {
        setQueryDebounced(true);
        debouncedSetQuery(newQuery);
      }
    };
  }, []);

  const handleModeChange = (mode: StopRegistryTransportModeType) => {
    setSelectedMode(mode);
    setSelectedStopArea(null);
    setQuery('');
  };

  const resetState = () => {
    setSelectedMode(undefined);
    setSelectedStopArea(null);
    setQuery('');
    setQueryDebounced(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleConfirm = async () => {
    if (!parentStop || !selectedStopArea || !selectedMode || !vehicleMode) {
      return;
    }

    try {
      const success = await createMirrorQuay({
        targetStopPlaceId: selectedStopArea.netexId,
        parentStop,
        vehicleMode,
      });

      if (success) {
        showSuccessToast(t(($) => $.stopDetails.hybrid.success));
        handleClose();
      }
    } catch (err) {
      showDangerToastWithError(
        t(($) => $.stopDetails.hybrid.error),
        err,
      );
    }
  };

  const areaSearchLoading = loadingAreas || queryDebounced;
  const canConfirm = !!selectedMode && !!selectedStopArea && !saving;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      contentClassName="w-1/3"
      testId={testIds.modal}
    >
      <ModalHeader
        onClose={handleClose}
        heading={t(($) => $.stopDetails.hybrid.title)}
      />
      <ModalBody className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-bold">
            {t(($) => $.stopDetails.hybrid.transportMode)}
          </label>
          <JoreListbox<StopRegistryTransportModeType>
            buttonContent={
              selectedMode
                ? mapStopRegistryTransportModeTypeToUiName(t, selectedMode)
                : t(($) => $.stopDetails.hybrid.selectTransportMode)
            }
            options={transportModeOptions}
            value={selectedMode}
            onChange={handleModeChange}
            testId={testIds.transportModeDropdown}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-bold">
            {t(($) => $.stopDetails.hybrid.stopArea)}
          </label>
          <Combobox
            as="div"
            className={comboboxStyles.root('flex flex-col')}
            value={selectedStopArea}
            onChange={setSelectedStopArea}
            disabled={!selectedMode}
          >
            <div className="flex h-(--input-height)">
              <ComboboxInput<StopModalStopAreaFormSchema>
                className={comboboxStyles.input(
                  'grow border-r-0 outline-0 ui-not-open:rounded-tr-none ui-not-open:rounded-br-none',
                  'ui-open:rounded-bl-none',
                )}
                onChange={(e) => onQueryChange(e.target.value)}
                displayValue={(it) => it?.nameFin ?? ''}
                autoComplete="off"
                placeholder={t(($) => $.stopDetails.hybrid.searchStopArea)}
                data-testid={testIds.stopAreaInput}
              />
              <ComboboxButton
                disabled={!query}
                className={comboboxStyles.button(
                  'static flex h-(--input-height) w-(--input-height) justify-center rounded-tr-[5px] rounded-br-[5px] bg-tweaked-brand text-xl',
                  'ui-open:rounded-br-none',
                )}
              >
                <MdOutlineSearch color="white" />
              </ComboboxButton>
            </div>
            <ComboboxOptions
              anchor="bottom start"
              className={comboboxStyles.options(
                'min-w-[calc(var(--button-width)+var(--input-width))]',
              )}
              transition
            >
              {areaSearchLoading && (
                <ComboboxOption
                  className={comboboxStyles.option()}
                  value={null}
                  disabled
                >
                  {t(($) => $.stops.stopArea.label)}
                </ComboboxOption>
              )}

              {areas.map((area) => (
                <ComboboxOption
                  className={comboboxStyles.option()}
                  key={area.netexId}
                  value={area}
                  data-testid={testIds.stopAreaOption(area.privateCode)}
                >
                  <span className="shrink-0 self-start font-bold">
                    {area.privateCode}
                  </span>
                  <div className="mx-2 flex grow flex-col">
                    <span>{area.nameFin ?? area.nameSwe}</span>
                    <span className="font-bold">
                      {`${formatIsoDateString(area.validityStart)} - ${formatIsoDateString(area.validityEnd)}`}
                    </span>
                  </div>
                </ComboboxOption>
              ))}

              {!query && !areaSearchLoading && (
                <ComboboxOption
                  className={comboboxStyles.option()}
                  value={null}
                  disabled
                >
                  {t(($) => $.stops.stopArea.help)}
                </ComboboxOption>
              )}
            </ComboboxOptions>
          </Combobox>
        </div>
      </ModalBody>
      <NewModalFooter>
        <SimpleButton
          inverted
          onClick={handleClose}
          testId={testIds.cancelButton}
        >
          {t(($) => $.stopDetails.hybrid.cancel)}
        </SimpleButton>
        <SimpleButton
          onClick={handleConfirm}
          disabled={!canConfirm}
          testId={testIds.confirmButton}
        >
          {saving ? '...' : t(($) => $.stopDetails.hybrid.confirm)}
        </SimpleButton>
      </NewModalFooter>
    </Modal>
  );
};
