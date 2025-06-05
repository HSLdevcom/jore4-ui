import { DateTime } from 'luxon';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ModalBody,
  ModalHeader,
  NewModalFooter,
} from '../../../../../uiComponents';
import { Modal } from '../../../../../uiComponents/modal/Modal';
import { SelectMemberStopsDropdownArea } from '../../../../forms/stop-area';
import { useMoveQuayToStopPlace } from '../../../../forms/stop-area/SelectMemberStopsDropdown/useMoveQuayToStopPlace';
import { SelectedStop } from '../../../components/SelectMemberStops/schema';
import { SlimSimpleButton } from '../../../stops/stop-details/layout';
import { useGetStopVersions } from '../../../stops/versions/queries/useGetStopVersions';
import { StopVersion } from '../../../stops/versions/types';
import { StopVersionsList } from './StopVersionsList';

const testIds = {
  selectMemberStops: 'MemberStops::selectMemberStops',
  modal: 'MemberStops::modal',
  transferDateInput: 'MemberStops::transferDateInput',
  getStopVersionsButton: 'MemberStops::getStopVersionsButton',
  saveButton: 'MemberStops::saveButton',
};

type StopAreaMemberStopModalProps = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSave: () => void;
  readonly areaId: string;
};

type ModalState = {
  readonly selectedStop: SelectedStop | null;
  readonly selectedDate: string;
  readonly showVersions: boolean;
};

const initialState: ModalState = {
  selectedStop: null,
  selectedDate: new Date().toISOString().split('T')[0],
  showVersions: false,
};

const useFilteredStopVersions = (
  stopVersions: ReadonlyArray<StopVersion> | null | undefined,
  selectedDate: Readonly<string>,
): ReadonlyArray<StopVersion> | null | undefined => {
  return useMemo(() => {
    if (!stopVersions || !selectedDate) {
      return stopVersions;
    }

    const filterDate = DateTime.fromISO(selectedDate);
    return stopVersions.filter((version: StopVersion) => {
      const isValidOnDate =
        version.validity_start <= filterDate &&
        (version.validity_end === null || version.validity_end >= filterDate);
      const isFutureVersion = version.validity_start > filterDate;
      return isValidOnDate ?? isFutureVersion;
    });
  }, [stopVersions, selectedDate]);
};

export const StopAreaMemberStopModal: FC<StopAreaMemberStopModalProps> = ({
  isOpen,
  onClose,
  onSave,
  areaId,
}) => {
  const { t } = useTranslation();
  const [state, setState] = useState<ModalState>(initialState);
  const { selectedStop, selectedDate, showVersions } = state;

  const {
    moveQuayToStopPlace,
    loading: moveLoading,
    error: moveError,
    defaultErrorHandler,
  } = useMoveQuayToStopPlace();

  const stopVersionsResult = useGetStopVersions(
    showVersions && selectedStop?.publicCode ? selectedStop.publicCode : '',
  );

  const filteredStopVersions = useFilteredStopVersions(
    stopVersionsResult.stopVersions,
    selectedDate,
  );

  const resetState = useCallback(() => {
    setState(initialState);
  }, []);

  const updateState = useCallback((updates: Partial<ModalState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSave = async () => {
    if (!selectedStop?.publicCode) {
      return;
    }

    const saveParams = {
      toStopPlaceId: areaId,
      quayIds: [selectedStop.quayId],
      moveQuayFromDate: selectedDate,
      fromVersionComment: `Moved quay on ${selectedDate}`,
      toVersionComment: `Added quay on ${selectedDate}`,
    };

    try {
      await moveQuayToStopPlace(saveParams);

      onSave();
      handleClose();
    } catch (error) {
      defaultErrorHandler(error as Error);
    }
  };

  const handleStopSelection = useCallback(
    (
      newValue: SelectedStop | undefined,
      formOnChange?: (value: SelectedStop | undefined) => void,
    ) => {
      const stopValue = newValue ?? null;
      updateState({
        selectedStop: stopValue,
        showVersions: false,
      });

      if (formOnChange) {
        formOnChange(newValue);
      }
    },
    [updateState],
  );

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateState({ selectedDate: event.target.value });
  };

  const handleGetStopVersions = () => {
    if (selectedStop?.publicCode) {
      updateState({ showVersions: true });
    }
  };

  const hasSelection = !!selectedStop;
  const canFetchVersions =
    selectedStop?.publicCode && !stopVersionsResult.loading;
  const shouldShowVersionsList =
    showVersions && !stopVersionsResult.loading && filteredStopVersions;

  const isSaving = moveLoading;
  const canSave = hasSelection && !isSaving;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      testId={testIds.modal}
      contentClassName="rounded-lg max-w-2xl w-full mx-4 drop-shadow-none"
    >
      <ModalHeader
        onClose={handleClose}
        heading={t('stopAreaDetails.memberStops.moveStopToArea')}
      />

      <ModalBody className="!mx-0 !my-0">
        <div className="mx-8 my-8">
          <div className="mb-2 text-sm font-bold">
            {t('stopAreaDetails.memberStops.getStop')}
          </div>
          <SelectMemberStopsDropdownArea
            value={selectedStop ?? undefined}
            testId={testIds.selectMemberStops}
            onSelectionChange={(newValue) =>
              handleStopSelection(newValue, undefined)
            }
          />
        </div>

        {hasSelection && (
          <div className="border-t border-light-grey bg-background px-8 py-8">
            <label className="block" htmlFor="observation-date-input">
              {t('stopAreaDetails.memberStops.transferDate')}
            </label>
            <input
              type="date"
              id="observation-date-input"
              data-testid={testIds.transferDateInput}
              value={selectedDate}
              onChange={handleDateChange}
            />
            <SlimSimpleButton
              className="ml-5"
              inverted
              type="button"
              onClick={handleGetStopVersions}
              disabled={!canFetchVersions}
              testId={testIds.getStopVersionsButton}
            >
              {stopVersionsResult.loading
                ? t('loading')
                : t(
                    'stopAreaDetails.memberStops.actionButtons.getStopVersions',
                  )}
            </SlimSimpleButton>

            {shouldShowVersionsList && (
              <StopVersionsList
                versions={filteredStopVersions}
                title={t('stopAreaDetails.memberStops.stopVersions')}
              />
            )}
          </div>
        )}

        {moveError && (
          <div className="mx-8 mb-4 rounded border border-red-400 bg-red-100 p-3 text-red-700">
            {t('stopAreaDetails.memberStops.moveError')}: {moveError.message}
          </div>
        )}
      </ModalBody>

      <NewModalFooter>
        <SlimSimpleButton
          type="button"
          onClick={handleClose}
          disabled={isSaving}
        >
          {t('cancel')}
        </SlimSimpleButton>
        <SlimSimpleButton
          className="opacity-100"
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          testId={testIds.saveButton}
        >
          {isSaving ? t('moving') : t('move')}
        </SlimSimpleButton>
      </NewModalFooter>
    </Modal>
  );
};
