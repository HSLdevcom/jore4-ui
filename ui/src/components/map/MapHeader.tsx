import React from 'react';
import { useTranslation } from 'react-i18next';
import { Row } from '../../layoutComponents';
import { CloseIconButton } from '../../uiComponents';

const testIds = {
  closeButton: 'MapHeader::closeButton',
};

interface Props {
  onClose: () => void;
}

export const MapHeader: React.FC<Props> = ({ onClose }) => {
  const { t } = useTranslation();
  return (
    <Row className="bg-white px-11 py-4">
      <h2>{t('map.joreMap')}</h2>
      <CloseIconButton
        className="ml-auto font-bold text-brand"
        label={t('close')}
        onClick={onClose}
        testId={testIds.closeButton}
      />
    </Row>
  );
};
