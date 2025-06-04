import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdInfoOutline } from 'react-icons/md';
import { twMerge } from 'tailwind-merge';

type StopAreaMemberNoStopsProps = {
  readonly className?: string;
};

export const StopAreaMemberNoStops: FC<StopAreaMemberNoStopsProps> = ({
  className,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={twMerge(
        'mt-4 flex w-full flex-row items-center justify-start gap-2',
        className,
      )}
    >
      <MdInfoOutline className="text-2xl text-brand" aria-hidden />
      {t('stopArea.noStops')}
    </div>
  );
};
