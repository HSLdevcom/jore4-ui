import compact from 'lodash/compact';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  StopPlaceOrganisationFieldsFragment,
  useGetOrganisationsQuery,
} from '../../../../../generated/graphql';
import { Column, Visible } from '../../../../../layoutComponents';
import { InputField } from '../../../../forms/common';
import { SlimSimpleButton } from '../../../stops/stop-details/layout';
import {
  CREATE_NEW_ORGANISATION_OPTION,
  ChooseOrganisationDropdown,
} from '../../../stops/stop-details/maintenance/organisation-dropdown';
import { OrganisationDetailsModal } from '../../../stops/stop-details/maintenance/OrganisationDetailsModal';
import { TerminalOwnerFormState } from './terminalOwnerSchema';

const testIds = {
  ownerDropdown: 'OwnerOrganizationFields::ownerDropdown',
  editOrganisationButton: 'OwnerOrganizationFields::editOrganisationButton',
  phone: 'OwnerOrganizationFields::phone',
  email: 'OwnerOrganizationFields::email',
};

type MaintainerFormFieldsProps = {
  readonly testId: string;
};

export const OwnerOrganizationFields: FC<MaintainerFormFieldsProps> = ({
  testId,
}) => {
  const { t } = useTranslation();

  const { data, refetch } = useGetOrganisationsQuery();
  const organisations = useMemo(
    () => compact(data?.stop_registry?.organisation),
    [data],
  );

  const { setValue, resetField, watch } =
    useFormContext<TerminalOwnerFormState>();

  const selectedOwnerRef = watch('ownerRef') ?? String(null);
  const selectedOwner =
    organisations.find((o) => o?.id === selectedOwnerRef) ?? null;
  const [previousValue, setPreviousValue] = useState<string>(selectedOwnerRef);

  const [isEditingOrganisation, setIsEditingOrganisation] = useState(false);
  const [editedOrganisation, setEditedOrganisation] =
    useState<StopPlaceOrganisationFieldsFragment | null>(null);

  const onEditOrganisation = useCallback(
    (org: StopPlaceOrganisationFieldsFragment | null) => {
      setIsEditingOrganisation(true);
      setEditedOrganisation(org);
    },
    [],
  );

  const onStopEditingOrganisation = useCallback(() => {
    setIsEditingOrganisation(false);
    setEditedOrganisation(null);
  }, []);

  const onOrganisationUpdated = useCallback(
    (org: StopPlaceOrganisationFieldsFragment) => {
      const organisationId = org.id;
      onStopEditingOrganisation();
      // Select the newly created organisation as owner (already selected if editing).
      if (organisationId) {
        setValue('ownerRef', organisationId);
      }
      refetch();
    },
    [onStopEditingOrganisation, setValue, refetch],
  );

  useEffect(() => {
    if (selectedOwnerRef === CREATE_NEW_ORGANISATION_OPTION) {
      onEditOrganisation(null);
      // "Reset" to previous value immediately,
      // to have a sensible value selected in case user cancels adding new organisation.
      setValue('ownerRef', previousValue);
    } else if (previousValue !== selectedOwnerRef) {
      setPreviousValue(selectedOwnerRef);
    }
  }, [
    previousValue,
    selectedOwnerRef,
    onEditOrganisation,
    resetField,
    setValue,
  ]);

  return (
    <>
      <Column data-testid={testId}>
        <InputField<TerminalOwnerFormState>
          translationPrefix="terminalDetails.owner"
          customTitlePath="terminalDetails.owner.owner"
          fieldPath="ownerRef"
          testId={testIds.ownerDropdown}
          // eslint-disable-next-line react/no-unstable-nested-components
          inputElementRenderer={(props) => (
            <ChooseOrganisationDropdown
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...props}
            />
          )}
        />

        <div className="my-2 text-sm">
          <div data-testid={testIds.phone}>
            {selectedOwner?.privateContactDetails?.phone ?? ''}
          </div>
          <div data-testid={testIds.email}>
            {selectedOwner?.privateContactDetails?.email ?? ''}
          </div>
        </div>

        <div>
          <Visible visible={!!selectedOwner}>
            <SlimSimpleButton
              className="px-8"
              inverted
              onClick={() => onEditOrganisation(selectedOwner)}
              testId={testIds.editOrganisationButton}
            >
              {t('edit')}
            </SlimSimpleButton>
          </Visible>
        </div>
      </Column>

      <OrganisationDetailsModal
        isOpen={isEditingOrganisation}
        organisation={editedOrganisation}
        onClose={onStopEditingOrganisation}
        onSubmit={onOrganisationUpdated}
      />
    </>
  );
};
