import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StopRegistryTransportModeType } from '../../../../../generated/graphql';
import { mapStopRegistryTransportModeTypeToUiName } from '../../../../../i18n/uiNameMappings';
import { StopWithDetails } from '../../../../../types';
import { JoreListbox, ListboxOptionItem } from '../../../../../uiComponents';
import { parseVehicleMode } from '../../../../../utils';
import {
  showDangerToastWithError,
  showSuccessToast,
} from '../../../../../utils/toastService';
import { SimpleButton } from '../../../../common/Buttons';
import {
  Modal,
  ModalBody,
  ModalHeader,
  NewModalFooter,
} from '../../../../common/Modals';
import { StopModalStopAreaFormSchema } from '../../../../forms/stop/types';
import { StopAreaSearchCombobox } from './StopAreaSearchCombobox';
import { useCreateMirrorQuay } from './useCreateMirrorQuay';

const testIds = {
  modal: 'MakeHybridStopModal',
  transportModeDropdown: 'MakeHybridStopModal::transportMode',
  stopAreaInput: 'MakeHybridStopModal::stopAreaInput',
  stopAreaOption: (code: string) => `MakeHybridStopModal::stopArea::${code}`,
  confirmButton: 'MakeHybridStopModal::confirm',
  cancelButton: 'MakeHybridStopModal::cancel',
};

const supportedTransportModes = [
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

  const [selectedMode, setSelectedMode] =
    useState<StopRegistryTransportModeType | null>(null);
  const [selectedStopArea, setSelectedStopArea] =
    useState<StopModalStopAreaFormSchema | null>(null);

  const { createMirrorQuay, loading: saving } = useCreateMirrorQuay();

  const currentTransportMode = parentStop?.stop_place?.transportMode ?? null;

  const availableModes = useMemo(
    () =>
      supportedTransportModes.filter((mode) => mode !== currentTransportMode),
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

  const vehicleMode = selectedMode ? parseVehicleMode(selectedMode) : null;

  const handleModeChange = (mode: StopRegistryTransportModeType) => {
    setSelectedMode(mode);
    setSelectedStopArea(null);
  };

  const resetState = () => {
    setSelectedMode(null);
    setSelectedStopArea(null);
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
            value={selectedMode ?? undefined}
            onChange={handleModeChange}
            testId={testIds.transportModeDropdown}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-bold">
            {t(($) => $.stopDetails.hybrid.stopArea)}
          </label>
          <StopAreaSearchCombobox
            vehicleMode={vehicleMode}
            value={selectedStopArea}
            onChange={setSelectedStopArea}
            disabled={!selectedMode}
            inputTestId={testIds.stopAreaInput}
            optionTestId={testIds.stopAreaOption}
          />
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
