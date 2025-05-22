import { FC } from 'react';
import { useTranslation } from 'react-i18next';

type TimetableIconProps = {
  readonly className?: string;
  readonly hasTimetables?: boolean;
};

/**
 * A calendar icon, that has a translated title for screenreaders.
 * If the line doesn't have timetables, the title is gone and the icon is greyed out.
 *
 * The title helps make sense of the row as a whole for screenreaders.
 * @param hasTimetables defines the icons color and title
 * @returns A calendar icon
 */
export const TimetableIcon: FC<TimetableIconProps> = ({
  className = '',
  hasTimetables = false,
}) => {
  const { t } = useTranslation();
  const iconTitle = hasTimetables ? t('accessibility:timetables.icon') : '';
  const fontColor = hasTimetables ? 'text-tweaked-brand' : 'text-zinc-400';
  return (
    <i
      className={`icon-calendar ${fontColor} ${className}`}
      title={iconTitle}
      role="img"
    />
  );
};
