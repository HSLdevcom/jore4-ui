import React from 'react';
import { useTranslation } from 'react-i18next';
import { SimpleButton } from '../../../uiComponents';

type Props = {
  onLimitChange: (limit?: number) => void;
  className?: string;
};

export const ListFooter = ({
  className = '',
  onLimitChange,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className={`${className || ''} flex`}>
      <SimpleButton
        containerClassName="ml-auto"
        onClick={() => onLimitChange(undefined)}
      >
        {t('routes.showAll')}
      </SimpleButton>
    </div>
  );
};
