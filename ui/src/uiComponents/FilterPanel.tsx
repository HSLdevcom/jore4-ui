import { useTranslation } from 'react-i18next';
import { i18n } from '../i18n';
import { Row } from '../layoutComponents';
import { Card } from './Card';
import { IconToggle } from './IconToggle';

interface Toggle {
  // eslint gives errors for "react/no-unused-prop-types" even though these are actually used (and these aren't `PropTypes` anyway, we are not using those with TypeScript!). Seems like this linter rule gets confused because these aren't inlined in props interface definition? (And we don't want to do that as these are used in more than one place.)
  active: boolean; // eslint-disable-line react/no-unused-prop-types
  onToggle: (active: boolean) => void; // eslint-disable-line react/no-unused-prop-types
  testId: string; // eslint-disable-line react/no-unused-prop-types
}

interface IconToggle extends Toggle {
  iconClassName: string; // eslint-disable-line react/no-unused-prop-types
  disabled?: boolean; // eslint-disable-line react/no-unused-prop-types
  tooltip: string; // eslint-disable-line react/no-unused-prop-types
}

interface ToggleRowProps {
  toggles: IconToggle[];
}

const ToggleRow = ({ toggles }: ToggleRowProps): JSX.Element => {
  return (
    <Row className="mt-2">
      {toggles.map(
        (
          {
            active,
            onToggle,
            iconClassName,
            disabled,
            testId,
            tooltip,
          }: IconToggle,
          index: number,
        ) => (
          <IconToggle
            // We don'thave proper id's to use as key here.
            // This shouldn't matter as this array isn't dynamic.
            key={index} // eslint-disable-line react/no-array-index-key
            iconClassName={iconClassName}
            className="mr-1.5"
            active={active}
            onToggle={onToggle}
            disabled={disabled}
            testId={testId}
            tooltip={tooltip}
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
    tooltip: i18n.t('vehicleModeEnum.tram'),
  },
  {
    iconClassName: 'icon-train',
    active: false,
    onToggle: noop,
    disabled: true,
    testId: 'placeholder',
    tooltip: i18n.t('vehicleModeEnum.train'),
  },
  {
    iconClassName: 'icon-ferry',
    active: false,
    onToggle: noop,
    disabled: true,
    testId: 'placeholder',
    tooltip: i18n.t('vehicleModeEnum.ferry'),
  },
  {
    iconClassName: 'icon-metro',
    active: false,
    onToggle: noop,
    disabled: true,
    testId: 'placeholder',
    tooltip: i18n.t('vehicleModeEnum.metro'),
  },
];

interface Props {
  routes: IconToggle[];
  stops: IconToggle[];
  infraLinks: Toggle;
  className?: string;
}

export const FilterPanel = ({
  routes,
  stops,
  infraLinks,
  className = '',
}: Props): JSX.Element => {
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
      <Card className="flex-col rounded-t-none !py-2.5 !px-5">
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
