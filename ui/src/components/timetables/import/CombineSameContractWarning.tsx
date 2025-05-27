import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdWarning } from 'react-icons/md';

type CombineSameContractWarningProps = {
  readonly className?: string;
  readonly iconClassName?: string;
};

export const CombineSameContractWarning: FC<
  CombineSameContractWarningProps
> = ({ className = '', iconClassName = '' }) => {
  const { t } = useTranslation();

  return (
    <div
      className={`relative mt-8 flex flex-row space-x-4 rounded-lg border border-hsl-highlight-yellow-dark bg-hsl-highlight-yellow-light p-6 ${className}`}
    >
      <MdWarning
        className={`mr-2 inline text-hsl-red ${iconClassName}`}
        role="img"
      />
      <div className="flex flex-row">
        {t('import.combineSameContractWarning')}
      </div>
    </div>
  );
};
