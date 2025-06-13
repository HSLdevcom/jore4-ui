import { DateTime } from 'luxon';
import React, { FC, useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ModalBody,
  ModalHeader,
  NewModalFooter,
} from '../../../../../uiComponents';
import { Modal } from '../../../../../uiComponents/modal/Modal';
import {
  ControlledElement,
  InputElementRenderProps,
} from '../../../../forms/common/ControlledElement';
import { SelectMemberStopsDropdownArea } from '../../../../forms/stop-area';
import { SelectedStop } from '../../../components/SelectMemberStops/schema';
import { SlimSimpleButton } from '../../../stops/stop-details/layout';
import { useGetStopVersions } from '../../../stops/versions/queries/useGetStopVersions';
import { StopVersion } from '../../../stops/versions/types';
import { StopVersionsList } from './StopVersionsList';

const testIds = {
  selectMemberStops: 'MemberStops::selectMemberStops',
  modal: 'MemberStops::modal',
  transferDateInput: 'MemberStops::transferDateInput',
};

type StopAreaMemberStopModalProps = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSave: () => void;
  readonly areaId: string | null | undefined;
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
  const formOnChangeRef = useRef<
    ((value: SelectedStop | undefined) => void) | null
  >(null);

  const stopVersionsResult = useGetStopVersions(
    showVersions && selectedStop?.publicCode ? selectedStop.publicCode : '',
  );

  const filteredStopVersions = useFilteredStopVersions(
    stopVersionsResult.stopVersions,
    selectedDate,
  );

  const resetState = useCallback(() => {
    setState(initialState);
    if (formOnChangeRef.current) {
      formOnChangeRef.current(undefined);
    }
  }, []);

  const updateState = useCallback((updates: Partial<ModalState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSave = () => {
    onSave();
    handleClose();
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

  const renderInputElement = useCallback(
    ({ value, onChange, testId }: InputElementRenderProps) => {
      formOnChangeRef.current = onChange;

      return (
        <SelectMemberStopsDropdownArea
          value={(value as unknown as SelectedStop) ?? undefined}
          testId={testId}
          onSelectionChange={(newValue) =>
            handleStopSelection(newValue, onChange)
          }
        />
      );
    },
    [handleStopSelection],
  );

  const hasSelection = !!selectedStop;
  const canFetchVersions =
    selectedStop?.publicCode && !stopVersionsResult.loading;
  const shouldShowVersionsList =
    showVersions && !stopVersionsResult.loading && filteredStopVersions;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      testId={testIds.modal}
      contentClassName="rounded-lg max-w-2xl w-full mx-4"
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
          <ControlledElement
            id="memberStops"
            testId={testIds.selectMemberStops}
            fieldPath="quays"
            inputElementRenderer={renderInputElement}
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
      </ModalBody>

      <NewModalFooter>
        <SlimSimpleButton type="button" onClick={handleClose}>
          {t('cancel')}
        </SlimSimpleButton>
        <SlimSimpleButton type="button" onClick={handleSave}>
          {t('move')}
        </SlimSimpleButton>
      </NewModalFooter>
    </Modal>
  );
};
