import { DateTime } from 'luxon';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteStopFieldsFragment } from '../../../../../generated/graphql';
import { Path, routeDetails } from '../../../../../router/routeDetails';
import { SimpleDropdownMenuItem } from '../../../../common/Dropdowns';

const testIds = {
  showDetailsLink: 'RouteStopsOverlayRow::menu::ShowDetails',
};

type ShowDetailsPageProps = {
  readonly isReadOnly?: boolean;
  readonly stop: RouteStopFieldsFragment;
  readonly observationDate: DateTime;
};

export const ShowDetailsPage: FC<ShowDetailsPageProps> = ({
  isReadOnly,
  stop,
  observationDate,
}) => {
  const { t } = useTranslation();

  const link = routeDetails[Path.stopDetails].getLink(stop.label, {
    observationDate,
  });

  return (
    <SimpleDropdownMenuItem
      testId={testIds.showDetailsLink}
      to={link}
      onClick={(e) => {
        if (!isReadOnly) {
          e.preventDefault();
          window.open(link, '_blank')?.focus();
        }
      }}
    >
      {t(($) => $.stopRegistrySearch.stopRowActions.openDetails)}
    </SimpleDropdownMenuItem>
  );
};
