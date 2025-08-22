import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AccordionButton } from '../../../../../uiComponents';
import { formatSizedDbItem } from '../../../stops/stop-details/info-spots/utils';
import { TerminalInfoSpotsViewCard } from './TerminalInfoSpotsViewCard';
import { TerminalInfoSpotRowProps } from './types';
import {
  CSS_CLASSES,
  formatDisplayValue,
  resolveQuayPublicCode,
  resolveShelterNumber,
} from './utils';

const testIds = {
  toggle: 'TerminalInfoSpotRow::toggle',
  detailsRow: 'TerminalInfoSpotRow::detailsRow',
  labelCell: 'TerminalInfoSpotRow::labelCell',
  quayPublicCodeCell: 'TerminalInfoSpotRow::quayPublicCodeCell',
  shelterNumberCell: 'TerminalInfoSpotRow::shelterNumberCell',
  purposeCell: 'TerminalInfoSpotRow::purposeCell',
  sizeCell: 'TerminalInfoSpotRow::sizeCell',
  descriptionCell: 'TerminalInfoSpotRow::descriptionCell',
  actionCell: 'TerminalInfoSpotRow::actionCell',
};

function getRowClassName(isOpen: boolean, index: number): string {
  if (isOpen) {
    return CSS_CLASSES.openRow;
  }
  return index % 2 === 1 ? CSS_CLASSES.evenRow : CSS_CLASSES.oddRow;
}

export const TerminalInfoSpotRow: FC<TerminalInfoSpotRowProps> = ({
  infoSpot,
  location,
  index,
  terminal,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const controls = `TerminalInfoSpotsViewList::viewCard::${infoSpot.id ?? ''}`;
  const quayPublicCode = resolveQuayPublicCode(infoSpot, terminal);
  const shelterNumber = resolveShelterNumber(infoSpot, terminal);

  const accordionButton = (
    <AccordionButton
      testId={testIds.toggle}
      isOpen={isOpen}
      onToggle={setIsOpen}
      iconClassName="text-3xl"
      openTooltip={t('terminalDetails.infoSpots.openDetails')}
      closeTooltip={t('terminalDetails.infoSpots.closeDetails')}
      controls={controls}
      ariaLabel={infoSpot.label ?? ''}
    />
  );

  return (
    <>
      <tr
        className={getRowClassName(isOpen, index)}
        data-testid={testIds.detailsRow}
      >
        {isOpen ? (
          <td colSpan={7} className="py-5 pl-5 pr-3">
            <span className="text-xl">
              {t('stopDetails.infoSpots.infoSpot', {
                infoSpot: infoSpot.label,
              })}
            </span>
            <div className="float-right text-right align-middle">
              {accordionButton}
            </div>
          </td>
        ) : (
          <>
            <td
              className={CSS_CLASSES.tableCell}
              data-testid={testIds.labelCell}
            >
              {formatDisplayValue(infoSpot.label)}
            </td>
            <td
              className={CSS_CLASSES.tableCell}
              data-testid={testIds.quayPublicCodeCell}
            >
              {formatDisplayValue(quayPublicCode)}
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
              {formatDisplayValue(infoSpot.purpose)}
            </td>
            <td
              className={CSS_CLASSES.tableCell}
              data-testid={testIds.sizeCell}
            >
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

      {isOpen && (
        <tr id={controls}>
          <td colSpan={7} className="p-0">
            <TerminalInfoSpotsViewCard
              infoSpot={infoSpot}
              location={location}
            />
          </td>
        </tr>
      )}
    </>
  );
};
