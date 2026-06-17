import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twJoin, twMerge } from 'tailwind-merge';
import { StopRegistryTransportModeType } from '../../../generated/graphql';
import {
  getTransportModeIcon,
  getTransportModeIconTitle,
} from '../utils/getTransportModeIcon';

const testIds = {
  unknownType: 'StopTransportModeIcon::unknown',
  icon: 'StopTransportModeIcon::icon',
};

type StopTransportModeIconProps = {
  readonly className?: string;
  readonly mode: StopRegistryTransportModeType | null | undefined;
  readonly active: boolean;
  readonly trunkLine: boolean;
  readonly speedTram: boolean;
};

export const StopTransportModeIcon: FC<StopTransportModeIconProps> = ({
  className,
  mode,
  active,
  trunkLine,
  speedTram,
}) => {
  const { t } = useTranslation();

  if (!mode) {
    return (
      <i
        className={twMerge('icon-placeholder-dot text-light-grey', className)}
        title={t(($) => $.accessibility.stops.transportMode.unknownModeTitle)}
        role="img"
        data-testid={testIds.unknownType}
      />
    );
  }

  return (
    <i
      className={twJoin(
        getTransportModeIcon(mode, active, trunkLine, speedTram),
        className,
      )}
      title={getTransportModeIconTitle(t, mode, active, trunkLine, speedTram)}
      role="img"
      data-testid={testIds.icon}
      data-transport-mode={mode}
      data-active={active}
      data-trunk-line={trunkLine && mode === StopRegistryTransportModeType.Bus}
      data-speed-tram={speedTram && mode === StopRegistryTransportModeType.Tram}
    />
  );
};
