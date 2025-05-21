import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { EnrichedParentStopPlace } from '../../../../types';
import { mapToShortDate } from '../../../../time';
import { DetailRow, LabeledDetail } from '../../stops/stop-details/layout';

const testIds = {
  privateCode: 'TerminalDetails::privateCode',
  name: 'TerminalDetails::name',
  nameSwe: 'TerminalDetails::nameSwe',
  nameEng: 'TerminalDetails::nameEng',
  nameLongFin: 'TerminalDetails::nameLongFin',
  nameLongSwe: 'TerminalDetails::nameLongSwe',
  nameLongEng: 'TerminalDetails::nameLongEng',
  abbreviationFin: 'TerminalDetails::abbreviationFin',
  abbreviationSwe: 'TerminalDetails::abbreviationSwe',
  abbreviationEng: 'TerminalDetails::abbreviationEng',
  parentTerminal: 'TerminalDetails::parentTerminal',
  areaSize: 'TerminalDetails::areaSize',
  validityPeriod: 'TerminalDetails::validityPeriod',
};

export type TerminalComponentProps = {
  readonly terminal: EnrichedParentStopPlace;
  readonly className?: string;
};

function validityPeriod(terminal: EnrichedParentStopPlace) {
  const from = mapToShortDate(terminal.validityStart);
  const to = mapToShortDate(terminal.validityEnd);

  if (from ?? to) {
    return `${from ?? ''}-${to ?? ''}`;
  }

  return null;
}

export const TerminalDetailsView: FC<TerminalComponentProps> = ({
  terminal,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <>
      <DetailRow className={className}>
        <LabeledDetail
          title={t('terminalDetails.basicDetails.privateCode')}
          detail={terminal.privateCode?.value}
          testId={testIds.privateCode}
        />
      </DetailRow>
    </>
  );
};
