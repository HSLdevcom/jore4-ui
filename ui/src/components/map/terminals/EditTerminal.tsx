import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMap } from 'react-map-gl/maplibre';
import { useAppAction, useAppSelector } from '../../../hooks';
import {
  selectTerminalDraftEdits,
  setTerminalDraftEditsAction,
} from '../../../redux';
import { EnrichedParentStopPlace } from '../../../types';
import { ConfirmationDialog } from '../../../uiComponents';
import { getGeometryPoint } from '../../../utils';
import { useTerminalEdit } from './useTerminalEdit';

type EditTerminalProps = {
  readonly isOpen: boolean;
  readonly setIsOpen: (isOpen: boolean) => void;
  readonly terminal: EnrichedParentStopPlace;
};

export const EditTerminal: FC<EditTerminalProps> = ({
  isOpen,
  setIsOpen,
  terminal,
}) => {
  const { t } = useTranslation();
  const map = useMap();

  const { doUpdateTerminal } = useTerminalEdit();

  const terminalDraftEdits = useAppSelector(selectTerminalDraftEdits);
  const setTerminalDraftEdits = useAppAction(setTerminalDraftEditsAction);

  const onConfirmEditTerminal = async () => {
    if (!terminalDraftEdits) {
      return;
    }

    await doUpdateTerminal(terminalDraftEdits);
    setIsOpen(false);
    setTerminalDraftEdits(undefined);

    map.current?.easeTo({
      center: {
        lon: terminalDraftEdits.longitude,
        lat: terminalDraftEdits.latitude,
      },
    });
  };

  const onCancelEditTerminal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const point = getGeometryPoint(terminal.geometry);

    if (point) {
      map.current?.easeTo({
        center: {
          lon: point.longitude,
          lat: point.latitude,
        },
      });
    }
  }, [terminal.geometry, map]);

  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onCancel={onCancelEditTerminal}
      onConfirm={onConfirmEditTerminal}
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
