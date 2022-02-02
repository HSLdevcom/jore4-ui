import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { Redirect, useParams } from 'react-router-dom';
import {
  useGetLineDetailsByIdQuery,
  usePatchLineMutation,
} from '../../generated/graphql';
import { mapLineDetailsResult } from '../../graphql/route';
import { Container, Row } from '../../layoutComponents';
import { Path, routes } from '../../routes'; // eslint-disable-line import/no-cycle
import { Priority } from '../../types/Priority';
import { SimpleButton } from '../../uiComponents';
import {
  mapToObject,
  mapToVariables,
  showToast,
  submitFormByRef,
} from '../../utils';
import { FormState, LinePropertiesForm } from '../forms/LinePropertiesForm';
import { PageHeader } from './PageHeader';

export const EditLinePage = (): JSX.Element => {
  const [hasFinishedEditing, setHasFinishedEditing] = useState(false);
  const [patchLine] = usePatchLineMutation();
  const history = useHistory();
  const formRef = useRef<ExplicitAny>(null);
  const { id } = useParams<{ id: string }>();
  const lineDetailsResult = useGetLineDetailsByIdQuery(
    mapToVariables({ line_id: id }),
  );
  const line = mapLineDetailsResult(lineDetailsResult);
  const { t } = useTranslation();

  const onSave = () => {
    submitFormByRef(formRef);
  };

  const onCancel = () => {
    history.goBack();
  };

  const onSubmit = async (state: FormState) => {
    const variables = {
      line_id: id,
      ...mapToObject({
        label: state.label,
        name_i18n: state.finnishName,
        primary_vehicle_mode: state.primaryVehicleMode,
        priority: Priority.Standard, // TODO: Let user chose priority (e.g. in "save" modal, which is to be added later)
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
        <Row className="mt-10">
          <div className="w-full rounded-md border border-light-grey bg-background">
            {line && (
              <LinePropertiesForm
                ref={formRef}
                className="mb-2 ml-2 p-6"
                defaultValues={{
                  label: line.label,
                  finnishName: line.name_i18n,
                  primaryVehicleMode: line.primary_vehicle_mode,
                }}
                onSubmit={onSubmit}
              />
            )}
          </div>
        </Row>
        <Row className="mt-8">
          <SimpleButton
            id="cancel-button"
            className="ml-auto"
            onClick={onCancel}
            inverted
          >
            {t('cancel')}
          </SimpleButton>
          <SimpleButton id="save-button" className="ml-5" onClick={onSave}>
            {t('save')}
          </SimpleButton>
        </Row>
      </Container>
    </div>
  );
};
