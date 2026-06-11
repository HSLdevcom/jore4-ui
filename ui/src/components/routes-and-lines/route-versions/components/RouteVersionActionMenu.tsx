import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { SimpleDropdownMenu } from '../../../../uiComponents';
import { RouteVersion } from '../types';
import { ShowRouteOnMap } from './ShowRouteOnMap';

const testIds = {
  actionMenu: 'RouteVersionRow::actionMenu',
};

type RouteVersionActionMenuProps = {
  readonly className?: string;
  readonly routeVersion: RouteVersion;
};

export const RouteVersionActionMenu: FC<RouteVersionActionMenuProps> = ({
  className,
  routeVersion,
}) => {
  const { t } = useTranslation();

  return (
    <SimpleDropdownMenu
      className={className}
      buttonClassName="h-10 w-10"
      tooltip={t(($) => $.accessibility.common.actionMenu)}
      testId={testIds.actionMenu}
    >
      <ShowRouteOnMap routeVersion={routeVersion} />
    </SimpleDropdownMenu>
  );
};
