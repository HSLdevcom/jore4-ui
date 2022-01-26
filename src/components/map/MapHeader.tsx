import React from 'react';
import { useTranslation } from 'react-i18next';
import { Row } from '../../layoutComponents';

interface Props {
  onClose: () => void;
}

export const MapHeader: React.FC<Props> = ({ onClose }) => {
  const { t } = useTranslation();
  return (
    <Row className="bg-white px-11 py-4">
      <h2 className="text-2xl font-bold">{t('map.joreMap')}</h2>
      <button
        className="ml-auto text-base font-bold text-brand"
        type="button"
        onClick={onClose}
      >
        {t('close')}
        <i className="icon-close-large ml-4 text-lg" />
      </button>
    </Row>
  );
};
