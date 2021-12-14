import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import {
  ReusableComponentsVehicleModeEnum,
  useInsertLineOneMutation,
} from '../generated/graphql';
import { Container, Row } from '../layoutComponents';
import { Priority } from '../types/Priority';
import { SimpleButton } from '../uiComponents';
import { mapToObject, mapToVariables, submitFormByRef } from '../utils';
import { FormState, LinePropertiesForm } from './forms/LinePropertiesForm';

export const CreateNewLinePage = (): JSX.Element => {
  const [mutateFunction] = useInsertLineOneMutation();
  const history = useHistory();
  const formRef = useRef<ExplicitAny>(null);

  const onSave = () => {
    submitFormByRef(formRef);
  };

  const onCancel = () => {
    history.goBack();
  };

  const onSubmit = async (state: FormState) => {
    const variables = mapToObject({
      label: state.label,
      name_i18n: state.finnishName,
      primary_vehicle_mode: state.primaryVehicleMode,
      priority: Priority.Standard, // TODO: Let user chose priority (e.g. in "save" modal, which is to be added later)
    });

    try {
      await mutateFunction(mapToVariables(variables));
      // eslint-disable-next-line no-console
      console.log('Line created succesfully. TODO: inform user about it');

      history.goBack();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(`Err, ${err}, TODO: show error message}`);
    }
  };

  const { t } = useTranslation();
  return (
    <Container>
      <Row>
        <i className="icon-bus-alt text-tweaked-brand text-5xl" />
        <h1 className="text-5xl font-bold">{t('lines.createNew')}</h1>
      </Row>
      <Row className="mt-10">
        <div
          className="w-full"
          style={{
            // TODO: Decide whether this style definition should be made available to other components, e.g. through a common CSS definition
            background: '#F2F5F7',
            border: '1px solid #CCCCCC',
            boxSizing: 'border-box',
            borderRadius: 5,
          }}
        >
          <LinePropertiesForm
            ref={formRef}
            className="mb-2 ml-2 p-6"
            defaultValues={{
              primaryVehicleMode: ReusableComponentsVehicleModeEnum.Bus,
            }}
            onSubmit={onSubmit}
          />
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
  );
};
