import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdDelete } from 'react-icons/md';
import { Popup } from 'react-map-gl/maplibre';
import { Column, Row } from '../../../layoutComponents';
import { Path, routeDetails } from '../../../router/routeDetails';
import { parseDate } from '../../../time';
import { EnrichedParentStopPlace } from '../../../types';
import { CloseIconButton, SimpleButton } from '../../../uiComponents';
import {
  findKeyValueParsed,
  getGeometryPoint,
  mapToValidityPeriod,
} from '../../../utils';

const testIds = {
  label: 'TerminalPopup::label',
  validityPeriod: 'TerminalPopup::validityPeriod',
  closeButton: 'TerminalPopup::closeButton',
  deleteButton: 'TerminalPopup::deleteButton',
  editButton: 'TerminalPopup::editButton',
  moveButton: 'TerminalPopup::moveButton',
};

type TerminalPopupProps = {
  readonly onClose: () => void;
  readonly onDelete: () => void;
  readonly onEdit: () => void;
  readonly onMove: () => void;
  readonly terminal: EnrichedParentStopPlace;
};

export const TerminalPopup: FC<TerminalPopupProps> = ({
  onClose,
  onDelete,
  onEdit,
  onMove,
  terminal,
}) => {
  const { t } = useTranslation();

  const point = getGeometryPoint(terminal.geometry);
  const terminalLabel = terminal.privateCode?.value;
  const terminalName = terminal.name ?? '';

  if (!point || !terminalLabel) {
    return null;
  }

  return (
    <Popup
      anchor="top"
      className="z-[3] mt-5 min-w-80"
      closeOnClick={false}
      closeButton={false}
      latitude={point.latitude}
      longitude={point.longitude}
    >
      <div className="p-2">
        <Row>
          <Column className="w-full">
            <Row className="items-center">
              <h3>
                <a
                  href={routeDetails[Path.terminalDetails].getLink(
                    terminalLabel,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  data-testid={testIds.label}
                  title={t('accessibility:terminals.showTerminalDetails', {
                    terminalLabel,
                  })}
                >
                  <span>{terminalLabel}</span> <span>{terminalName}</span>
                  <i className="icon-open-in-new" aria-hidden />
                </a>
              </h3>
              <CloseIconButton
                className="ml-auto"
                onClick={onClose}
                testId={testIds.closeButton}
              />
            </Row>
          </Column>
        </Row>

        <Row className="text-sm" testId={testIds.validityPeriod}>
          {mapToValidityPeriod(
            t,
            findKeyValueParsed(terminal, 'validityStart', parseDate),
            findKeyValueParsed(terminal, 'validityEnd', parseDate),
          )}
        </Row>

        <Row className="mt-16">
          <SimpleButton
            className="flex aspect-square h-[38px] w-[38px] items-center justify-center self-stretch p-0"
            disabled
            onClick={onDelete}
            inverted
            testId={testIds.deleteButton}
          >
            <MdDelete aria-label={t('remove')} className="text-xl" />
          </SimpleButton>

          <SimpleButton
            containerClassName="ml-auto"
            disabled
            onClick={onMove}
            testId={testIds.moveButton}
          >
            {t('move')}
          </SimpleButton>

          <SimpleButton
            containerClassName="ml-2"
            disabled
            onClick={onEdit}
            testId={testIds.editButton}
          >
            {t('edit')}
          </SimpleButton>
        </Row>
      </div>
    </Popup>
  );
};
