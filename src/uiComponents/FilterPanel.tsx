import React from 'react';
import { useTranslation } from 'react-i18next';
import { Row } from '../layoutComponents';
import { Card } from './Card';
import { IconToggle } from './IconToggle';

interface Toggle {
  // eslint gives errors for "react/no-unused-prop-types" even though these are actually used (and these aren't `PropTypes` anyway, we are not using those with TypeScript!). Seems like this linter rule gets confused because these aren't inlined in props interface definition? (And we don't want to do that as these are used in more than one place.)
  enabled: boolean; // eslint-disable-line react/no-unused-prop-types
  onToggle: (enabled: boolean) => void; // eslint-disable-line react/no-unused-prop-types
  iconClassName: string; // eslint-disable-line react/no-unused-prop-types
}

interface ToggleRowProps {
  toggles: Toggle[];
}

const ToggleRow = ({ toggles }: ToggleRowProps): JSX.Element => {
  return (
    <Row>
      {toggles.map(
        ({ enabled, onToggle, iconClassName }: Toggle, index: number) => (
          <IconToggle
            // We don'thave proper id's to use as key here.
            // This shouldn't matter as this array isn't dynamic.
            key={index} // eslint-disable-line react/no-array-index-key
            iconClassName={iconClassName}
            className="mr-2"
            enabled={enabled}
            onToggle={onToggle}
          />
        ),
      )}
    </Row>
  );
};

interface Props {
  routes: Toggle[];
  stops: Toggle[];
  className?: string;
}

export const FilterPanel = ({
  routes,
  stops,
  className,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const headingClassName = 'text-base font-bold';
  return (
    <div className={className}>
      <Card className="flex-col rounded-b-none">
        <h3 className={headingClassName}>{t('map.showRoutes')}</h3>
        <ToggleRow toggles={routes} />
      </Card>
      <Card className="!border-t-0 flex-col rounded-t-none">
        <h3 className={headingClassName}>{t('map.showStops')}</h3>
        <ToggleRow toggles={stops} />
      </Card>
    </div>
  );
};
