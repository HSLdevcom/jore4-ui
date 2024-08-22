import { useFormContext } from 'react-hook-form';
import {
  StopPlaceOrganisationFieldsFragment,
  StopRegistryStopPlaceOrganisationRelationshipType,
} from '../../../../../generated/graphql';
import { InputField } from '../../../../forms/common';
import { ChooseOrganisationDropdown } from './ChooseOrganisationDropdown';
import { MaintenanceDetailsFormState } from './schema';

const testIds = {
  maintainerDropdown: 'MaintainerFormFields::maintainerDropdown',
};

interface Props {
  maintainerType: StopRegistryStopPlaceOrganisationRelationshipType;
  organisations: Array<StopPlaceOrganisationFieldsFragment>;
}

export const MaintainerFormFields = ({
  maintainerType,
  organisations,
}: Props): React.ReactElement => {
  const { watch } = useFormContext<MaintenanceDetailsFormState>();
  const selectedMaintainerId = watch(`maintainers.${maintainerType}`);
  const selectedMaintainer = organisations.find(
    (o) => o?.id === selectedMaintainerId,
  );

  return (
    <div>
      <InputField<MaintenanceDetailsFormState>
        translationPrefix="stopDetails.maintenance"
        fieldPath={`maintainers.${maintainerType}`}
        testId={testIds.maintainerDropdown}
        className="[&>label]:leading-8"
        // eslint-disable-next-line react/no-unstable-nested-components
        inputElementRenderer={(props) => (
          <ChooseOrganisationDropdown
            organisations={organisations}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
          />
        )}
      />
      <div className="text-sm">
        <p>{selectedMaintainer?.privateContactDetails?.phone ?? ''}</p>
        <p>{selectedMaintainer?.privateContactDetails?.email ?? ''}</p>
      </div>
    </div>
  );
};
