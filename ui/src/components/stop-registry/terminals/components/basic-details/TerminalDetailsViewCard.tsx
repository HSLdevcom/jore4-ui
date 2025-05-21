import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { AlternativeNames } from '../../../components/AlternativeNames/AlternativeNames';
import { DetailRow, LabeledDetail } from '../../../stops/stop-details/layout';
import { TerminalComponentProps } from '../../types';

const testIds = {
  privateCode: 'TerminalDetailsViewCard::privateCode',
  description: 'TerminalDetailsViewCard::description',
  name: 'TerminalDetailsViewCard::name',
  nameSwe: 'TerminalDetailsViewCard::nameSwe',
  terminalType: 'TerminalDetailsViewCard::terminalType',
  departurePlatforms: 'TerminalDetailsViewCard::departurePlatforms',
  arrivalPlatforms: 'TerminalDetailsViewCard::arrivalPlatforms',
  loadingPlatforms: 'TerminalDetailsViewCard::loadingPlatforms',
  electricCharging: 'TerminalDetailsViewCard::electricCharging',
};

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
        <LabeledDetail
          title={t('terminalDetails.basicDetails.name')}
          detail={terminal.name}
          testId={testIds.name}
        />
        <LabeledDetail
          title={t('terminalDetails.basicDetails.nameSwe')}
          detail={terminal.nameSwe}
          testId={testIds.nameSwe}
        />
        <LabeledDetail
          title={t('terminalDetails.basicDetails.description')}
          detail={terminal.description?.value}
          testId={testIds.description}
        />
      </DetailRow>
      {terminal.alternativeNames && (
        <AlternativeNames alternativeNames={terminal} />
      )}
      <DetailRow className={className}>
        <LabeledDetail
          title={t('terminalDetails.basicDetails.terminalType')}
          detail={terminal.terminalType}
          testId={testIds.terminalType}
        />
        <LabeledDetail
          title={t('terminalDetails.basicDetails.departurePlatforms')}
          detail={terminal.departurePlatforms}
          testId={testIds.departurePlatforms}
        />
        <LabeledDetail
          title={t('terminalDetails.basicDetails.arrivalPlatforms')}
          detail={terminal.arrivalPlatforms}
          testId={testIds.arrivalPlatforms}
        />
        <LabeledDetail
          title={t('terminalDetails.basicDetails.loadingPlatforms')}
          detail={terminal.loadingPlatforms}
          testId={testIds.loadingPlatforms}
        />
        <LabeledDetail
          title={t('terminalDetails.basicDetails.electricCharging')}
          detail={terminal.electricCharging}
          testId={testIds.electricCharging}
        />
      </DetailRow>
    </>
  );
};
