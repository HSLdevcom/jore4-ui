import React from 'react';
import { useTranslation } from 'react-i18next';
import { Column } from '../../../layoutComponents';
import { SimpleButton } from '../../../uiComponents';

interface Props {
  className?: string;
  onCreateRoute?: () => void;
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
      {onCreateRoute && (
        <SimpleButton
          id="create-route-button"
          containerClassName="mb-4"
          onClick={onCreateRoute}
        >
          {t('lines.createNewRoute')}
        </SimpleButton>
      )}
      {onCreateRoute ? (
        <span>{t('lines.createNewRouteInstructions')}</span>
      ) : (
        <span>{t('lines.cannotCreateRoute')}</span>
      )}
    </Column>
  );
};
