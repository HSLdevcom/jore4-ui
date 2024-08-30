import noop from 'lodash/noop';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { StopAreaDetailsFragment } from '../../../../../generated/graphql';
import { StopSearchRow } from '../../../../../hooks';
import { notNullish } from '../../../../../utils';
import { StopTableRow } from '../../../search';
import { OpenDetailsPage } from '../../../search/StopTableRow/MenuItems/OpenDetailsPage';
import { ShowOnMap } from '../../../search/StopTableRow/MenuItems/ShowOnMap';
import { SlimSimpleButton } from '../../../stops/stop-details/layout';
import { RemoveMemberStop } from './MemberStopMenuItems/RemoveMemberStop';
import { StopAreaComponentProps } from './StopAreaComponentProps';

const testIds = {
  addStopButton: 'StopAreaDetailsPage::MemberStops::addStopButton',
};

function mapMembersToStopSearchFormat(
  area: StopAreaDetailsFragment,
): Array<StopSearchRow> {
  return (
    area.members
      ?.map((member) => {
        if (
          // If null
          !member ||
          // If parent stop place
          // eslint-disable-next-line no-underscore-dangle
          member.__typename !== 'stop_registry_StopPlace' ||
          // If there is no scheduled stop point
          !member.scheduled_stop_point
        ) {
          return null;
        }

        const stopSearchRow: StopSearchRow = {
          ...member.scheduled_stop_point,
          stop_place: {
            nameFin: member.name?.value,
            nameSwe: null,
          },
        };

        return stopSearchRow;
      })
      .filter(notNullish) ?? []
  );
}

export const StopAreaMemberStops: FC<StopAreaComponentProps> = ({
  area,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <h2>{t('stopAreaDetails.memberStops.title')}</h2>
        <SlimSimpleButton
          disabled
          onClick={noop}
          testId={testIds.addStopButton}
        >
          {t('stopAreaDetails.memberStops.addStop')}
        </SlimSimpleButton>
      </div>

      <table className="mt-4 h-1 w-full border-x border-x-light-grey">
        <tbody>
          {mapMembersToStopSearchFormat(area).map((stop) => (
            <StopTableRow
              key={stop.scheduled_stop_point_id}
              stop={stop}
              menuItems={[
                <OpenDetailsPage key="OpenDetailsPage" stop={stop} />,
                <RemoveMemberStop key="RemoveMemberStop" stop={stop} />,
                <ShowOnMap key="ShowOnMap" stop={stop} />,
              ]}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
