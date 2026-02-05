import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { TFunction } from 'i18next';
import compact from 'lodash/compact';
import noop from 'lodash/noop';
import { FC } from 'react';
import { StopPlaceOrganisationFieldsFragment } from '../../../../../../generated/graphql';
import { mapStopOwnerToUiName } from '../../../../../../i18n/uiNameMappings';
import { CloseIconButton } from '../../../../../../uiComponents';
import {
  ChangedValue,
  diffValues,
  mapNullable,
  optionalToDefault,
} from '../../../../../common/ChangeHistory';
import { getMaintainers } from '../../../utils';
import { HistoricalStopData } from '../../types';

const testIds = {
  closeButton: 'StopChangeHistory::OwnerDetails::closeButton',
};

function compareOwners(
  a: StopPlaceOrganisationFieldsFragment | null,
  b: StopPlaceOrganisationFieldsFragment | null,
) {
  // If ID has not changed, it is the same owner,
  // even if the owners contact info has been updated.
  if (a?.id === b?.id) {
    return true;
  }

  // ID has changed, but let's assume that Org names are unique,
  // and we can just compare the names.
  return optionalToDefault(a?.name, '') === optionalToDefault(b?.name, '');
}

type OwnerDetailsProps = {
  readonly owner: StopPlaceOrganisationFieldsFragment | null;
  readonly t: TFunction;
};

const OwnerDetails: FC<OwnerDetailsProps> = ({ owner, t }) => {
  if (!owner) {
    return '-';
  }

  return (
    <Popover className="ml-2 inline-block text-left">
      <PopoverButton title={t('stopChangeHistory.ownerDetails')}>
        <i className="icon-info text-sm text-tweaked-brand" />
      </PopoverButton>
      <PopoverPanel
        anchor="right"
        className="ml-2 inline-flex flex-row items-start rounded-lg border border-black bg-white p-3 drop-shadow-md"
      >
        <div className="mr-6">
          <ul>
            <li>{owner.name}</li>
            <li>{owner.privateContactDetails?.email}</li>
            <li>{owner.privateContactDetails?.phone}</li>
          </ul>
        </div>
        <PopoverButton>
          <CloseIconButton onClick={noop} testId={testIds.closeButton} />
        </PopoverButton>
      </PopoverPanel>
    </Popover>
  );
};

export function diffOwnerDetails(
  t: TFunction,
  previous: HistoricalStopData,
  current: HistoricalStopData,
): Array<ChangedValue> {
  const previousMaintainers = getMaintainers(previous.quay);
  const currentMaintainers = getMaintainers(current.quay);

  const mapOwner = (owner: StopPlaceOrganisationFieldsFragment | null) => (
    <>
      <span>{owner?.name}</span>
      <OwnerDetails owner={owner} t={t} />
    </>
  );

  const changes = [
    diffValues({
      field: t('stopDetails.maintenance.maintainers.stopOwner'),
      oldValue: previous.quay.stopOwner,
      newValue: current.quay.stopOwner,
      mapper: mapNullable((v) => mapStopOwnerToUiName(t, v)),
    }),
    diffValues({
      field: t('stopDetails.maintenance.maintainers.shelterMaintenance'),
      oldValue: previousMaintainers.shelterMaintenance,
      newValue: currentMaintainers.shelterMaintenance,
      compare: compareOwners,
      mapper: mapOwner,
    }),
    diffValues({
      field: t('stopDetails.maintenance.maintainers.maintenance'),
      oldValue: previousMaintainers.maintenance,
      newValue: currentMaintainers.maintenance,
      compare: compareOwners,
      mapper: mapOwner,
    }),
    diffValues({
      field: t('stopDetails.maintenance.maintainers.winterMaintenance'),
      oldValue: previousMaintainers.winterMaintenance,
      newValue: currentMaintainers.winterMaintenance,
      compare: compareOwners,
      mapper: mapOwner,
    }),
    diffValues({
      field: t('stopDetails.maintenance.maintainers.infoUpkeep'),
      oldValue: previousMaintainers.infoUpkeep,
      newValue: currentMaintainers.infoUpkeep,
      compare: compareOwners,
      mapper: mapOwner,
    }),
    diffValues({
      field: t('stopDetails.maintenance.maintainers.cleaning'),
      oldValue: previousMaintainers.cleaning,
      newValue: currentMaintainers.cleaning,
      compare: compareOwners,
      mapper: mapOwner,
    }),
  ];

  return compact(changes);
}
