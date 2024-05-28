import { StopAccessibilityLevel } from '../../../../../hooks';
import { mapStopAccessibilityLevelToUiName } from '../../../../../i18n/uiNameMappings';

type AccessibilityLevelWithIcon = Exclude<
  StopAccessibilityLevel,
  StopAccessibilityLevel.Unknown
>;

interface Props {
  level: AccessibilityLevelWithIcon;
}

const iconFiles: Record<AccessibilityLevelWithIcon, string> = {
  FullyAccessible: 'accessibility_level_4.svg',
  MostlyAccessible: 'accessibility_level_3.svg',
  PartiallyInaccessible: 'accessibility_level_2.svg',
  Inaccessible: 'accessibility_level_1.svg',
};

export const AccessibilityLevelIcon = ({ level }: Props) => {
  const iconFile = iconFiles[level];
  const title = mapStopAccessibilityLevelToUiName(level);

  return (
    <i
      className="h-[44px] w-[44px] bg-cover"
      style={{ backgroundImage: `url(/img/${iconFile})` }}
      title={title}
    />
  );
};
