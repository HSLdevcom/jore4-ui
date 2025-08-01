import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMap } from 'react-map-gl/maplibre';
import { EnrichedParentStopPlace } from '../../../types';
import { ConfirmationDialog } from '../../../uiComponents';
import { getGeometryPoint } from '../../../utils';
import { TerminalFormState } from '../../stop-registry/terminals/components/basic-details/basic-details-form/schema';
import { useTerminalEdit } from './useTerminalEdit';

type EditTerminalProps = {
  readonly isOpen: boolean;
  readonly setIsOpen: (isOpen: boolean) => void;
  readonly terminal: EnrichedParentStopPlace;
  readonly terminalEditChanges: TerminalFormState | null;
  readonly setTerminalEditChanges: (
    terminalEditChanges: TerminalFormState | null,
  ) => void;
};

export const EditTerminal: FC<EditTerminalProps> = ({
  isOpen,
  setIsOpen,
  terminal,
  terminalEditChanges,
  setTerminalEditChanges,
}) => {
  const { t } = useTranslation();
  const map = useMap();

  const { doUpdateTerminal } = useTerminalEdit();

  const onConfirmEditTerminal = async () => {
    if (!terminalEditChanges) {
      return;
    }

    await doUpdateTerminal(terminalEditChanges);
    setIsOpen(false);
    setTerminalEditChanges(null);

    map.current?.easeTo({
      center: {
        lon: terminalEditChanges.longitude,
        lat: terminalEditChanges.latitude,
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
