import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Column } from '../../../../../layoutComponents';
import { DetailRow } from '../../../stops/stop-details/layout';
import { TerminalComponentProps } from '../../types';

const testIds = {
  container: 'OwnerDetailsViewCard::container',
  name: 'OwnerDetailsViewCard::name',
  phone: 'OwnerDetailsViewCard::phone',
  email: 'OwnerDetailsViewCard::email',
  contractId: 'OwnerDetailsViewCard::contractId',
  note: 'OwnerDetailsViewCard::note',
  notSelectedPlaceholder: 'OwnerDetailsViewCard::notSelectedPlaceholder',
};

export const OwnerDetailsViewCard: FC<TerminalComponentProps> = ({
  terminal,
}) => {
  const { t } = useTranslation();

  const { owner } = terminal;

  return (
    <DetailRow className="text-sm" testId={testIds.container}>
      <Column>
        <div className="font-bold text-nowrap">
          {t('terminalDetails.owner.owner')}
        </div>
        {owner ? (
          <>
            <div className="text-nowrap" data-testid={testIds.name}>
              {owner.name ?? ''}
            </div>
            <div data-testid={testIds.phone}>{owner.phone ?? ''}</div>
            <div data-testid={testIds.email}>{owner.email ?? ''}</div>
          </>
        ) : (
          <div data-testid={testIds.notSelectedPlaceholder}>-</div>
        )}
      </Column>

      <Column>
        <div className="font-bold text-nowrap">
          {t('terminalDetails.owner.contractId')}
        </div>
        <div className="text-nowrap" data-testid={testIds.contractId}>
          {owner?.contractId ?? '-'}
        </div>
      </Column>

      <Column>
        <div className="font-bold text-nowrap">
          {t('terminalDetails.owner.note')}
        </div>
        <div data-testid={testIds.note}>{owner?.note ?? '-'}</div>
      </Column>
    </DetailRow>
  );
};
