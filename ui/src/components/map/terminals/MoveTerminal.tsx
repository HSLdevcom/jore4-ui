import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useMap } from 'react-map-gl/maplibre';
import { useAppAction } from '../../../hooks';
import {
  MapEntityEditorViewState,
  setMapTerminalViewStateAction,
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
  readonly newTerminalLocation: {
    longitude: number;
    latitude: number;
  } | null;
  readonly setNewTerminalLocation: (
    location: {
      longitude: number;
      latitude: number;
    } | null,
  ) => void;
};

export const MoveTerminal: FC<MoveTerminalProps> = ({
  isOpen,
  terminal,
  setIsOpen,
  newTerminalLocation,
  setNewTerminalLocation,
}) => {
  const { t } = useTranslation();
  const map = useMap();

  const { doUpdateTerminal } = useTerminalEdit();

  const setMapTerminalViewState = useAppAction(setMapTerminalViewStateAction);

  const onConfirmMoveStopArea = async () => {
    if (!newTerminalLocation) {
      return;
    }

    const { longitude, latitude } = newTerminalLocation;
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
    setNewTerminalLocation(null);

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
