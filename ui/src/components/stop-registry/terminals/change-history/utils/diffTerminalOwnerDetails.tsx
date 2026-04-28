import { TFunction } from 'i18next';
import compact from 'lodash/compact';
import {
  HistoricalTerminalDetailsFragment,
  StopRegistryStopPlaceOrganisationRelationshipType,
} from '../../../../../generated/graphql';
import { KnownValueKey, findKeyValue } from '../../../../../utils';
import {
  ChangedValue,
  diffKeyedValues,
} from '../../../../common/ChangeHistory';

function findOwnerOrganisation(terminal: HistoricalTerminalDetailsFragment) {
  return terminal.organisations?.find(
    (org) =>
      org?.relationshipType ===
      StopRegistryStopPlaceOrganisationRelationshipType.Owner,
  );
}

export function diffTerminalOwnerDetails(
  t: TFunction,
  previous: HistoricalTerminalDetailsFragment,
  current: HistoricalTerminalDetailsFragment,
): Array<ChangedValue> {
  const previousOwner = findOwnerOrganisation(previous);
  const currentOwner = findOwnerOrganisation(current);

  const changes = [
    diffKeyedValues({
      key: 'OwnerName',
      field: t(($) => $.terminalDetails.owner.owner),
      oldValue: previousOwner?.organisation?.name ?? null,
      newValue: currentOwner?.organisation?.name ?? null,
    }),
    diffKeyedValues({
      key: 'OwnerContractId',
      field: t(($) => $.terminalDetails.owner.contractId),
      oldValue: findKeyValue(previous, KnownValueKey.OwnerContractId),
      newValue: findKeyValue(current, KnownValueKey.OwnerContractId),
    }),
    diffKeyedValues({
      key: 'OwnerNote',
      field: t(($) => $.terminalDetails.owner.note),
      oldValue: findKeyValue(previous, KnownValueKey.OwnerNote),
      newValue: findKeyValue(current, KnownValueKey.OwnerNote),
    }),
  ];

  return compact(changes);
}
