import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  StopPlaceOrganisationFieldsFragment,
  StopRegistryStopPlaceOrganisationRelationshipType,
} from '../../../../../generated/graphql';
import { Visible } from '../../../../../layoutComponents';
import { InputField } from '../../../../forms/common';
import { SlimSimpleButton } from '../layout';
import {
  CREATE_NEW_ORGANISATION_OPTION,
  ChooseOrganisationDropdown,
} from './ChooseOrganisationDropdown';
import { MaintenanceDetailsFormState } from './schema';

const testIds = {
  maintainerDropdown: 'MaintainerFormFields::maintainerDropdown',
  editOrganisationButton: 'MaintainerFormFields::editOrganisationButton',
  phone: 'MaintainerFormFields::phone',
  email: 'MaintainerFormFields::email',
};

interface Props {
  testId: string;
  maintainerType: StopRegistryStopPlaceOrganisationRelationshipType;
  organisations: ReadonlyArray<StopPlaceOrganisationFieldsFragment>;
  editOrganisation: (
    org: StopPlaceOrganisationFieldsFragment | undefined,
    relationshipType: StopRegistryStopPlaceOrganisationRelationshipType,
  ) => void;
}

export const MaintainerFormFields = ({
  testId,
  maintainerType,
  organisations,
  editOrganisation,
}: Props): React.ReactElement => {
  const { t } = useTranslation();
  const { setValue, resetField, watch } =
    useFormContext<MaintenanceDetailsFormState>();
  const selectedMaintainerId = watch(`maintainers.${maintainerType}`);
  const selectedMaintainer = organisations.find(
    (o) => o?.id === selectedMaintainerId,
  );
  const [previousValue, setPreviousValue] = useState<string | null>(
    selectedMaintainerId,
  );

  useEffect(() => {
    if (selectedMaintainerId === CREATE_NEW_ORGANISATION_OPTION) {
      editOrganisation(undefined, maintainerType);
      // "Reset" to previous value immediately,
      // to have a sensible value selected in case user cancels adding new organisation.
      setValue(`maintainers.${maintainerType}`, previousValue);
    } else if (previousValue !== selectedMaintainerId) {
      setPreviousValue(selectedMaintainerId);
    }
  }, [
    maintainerType,
    previousValue,
    selectedMaintainerId,
    editOrganisation,
    resetField,
    setValue,
  ]);

  const onEditOrganisation = () => {
    editOrganisation(selectedMaintainer, maintainerType);
  };

  return (
    <div data-testid={testId} className="grid space-y-4">
      <div className="lg:row-span-1 lg:row-start-1">
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
          <div data-testid={testIds.phone}>
            {selectedMaintainer?.privateContactDetails?.phone ?? ''}
          </div>
          <div data-testid={testIds.email}>
            {selectedMaintainer?.privateContactDetails?.email ?? ''}
          </div>
        </div>
      </div>
      <div className="self-end lg:row-span-1 lg:row-start-2">
        <Visible visible={!!selectedMaintainer}>
          <SlimSimpleButton
            className="px-8"
            inverted
            onClick={onEditOrganisation}
            testId={testIds.editOrganisationButton}
          >
            {t('edit')}
          </SlimSimpleButton>
        </Visible>
      </div>
    </div>
  );
};
