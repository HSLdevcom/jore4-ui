import { TFunction } from 'i18next';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Row } from '../layoutComponents';
import { Card } from './Card';
import { IconToggle } from './IconToggle';

type Toggle = {
  readonly active: boolean;
  readonly onToggle: (active: boolean) => void;
  readonly testId: string;
};

type IconToggle = Toggle & {
  readonly iconClassName: string;
  readonly disabled?: boolean;
  readonly tooltip: (t: TFunction) => string;
};

type ToggleRowProps = {
  readonly toggles: ReadonlyArray<IconToggle>;
};

const ToggleRow: FC<ToggleRowProps> = ({ toggles }) => {
  const { t } = useTranslation();

  return (
    <Row className="mt-2">
      {toggles.map(
        (
          { active, onToggle, iconClassName, disabled, testId, tooltip },
          index: number,
        ) => (
          <IconToggle
            // We don't have proper ids to use as keys here.
            // This shouldn't matter as this array isn't dynamic.
            key={index} // eslint-disable-line react/no-array-index-key
            iconClassName={iconClassName}
            className="mr-1.5"
            active={active}
            onToggle={onToggle}
            disabled={disabled}
            testId={testId}
            tooltip={tooltip(t)}
          />
        ),
      )}
    </Row>
  );
};

const noop = () => null;
// placeholder toggles of unimplemented features that can be used
// for visual purposes.
export const placeholderToggles: IconToggle[] = [
  {
    iconClassName: 'icon-tram',
    active: false,
    onToggle: noop,
    disabled: true,
    testId: 'placeholder',
    tooltip: (t) => t('vehicleModeEnum.tram'),
  },
  {
    iconClassName: 'icon-train',
    active: false,
    onToggle: noop,
    disabled: true,
    testId: 'placeholder',
    tooltip: (t) => t('vehicleModeEnum.train'),
  },
  {
    iconClassName: 'icon-ferry',
    active: false,
    onToggle: noop,
    disabled: true,
    testId: 'placeholder',
    tooltip: (t) => t('vehicleModeEnum.ferry'),
  },
  {
    iconClassName: 'icon-metro',
    active: false,
    onToggle: noop,
    disabled: true,
    testId: 'placeholder',
    tooltip: (t) => t('vehicleModeEnum.metro'),
  },
];

type FilterPanelProps = {
  readonly routes: ReadonlyArray<IconToggle>;
  readonly stops: ReadonlyArray<IconToggle>;
  readonly infraLinks: Toggle;
  readonly className?: string;
};

export const FilterPanel: FC<FilterPanelProps> = ({
  routes,
  stops,
  infraLinks,
  className = '',
}) => {
  const { t } = useTranslation();
  const headingClassName = 'text-sm font-bold';
  return (
    <div className={`inline-block ${className}`}>
      <Card className="flex-col rounded-b-none">
        <h6 className={headingClassName}>{t('map.showRoutes')}</h6>
        <ToggleRow toggles={routes} />
      </Card>

      <Card className="flex-col rounded-none !border-t-0">
        <h6 className={headingClassName}>{t('map.showStops')}</h6>
        <ToggleRow toggles={stops} />
      </Card>

      <Card className="flex-col rounded-t-none !px-5 !py-2.5">
        <label htmlFor="show-network" className="inline-flex font-normal">
          <input
            type="checkbox"
            id="show-network"
            checked={infraLinks.active}
            onChange={(e) => infraLinks.onToggle(e.target.checked)}
            className="mr-2.5 h-6 w-6"
          />
          {t('map.showNetwork')}
        </label>
      </Card>
    </div>
  );
};
