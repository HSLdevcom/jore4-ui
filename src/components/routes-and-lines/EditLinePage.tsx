import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useParams } from 'react-router-dom';
import {
  useGetLineDetailsByIdQuery,
  usePatchLineMutation,
} from '../../generated/graphql';
import { mapLineDetailsResult } from '../../graphql/route';
import { Container } from '../../layoutComponents';
import { Path, routes } from '../../routes'; // eslint-disable-line import/no-cycle
import { mapToISODate } from '../../time';
import {
  mapDateInputToValidityEnd,
  mapDateInputToValidityStart,
  mapToObject,
  mapToVariables,
  showToast,
} from '../../utils';
import { EditLineForm, FormState } from './EditLineForm';
import { PageHeader } from './PageHeader';

export const EditLinePage = (): JSX.Element => {
  const [hasFinishedEditing, setHasFinishedEditing] = useState(false);
  const [patchLine] = usePatchLineMutation();

  const { id } = useParams<{ id: string }>();
  const lineDetailsResult = useGetLineDetailsByIdQuery(
    mapToVariables({ line_id: id }),
  );
  const line = mapLineDetailsResult(lineDetailsResult);
  const { t } = useTranslation();

  const defaultValues = {
    label: line?.label,
    finnishName: line?.name_i18n,
    primaryVehicleMode: line?.primary_vehicle_mode,
    priority: line?.priority,
    validityStart: mapToISODate(line?.validity_start),
    validityEnd: mapToISODate(line?.validity_end),
    indefinite: !line?.validity_end,
  };

  const onSubmit = async (state: FormState) => {
    const variables = {
      line_id: id,
      ...mapToObject({
        label: state.label,
        name_i18n: state.finnishName,
        primary_vehicle_mode: state.primaryVehicleMode,
        priority: state.priority,
        validity_start: mapDateInputToValidityStart(state.validityStart),
        validity_end: mapDateInputToValidityEnd(
          state.validityEnd,
          state.indefinite,
        ),
      }),
    };

    try {
      // patch the line in the backend
      await patchLine(mapToVariables(variables));

      showToast({ type: 'success', message: t('lines.saveSuccess') });

      setHasFinishedEditing(true);
    } catch (err) {
      showToast({
        type: 'danger',
        message: `${t('errors.saveFailed')}, '${err}'`,
      });
    }
  };

  if (hasFinishedEditing) {
    // if line was successfully edited, redirect to its page
    return <Redirect to={{ pathname: routes[Path.lineDetails].getLink(id) }} />;
  }

  return (
    <div>
      <PageHeader>
        <i className="icon-bus-alt text-5xl text-tweaked-brand" />
        <h1 className="text-5xl font-bold">
          {`${t('lines.line')} ${line?.label}`}
        </h1>
      </PageHeader>
      <Container>
        <EditLineForm onSubmit={onSubmit} defaultValues={defaultValues} />
      </Container>
    </div>
  );
};
