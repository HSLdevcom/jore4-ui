import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Row } from '../../layoutComponents';
import { CloseIconButton } from '../../uiComponents';
import { PageTitle } from '../common';

const testIds = {
  closeButton: 'MapHeader::closeButton',
};

type MapHeaderProps = {
  readonly onClose: () => void;
};

export const MapHeader: FC<MapHeaderProps> = ({ onClose }) => {
  const { t } = useTranslation();
  return (
    <Row className="bg-white px-11 py-4">
      <PageTitle.H2 titleText={t('map.pageTitle')}>
        {t('map.joreMap')}
      </PageTitle.H2>
      <CloseIconButton
        className="ml-auto font-bold text-brand"
        label={t('close')}
        onClick={onClose}
        testId={testIds.closeButton}
      />
    </Row>
  );
};
