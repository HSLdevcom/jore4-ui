import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EnrichedParentStopPlace } from '../../../../../types';
import { showSuccessToast, submitFormByRef } from '../../../../../utils';
import { InfoContainer, useInfoContainerControls } from '../../../../common';
import { terminalInfoContainerColors } from '../../terminalInfoContainerColors';
import { useEditTerminalInfoSpots } from './queries';
import { TerminalInfoSpotsForm } from './terminal-info-spots-form/TerminalInfoSpotsForm';
import { TerminalInfoSpotsHeaderButtons } from './TerminalInfoSpotsHeaderButtons';
import { TerminalInfoSpotsViewList } from './TerminalInfoSpotsViewList';
import {
  TerminalInfoSpotFormState,
  TerminalInfoSpotsSectionProps,
} from './types';
import { mapTerminalInfoSpotDataToFormState } from './utils';

const useNewInfoSpotFormDefaultValues = (
  terminal: Readonly<EnrichedParentStopPlace>,
) => {
  const terminalInfoSpotsFormDefaultValues = useMemo(
    () =>
      mapTerminalInfoSpotDataToFormState(
        { infoSpotLocations: [terminal.id ?? null] },
        terminal,
      ),
    [terminal],
  );

  return { terminalInfoSpotsFormDefaultValues };
};

export const TerminalInfoSpotsSection: FC<TerminalInfoSpotsSectionProps> = ({
  terminal,
  infoSpots,
}) => {
  const { t } = useTranslation();

  const { saveTerminalInfoSpots, defaultErrorHandler } =
    useEditTerminalInfoSpots();

  const formRef = useRef<HTMLFormElement>(null);

  const { terminalInfoSpotsFormDefaultValues } =
    useNewInfoSpotFormDefaultValues(terminal);

  const infoContainerControls = useInfoContainerControls({
    isExpandable: true,
    isEditable: true,
    onSave: () => submitFormByRef(formRef),
  });
  const { isInEditMode } = infoContainerControls;

  const [latestAdded, setLatestAdded] = useState<string | undefined>();
  const [formIsDirty, setFormIsDirty] = useState(false);

  const onSubmit = async (state: TerminalInfoSpotFormState) => {
    try {
      const createdInfoSpotId = await saveTerminalInfoSpots({ state });
      setLatestAdded(createdInfoSpotId);

      showSuccessToast(t('terminalDetails.editSuccess'));
      infoContainerControls.setIsInEditMode(false);
    } catch (err) {
      defaultErrorHandler(err as Error);
    }
  };

  useEffect(() => {
    if (!infoContainerControls.isExpanded) {
      setLatestAdded(undefined);
    }
  }, [infoContainerControls.isExpanded]);

  return (
    <InfoContainer
      colors={terminalInfoContainerColors}
      bodyClassName="p-0"
      controls={infoContainerControls}
      headerButtons={
        <TerminalInfoSpotsHeaderButtons
          controls={infoContainerControls}
          testIdPrefix="TerminalInfoSpotsSection"
        />
      }
      title={
        isInEditMode
          ? t('terminalDetails.infoSpots.addTerminalInfoSpot')
          : t('terminalDetails.infoSpots.title')
      }
      testIdPrefix="TerminalInfoSpotsSection"
      disableSaveButton={!formIsDirty}
    >
      {isInEditMode ? (
        <TerminalInfoSpotsForm
          defaultValues={terminalInfoSpotsFormDefaultValues}
          infoSpot={undefined}
          ref={formRef}
          terminal={terminal}
          onSubmit={onSubmit}
          setFormIsDirty={setFormIsDirty}
        />
      ) : (
        <TerminalInfoSpotsViewList
          infoSpots={infoSpots}
          terminal={terminal}
          latestAdded={latestAdded}
        />
      )}
    </InfoContainer>
  );
};
