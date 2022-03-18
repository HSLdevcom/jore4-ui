import { Switch } from '@headlessui/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteRoute } from '../../generated/graphql';
import { Toggle } from '../../uiComponents';
import { RouteStopsSection } from './RouteStopsSection'; // eslint-disable-line import/no-cycle

interface Props {
  className?: string;
  routes: RouteRoute[];
  testId?: string;
}

export const RouteStopsTable = ({ className, routes, testId }: Props) => {
  const { t } = useTranslation();
  const [showUnusedStops, setShowUnusedStops] = useState(true);

  return (
    <>
      <div className="flex items-center">
        <Switch.Group>
          <Switch.Label className="my-8 mr-8 font-normal">
            {t('routes.showUnusedStops')}
          </Switch.Label>
          <Toggle checked={showUnusedStops} onChange={setShowUnusedStops} />
        </Switch.Group>
      </div>
      {/* setting a fake "height: 1px" so that "height: 100%" would work for the table cells */}
      <table className={`h-1 w-full ${className}`} data-testid={testId}>
        {routes.map((item) => {
          return (
            <RouteStopsSection
              key={item.route_id}
              route={item}
              showUnusedStops={showUnusedStops}
            />
          );
        })}
      </table>
    </>
  );
};
