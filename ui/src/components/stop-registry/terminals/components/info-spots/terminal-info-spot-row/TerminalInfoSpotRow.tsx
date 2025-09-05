import { FC, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InfoSpotDetailsFragment } from '../../../../../../generated/graphql';
import { EnrichedParentStopPlace } from '../../../../../../types';
import { SimpleButton } from '../../../../../../uiComponents';
import { showSuccessToast, submitFormByRef } from '../../../../../../utils';
import { useInfoContainerControls } from '../../../../../common';
import { useEditTerminalInfoSpots } from '../queries';
import { TerminalInfoSpotsForm } from '../terminal-info-spots-form/TerminalInfoSpotsForm';
import { TerminalInfoSpotsViewCard } from '../TerminalInfoSpotsViewCard';
import { TerminalInfoSpotFormState, TerminalInfoSpotRowProps } from '../types';
import { mapTerminalInfoSpotDataToFormState } from '../utils';
import { TerminalInfoSpotRowHeader } from './TerminalInfoSpotRowHeader';

const testIds = {
  saveButton: 'TerminalInfoSpotRow::saveButton',
  cancelButton: 'TerminalInfoSpotRow::cancelButton',
};

const useExistingInfoSpotFormDefaultValues = (
  infoSpot: Readonly<InfoSpotDetailsFragment>,
  terminal: Readonly<EnrichedParentStopPlace>,
) => {
  const terminalInfoSpotsFormDefaultValues = useMemo(
    () => mapTerminalInfoSpotDataToFormState(infoSpot, terminal),
    [infoSpot, terminal],
  );

  return { terminalInfoSpotsFormDefaultValues };
};

export const TerminalInfoSpotRow: FC<TerminalInfoSpotRowProps> = ({
  infoSpot,
  index,
  terminal,
  openByDefault,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(openByDefault ?? false);
  const { saveTerminalInfoSpots, defaultErrorHandler } =
    useEditTerminalInfoSpots();

  const ariaControls = `TerminalInfoSpotsViewList::viewCard::${infoSpot.id ?? ''}`;

  const formRef = useRef<HTMLFormElement>(null);
  const infoContainerControls = useInfoContainerControls({
    isExpandable: true,
    isEditable: true,
    onSave: () => submitFormByRef(formRef),
  });
  const { isInEditMode } = infoContainerControls;

  const { terminalInfoSpotsFormDefaultValues } =
    useExistingInfoSpotFormDefaultValues(infoSpot, terminal);

  const onSubmit = async (state: TerminalInfoSpotFormState) => {
    try {
      await saveTerminalInfoSpots({ state });

      showSuccessToast(t('terminalDetails.editSuccess'));
      infoContainerControls.setIsInEditMode(false);
      setIsOpen(true);
    } catch (err) {
      defaultErrorHandler(err as Error);
    }
  };

  return (
    <>
      <TerminalInfoSpotRowHeader
        infoSpot={infoSpot}
        index={index}
        terminal={terminal}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        controls={infoContainerControls}
        ariaControls={ariaControls}
      />

      {isOpen && !isInEditMode && (
        <tr id={ariaControls}>
          <td colSpan={7} className="p-0">
            <div className="border-b border-border-hsl-commuter-train-purple shadow-lg">
              <TerminalInfoSpotsViewCard
                infoSpot={infoSpot}
                terminal={terminal}
              />
            </div>
          </td>
        </tr>
      )}

      {isOpen && isInEditMode && (
        <tr>
          <td colSpan={7} className="p-0">
            <div className="border-border-hsl-commuter-train-purple shadow-lg">
              <TerminalInfoSpotsForm
                defaultValues={terminalInfoSpotsFormDefaultValues}
                infoSpot={infoSpot}
                ref={formRef}
                terminal={terminal}
                onSubmit={onSubmit}
              />
            </div>

            <div className="flex items-center justify-end space-x-2 border-b border-border-hsl-commuter-train-purple bg-[--backgroundColor] px-4 py-2">
              <SimpleButton
                inverted
                onClick={infoContainerControls.onCancel}
                testId={testIds.cancelButton}
              >
                {t('cancel')}
              </SimpleButton>

              <SimpleButton
                onClick={infoContainerControls.onSave}
                testId={testIds.saveButton}
              >
                {t('save')}
              </SimpleButton>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};
