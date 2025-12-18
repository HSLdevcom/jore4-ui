import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AccordionButton,
  CloseIconButton,
  SimpleButton,
} from '../../../../../../uiComponents';
import {
  formatPurposeForDisplay,
  formatSizedDbItem,
} from '../../../../stops/stop-details/info-spots/utils';
import { TerminalInfoSpotRowHeaderProps } from '../types';
import {
  CSS_CLASSES,
  formatDisplayValue,
  resolveInfoSpotQuay,
  resolveQuayStopPlaceName,
  resolveShelterNumber,
} from '../utils';

const testIds = {
  toggle: 'TerminalInfoSpotRow::toggle',
  detailsRow: 'TerminalInfoSpotRow::detailsRow',
  idAndQuayCell: 'TerminalInfoSpotRow::idAndQuayCell',
  labelCell: 'TerminalInfoSpotRow::labelCell',
  quayPublicCodeCell: 'TerminalInfoSpotRow::quayPublicCodeCell',
  shelterNumberCell: 'TerminalInfoSpotRow::shelterNumberCell',
  purposeCell: 'TerminalInfoSpotRow::purposeCell',
  sizeCell: 'TerminalInfoSpotRow::sizeCell',
  descriptionCell: 'TerminalInfoSpotRow::descriptionCell',
  actionCell: 'TerminalInfoSpotRow::actionCell',
  editButton: 'TerminalInfoSpotRow::editButton',
  closeButton: 'TerminalInfoSpotRow::closeButton',
};

function getRowClassName(isOpen: boolean, index: number): string {
  if (isOpen) {
    return CSS_CLASSES.openRow;
  }
  return index % 2 === 1 ? CSS_CLASSES.evenRow : CSS_CLASSES.oddRow;
}

export const TerminalInfoSpotRowHeader: FC<TerminalInfoSpotRowHeaderProps> = ({
  infoSpot,
  index,
  terminal,
  isOpen,
  setIsOpen,
  controls: { isInEditMode, setIsInEditMode },
  ariaControls,
}) => {
  const { t } = useTranslation();
  const infoSpotQuay = resolveInfoSpotQuay(infoSpot, terminal);
  const shelterNumber = resolveShelterNumber(infoSpot, terminal);
  const stopPlaceName = resolveQuayStopPlaceName(terminal, infoSpotQuay?.id);

  const accordionButton = (
    <AccordionButton
      testId={testIds.toggle}
      isOpen={isOpen}
      onToggle={setIsOpen}
      iconClassName="text-3xl"
      openTooltip={t('terminalDetails.infoSpots.openDetails')}
      closeTooltip={t('terminalDetails.infoSpots.closeDetails')}
      controls={ariaControls}
      ariaLabel={infoSpot.label ?? ''}
    />
  );

  return (
    <tr
      className={getRowClassName(isOpen, index)}
      data-testid={testIds.detailsRow}
    >
      {isOpen ? (
        <td colSpan={7} className="p-0">
          <div className="border-t border-border-hsl-commuter-train-purple py-3 pl-5 pr-3 xl:py-5">
            <span className="text-xl" data-testid={testIds.idAndQuayCell}>
              {infoSpotQuay
                ? t('terminalDetails.infoSpots.infoSpotWithQuay', {
                    infoSpot: infoSpot.label,
                    quayPublicCode: infoSpotQuay.publicCode,
                    quayName: stopPlaceName?.name?.value,
                  })
                : t('terminalDetails.infoSpots.infoSpot', {
                    infoSpot: infoSpot.label,
                  })}
            </span>

            {isInEditMode ? (
              <div className="float-right flex h-8 w-8 items-center justify-center space-x-2 text-right align-middle">
                <CloseIconButton
                  onClick={() => {
                    setIsInEditMode(false);
                    setIsOpen(false);
                  }}
                  testId={testIds.closeButton}
                />
              </div>
            ) : (
              <div className="float-right flex space-x-2 text-right align-middle">
                <SimpleButton
                  shape="slim"
                  onClick={() => setIsInEditMode(true)}
                  inverted
                  testId={testIds.editButton}
                >
                  {t('edit')}
                </SimpleButton>

                {accordionButton}
              </div>
            )}
          </div>
        </td>
      ) : (
        <>
          <td className={CSS_CLASSES.tableCell} data-testid={testIds.labelCell}>
            {formatDisplayValue(infoSpot.label)}
          </td>
          <td
            className={CSS_CLASSES.tableCell}
            data-testid={testIds.quayPublicCodeCell}
          >
            {formatDisplayValue(infoSpotQuay?.publicCode)}
          </td>
          <td
            className={CSS_CLASSES.tableCell}
            data-testid={testIds.shelterNumberCell}
          >
            {formatDisplayValue(shelterNumber)}
          </td>
          <td
            className={CSS_CLASSES.tableCell}
            data-testid={testIds.purposeCell}
          >
            {formatPurposeForDisplay(t, infoSpot.purpose)}
          </td>
          <td className={CSS_CLASSES.tableCell} data-testid={testIds.sizeCell}>
            {formatSizedDbItem(t, infoSpot)}
          </td>
          <td
            className={CSS_CLASSES.descriptionCell}
            data-testid={testIds.descriptionCell}
          >
            {formatDisplayValue(infoSpot.description?.value)}
          </td>
          <td
            className={`${CSS_CLASSES.actionCell} text-right align-middle`}
            data-testid={testIds.actionCell}
          >
            {accordionButton}
          </td>
        </>
      )}
    </tr>
  );
};
