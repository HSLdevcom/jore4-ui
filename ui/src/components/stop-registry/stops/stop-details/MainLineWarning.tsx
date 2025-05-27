import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdWarning } from 'react-icons/md';
import { Visible } from '../../../../layoutComponents';

const testIds = {
  warning: 'MainLineWarning::warning',
};

type MainLineWarningProps = {
  readonly className?: string;
  readonly isMainLineStop: boolean;
  readonly hasMainLineSign: boolean;
};

export const MainLineWarning: FC<MainLineWarningProps> = ({
  isMainLineStop,
  hasMainLineSign,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <Visible
      visible={
        (isMainLineStop && !hasMainLineSign) ||
        (!isMainLineStop && hasMainLineSign)
      }
    >
      <MdWarning
        data-testid={testIds.warning}
        className={`mr-2 inline h-6 w-6 text-hsl-red ${className}`}
        role="img"
        title={t('stopDetails.mainLineWarning')}
      />
    </Visible>
  );
};
