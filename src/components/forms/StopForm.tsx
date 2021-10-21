import { ErrorMessage, Field, Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { Column, Row } from '../../layoutComponents';

const FormSchema = yup.object().shape({
  finnishName: yup.string().required('Required'),
  lat: yup.number().min(-90).max(90).required(),
  lng: yup.number().min(-180).max(180).required(),
});

const initialValues = { finnishName: '', lat: '', lng: '' };

interface Props {
  className?: string;
  onChange: (values: typeof initialValues) => void;
}

export const StopForm = ({ className, onChange }: Props): JSX.Element => {
  const { t } = useTranslation();
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={FormSchema}
      onSubmit={() => undefined}
    >
      {({ values }) => {
        onChange(values);
        return (
          <Form className={className || ''}>
            <h2 className="pb-6 text-xl font-bold">{t('stops.stop')}</h2>
            <Row className="space-x-10">
              <Column className="space-y-2">
                <h3 className="text-lg font-bold">{t('stops.nameAddress')}</h3>
                <Column>
                  <label htmlFor="finnishName">{t('stops.finnishName')}</label>
                  <Field type="text" name="finnishName" />
                  <ErrorMessage name="finnishName" component="div" />
                </Column>
              </Column>
              <Column className="space-y-2">
                <h3 className="text-lg font-bold">{t('map.location')}</h3>
                <Row className="space-x-5">
                  <Column>
                    <label htmlFor="lat">{t('map.latitude')}</label>
                    <Field type="number" name="lat" />
                    <ErrorMessage name="lat" component="div" />
                  </Column>
                  <Column>
                    <label htmlFor="lng">{t('map.longitude')}</label>
                    <Field type="number" name="lng" />
                    <ErrorMessage name="lng" component="div" />
                  </Column>
                </Row>
              </Column>
            </Row>
          </Form>
        );
      }}
    </Formik>
  );
};
