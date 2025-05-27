import { Dialog } from '@headlessui/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { StopPlaceOrganisationFieldsFragment } from '../../../../../generated/graphql';
import { useUpsertOrganisation } from '../../../../../hooks/stop-registry/useUpsertOrganisation';
import { Row } from '../../../../../layoutComponents';
import { Modal, NewModalBody } from '../../../../../uiComponents';
import {
  OrganisationDetailsForm,
  OrganisationDetailsFormState,
} from './OrganisationDetailsForm';

const testIds = {
  modal: 'OrganisationDetailsModal',
  title: 'OrganisationDetailsModal::title',
};

type OrganisationDetailsModalProps = {
  readonly isOpen: boolean;
  readonly organisation?: StopPlaceOrganisationFieldsFragment;
  readonly onClose: () => void;
  readonly onSubmit: (
    org: Pick<StopPlaceOrganisationFieldsFragment, 'id'>,
  ) => void;
};

const mapOrganisationToFormState = (
  organisation: StopPlaceOrganisationFieldsFragment | undefined,
): Partial<OrganisationDetailsFormState> => {
  return {
    id: organisation?.id ?? undefined,
    name: organisation?.name ?? undefined,
    privateContactDetails: {
      email: organisation?.privateContactDetails?.email,
      phone: organisation?.privateContactDetails?.phone,
    },
  };
};

export const OrganisationDetailsModal: FC<OrganisationDetailsModalProps> = ({
  isOpen,
  organisation,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const { upsertOrganisation, defaultErrorHandler } = useUpsertOrganisation();

  const onConfirm = async (state: OrganisationDetailsFormState) => {
    try {
      const result = await upsertOrganisation(state);
      if (result?.id) {
        onSubmit(result);
      }
    } catch (err) {
      defaultErrorHandler(err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} testId={testIds.modal}>
      <Row className="flex justify-between px-5 py-4">
        <Dialog.Title as="h4" data-testid={testIds.title}>
          {organisation?.id
            ? t('stopDetails.maintenance.organisation.modalTitleEdit')
            : t('stopDetails.maintenance.organisation.modalTitleCreate')}
        </Dialog.Title>
      </Row>
      <NewModalBody>
        <OrganisationDetailsForm
          defaultValues={mapOrganisationToFormState(organisation)}
          onSubmit={onConfirm}
          onCancel={onClose}
        />
      </NewModalBody>
    </Modal>
  );
};
