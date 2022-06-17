import React from 'react';
import { useTranslation } from 'react-i18next';
import { Column } from '../../../layoutComponents';
import { SimpleButton } from '../../../uiComponents';

interface Props {
  className?: string;
  onCreateRoute: () => void;
}

export const CreateRouteBox: React.FC<Props> = ({
  className = '',
  onCreateRoute,
}) => {
  const { t } = useTranslation();

  return (
    <Column
      className={`items-center border border-light-grey bg-background p-8 ${className}`}
    >
      <SimpleButton
        id="create-route-button"
        containerClassName="mb-4"
        onClick={onCreateRoute}
      >
        {t('lines.createNewRoute')}
      </SimpleButton>
      <span>{t('lines.createNewRouteInstructions')}</span>
    </Column>
  );
};
