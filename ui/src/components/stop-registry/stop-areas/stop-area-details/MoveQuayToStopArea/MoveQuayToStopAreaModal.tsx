import { DateTime } from 'luxon';
import { ChangeEventHandler, FC, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Row } from '../../../../../layoutComponents';
import {
  CloseIconButton,
  ModalBody,
  NewModalFooter,
} from '../../../../../uiComponents';
import { Modal } from '../../../../../uiComponents/modal/Modal';
import { showSuccessToast } from '../../../../../utils';
import { SelectStopDropdown } from '../../../components/SelectMemberStops';
import { SelectedStop } from '../../../components/SelectMemberStops/common/schema';
import { SlimSimpleButton } from '../../../stops/stop-details/layout';
import { useGetStopVersions } from '../../../stops/versions/queries/useGetStopVersions';
import { StopVersion } from '../../../stops/versions/types';
import { useGetStopAreaVersions } from '../../versions/queries/useGetStopAreaVersions';
import { StopAreaVersion } from '../../versions/types';
import { FutureVersionsAlertPopover } from './FutureVersionsAlertPopover';
import { StopVersionsList } from './StopVersionsList';
import { useMoveQuayToStopPlace } from './useMoveQuayToStopPlace';

const testIds = {
  selectMemberStops: 'MemberStops::selectMemberStops',
  modal: 'MemberStops::modal',
  transferDateInput: 'MemberStops::transferDateInput',
  getStopVersionsButton: 'MemberStops::getStopVersionsButton',
  saveButton: 'MemberStops::saveButton',
  closeButton: 'MembersStops::closeButton',
};

type MoveQuayToStopAreaModalProps = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSave: () => void;
  readonly areaId: string;
  readonly areaPrivateCode: string;
  readonly refetch: () => Promise<unknown>;
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

// Remove versions that end before the selected date
const useRemovePastStopAreaVersions = (
  stopAreaVersions: ReadonlyArray<StopAreaVersion> | null | undefined,
  selectedDate: Readonly<string>,
): ReadonlyArray<StopAreaVersion> | null | undefined => {
  return useMemo(() => {
    if (!stopAreaVersions || !selectedDate) {
      return stopAreaVersions;
    }

    const filterDate = DateTime.fromISO(selectedDate).startOf('day');
    return stopAreaVersions?.filter(
      (version) =>
        version.validity_end === null || version.validity_end >= filterDate,
    );
  }, [selectedDate, stopAreaVersions]);
};

export const MoveQuayToStopAreaModal: FC<MoveQuayToStopAreaModalProps> = ({
  isOpen,
  onClose,
  onSave,
  areaId,
  areaPrivateCode,
  refetch,
}) => {
  const { t } = useTranslation();
  const [state, setState] = useState<ModalState>(initialState);
  const { selectedStop, selectedDate, showVersions } = state;

  const {
    moveQuayToStopPlace,
    loading: moveLoading,
    error: moveError,
    defaultErrorHandler,
    reset: resetMoveError,
  } = useMoveQuayToStopPlace();

  const stopVersionsResult = useGetStopVersions(
    showVersions && selectedStop?.publicCode ? selectedStop.publicCode : '',
  );
  const filteredStopVersions = useFilteredStopVersions(
    stopVersionsResult.stopVersions,
    selectedDate,
  );

  // Wait for the modal to be opened before fetching stop area versions
  const stopAreaVersionsResult = useGetStopAreaVersions(
    isOpen ? areaPrivateCode : '',
  );
  const filteredStopAreaVersions = useRemovePastStopAreaVersions(
    stopAreaVersionsResult.stopAreaVersions,
    selectedDate,
  );
  const hasMultipleFutureStopAreaVersions =
    filteredStopAreaVersions?.length && filteredStopAreaVersions.length > 1;

  const resetState = useCallback(() => {
    setState(initialState);
  }, []);

  const updateState = useCallback((updates: Partial<ModalState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleClose = () => {
    resetState();

    if (resetMoveError) {
      resetMoveError();
    }
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
      await refetch();

      showSuccessToast(t('stopAreaDetails.memberStops.moveSuccess'));

      onSave();
      handleClose();
    } catch (error) {
      defaultErrorHandler(error as Error);
    }
  };

  const handleStopSelection = useCallback(
    (
      newValue: SelectedStop | null,
      formOnChange?: (value: SelectedStop | null) => void,
    ) => {
      updateState({
        selectedStop: newValue,
        showVersions: false,
      });

      if (formOnChange) {
        formOnChange(newValue);
      }
    },
    [updateState],
  );

  const handleDateChange: ChangeEventHandler<HTMLInputElement> = (event) => {
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
      <Row className="flex flex-row items-center border border-light-grey bg-background px-10 py-7">
        <h2>{t('stopAreaDetails.memberStops.moveStopToArea')}</h2>
        {hasMultipleFutureStopAreaVersions ? (
          <FutureVersionsAlertPopover className="ml-4" />
        ) : null}
        <CloseIconButton
          className="ml-auto"
          onClick={onClose}
          testId={testIds.closeButton}
        />
      </Row>

      <ModalBody className="!mx-0 !my-0">
        <div className="mx-8 my-8">
          <div className="mb-2 text-sm font-bold">
            {t('stopAreaDetails.memberStops.getStop')}
          </div>
          <SelectStopDropdown
            value={selectedStop ?? null}
            testId={testIds.selectMemberStops}
            onSelectionChange={(newValue) =>
              handleStopSelection(newValue, undefined)
            }
            areaId={areaId}
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
            {t('stopAreaDetails.memberStops.moveError', {
              reason: moveError.message,
            })}
          </div>
        )}
      </ModalBody>

      <NewModalFooter>
        <SlimSimpleButton
          type="button"
          onClick={handleClose}
          disabled={isSaving}
          inverted
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
