import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  StopPlaceOrganisationFieldsFragment,
  StopRegistryStopPlaceOrganisationRelationshipType,
} from '../../../../../generated/graphql';
import { Visible } from '../../../../../layoutComponents';
import { InputField } from '../../../../forms/common';
import { SlimSimpleButton } from '../layout';
import { ChooseOrganisationDropdown } from './ChooseOrganisationDropdown';
import { MaintenanceDetailsFormState } from './schema';

const testIds = {
  maintainerDropdown: 'MaintainerFormFields::maintainerDropdown',
  editOrganisationButton: 'MaintainerFormFields::editOrganisationButton',
};

interface Props {
  maintainerType: StopRegistryStopPlaceOrganisationRelationshipType;
  organisations: Array<StopPlaceOrganisationFieldsFragment>;
  editOrganisation: (
    org: StopPlaceOrganisationFieldsFragment | undefined,
  ) => void;
}

export const MaintainerFormFields = ({
  maintainerType,
  organisations,
  editOrganisation,
}: Props): React.ReactElement => {
  const { t } = useTranslation();
  const { watch } = useFormContext<MaintenanceDetailsFormState>();
  const selectedMaintainerId = watch(`maintainers.${maintainerType}`);
  const selectedMaintainer = organisations.find(
    (o) => o?.id === selectedMaintainerId,
  );

  const onEditOrganisation = () => {
    editOrganisation(selectedMaintainer);
  };

  return (
    <div className="grid space-y-4">
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
          <div>{selectedMaintainer?.privateContactDetails?.phone ?? ''}</div>
          <div>{selectedMaintainer?.privateContactDetails?.email ?? ''}</div>
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
