import { useTranslation } from 'react-i18next';

interface Props {
  className?: string;
  hasTimetables?: boolean;
}

/**
 * A calendar icon, that has a translated title for screenreaders.
 * If the line doesn't have timetables, the title is gone and the icon is greyed out.
 *
 * The title helps make sense of the row as a whole for screenreaders.
 * @param hasTimetables defines the icons color and title
 * @returns A calendar icon
 */
export const TimetableIcon = ({
  className = '',
  hasTimetables = false,
}: Props) => {
  const { t } = useTranslation(); // TODO: Can't use in parent because it's not a hook?
  const iconTitle = hasTimetables
    ? t('accessibility:title.timetable.icon')
    : '';
  const fontColor = hasTimetables ? 'text-tweaked-brand' : 'text-zinc-400';
  return (
    <i
      className={`icon-calendar ${fontColor} ${className}`}
      title={iconTitle}
      role="img"
    />
  );
};
