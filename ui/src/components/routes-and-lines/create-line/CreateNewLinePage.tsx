import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router';
import {
  LineDefaultFieldsFragment,
  ReusableComponentsVehicleModeEnum,
} from '../../../generated/graphql';
import { mapInsertLineOneResult } from '../../../graphql';
import { useCreateLine } from '../../../hooks';
import { Container, Row } from '../../../layoutComponents';
import { Path, routeDetails } from '../../../router/routeDetails';
import { Priority } from '../../../types/enums';
import { showSuccessToast } from '../../../utils';
import { PageTitle } from '../../common';
import { FormState, LineForm } from '../../forms/line/LineForm';
import {
  ConflictResolverModal,
  mapLineToCommonConflictItem,
} from '../common/ConflictResolverModal';

export const CreateNewLinePage: FC = () => {
  const {
    prepareCreate,
    mapCreateChangesToVariables,
    insertLineMutation,
    defaultErrorHandler,
  } = useCreateLine();
  const [conflicts, setConflicts] = useState<
    ReadonlyArray<LineDefaultFieldsFragment>
  >([]);
  const [createdLineId, setCreatedLineId] = useState<UUID>();
  const { t } = useTranslation();

  const defaultValues = {
    primaryVehicleMode: ReusableComponentsVehicleModeEnum.Bus,
    priority: Priority.Draft,
  };

  const onSubmit = async (form: FormState) => {
    try {
      const changes = await prepareCreate({ form });
      if (changes.conflicts?.length) {
        setConflicts(changes.conflicts);
        return;
      }
      const variables = mapCreateChangesToVariables(changes);
      const result = await insertLineMutation({ variables });
      const createdLine = mapInsertLineOneResult(result);
      setCreatedLineId(createdLine?.line_id);
      showSuccessToast(t('lines.saveSuccess'));
    } catch (err) {
      defaultErrorHandler(err);
    }
  };

  if (createdLineId) {
    // if line was successfully created, redirect to its page
    return (
      <Navigate
        to={{ pathname: routeDetails[Path.lineDetails].getLink(createdLineId) }}
      />
    );
  }

  return (
    <Container>
      <ConflictResolverModal
        onClose={() => setConflicts([])}
        conflicts={conflicts.map(mapLineToCommonConflictItem)}
      />
      <Row>
        <i className="icon-bus-alt text-6xl text-tweaked-brand" />
        <PageTitle.H1>{t('lines.createNew')}</PageTitle.H1>
      </Row>
      <LineForm onSubmit={onSubmit} defaultValues={defaultValues} />
    </Container>
  );
};
