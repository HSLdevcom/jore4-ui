import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useMap } from 'react-map-gl/maplibre';
import { useAppAction, useAppSelector } from '../../../hooks';
import {
  MapEntityEditorViewState,
  selectDraftTerminalLocation,
  setMapTerminalViewStateAction,
  setTerminalDraftLocationAction,
} from '../../../redux';
import { EnrichedParentStopPlace } from '../../../types';
import { ConfirmationDialog } from '../../../uiComponents';
import { mapPointToStopRegistryGeoJSON } from '../../../utils';
import { mapTerminalDataToFormState } from '../../stop-registry/terminals/components/basic-details/basic-details-form/TerminalDetailsEdit';
import { useTerminalEdit } from './useTerminalEdit';

type MoveTerminalProps = {
  readonly isOpen: boolean;
  readonly setIsOpen: (isOpen: boolean) => void;
  readonly terminal: EnrichedParentStopPlace;
};

export const MoveTerminal: FC<MoveTerminalProps> = ({
  isOpen,
  terminal,
  setIsOpen,
}) => {
  const { t } = useTranslation();
  const map = useMap();

  const { doUpdateTerminal } = useTerminalEdit();

  const draftLocation = useAppSelector(selectDraftTerminalLocation);
  const setDraftLocation = useAppAction(setTerminalDraftLocationAction);
  const setMapTerminalViewState = useAppAction(setMapTerminalViewStateAction);

  const onConfirmMoveStopArea = async () => {
    if (!draftLocation) {
      return;
    }

    const { longitude, latitude } = draftLocation;
    const geometry = mapPointToStopRegistryGeoJSON({
      longitude,
      latitude,
    });

    const terminalFormState = mapTerminalDataToFormState({
      ...terminal,
      geometry,
    });

    await doUpdateTerminal(terminalFormState);
    setIsOpen(false);
    setDraftLocation(undefined);

    map.current?.easeTo({
      center: {
        lon: longitude,
        lat: latitude,
      },
    });
  };

  const onCancelMoveTerminal = () => {
    setIsOpen(false);
    setMapTerminalViewState(MapEntityEditorViewState.POPUP);
  };

  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onCancel={onCancelMoveTerminal}
      onConfirm={onConfirmMoveStopArea}
      title={t('confirmEditTerminalDialog.title')}
      description={t('confirmEditTerminalDialog.description', {
        terminalName: terminal.name ?? '',
      })}
      confirmText={t('confirmEditTerminalDialog.confirmText')}
      cancelText={t('cancel')}
      widthClassName="w-235"
    />
  );
};
