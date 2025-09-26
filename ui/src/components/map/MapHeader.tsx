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
    <Row className="absolute right-0 top-0 z-30 p-2.5">
      <PageTitle.H2 className="sr-only" titleText={t('map.pageTitle')}>
        {t('map.joreMap')}
      </PageTitle.H2>
      <CloseIconButton
        className="ml-auto bg-white p-2.5 font-bold text-brand shadow-md"
        label={t('close')}
        onClick={onClose}
        testId={testIds.closeButton}
      />
    </Row>
  );
};
