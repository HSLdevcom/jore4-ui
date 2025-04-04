import { StopRegistryAccessibilityLevel } from '../../../../../generated/graphql';
import { mapStopAccessibilityLevelToUiName } from '../../../../../i18n/uiNameMappings';

type AccessibilityLevelWithIcon = Exclude<
  StopRegistryAccessibilityLevel,
  StopRegistryAccessibilityLevel.Unknown
>;

interface Props {
  level: AccessibilityLevelWithIcon;
}

const iconFiles: Record<AccessibilityLevelWithIcon, string> = {
  fullyAccessible: 'accessibility_level_4.svg',
  mostlyAccessible: 'accessibility_level_3.svg',
  partiallyInaccessible: 'accessibility_level_2.svg',
  inaccessible: 'accessibility_level_1.svg',
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
