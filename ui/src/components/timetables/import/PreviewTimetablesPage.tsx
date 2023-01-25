import { zodResolver } from '@hookform/resolvers/zod';
import { useReducer, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useLoader } from '../../../hooks';
import { useConfirmTimetablesImport } from '../../../hooks/timetables-import/useConfirmTimetablesImport';
import { Container, Row, Visible } from '../../../layoutComponents';
import { Operation } from '../../../redux';
import { Path, routeDetails } from '../../../router/routeDetails';
import { TimetablePriority } from '../../../types/Priority';
import { AccordionButton, SimpleButton } from '../../../uiComponents';
import { showSuccessToast, submitFormByRef } from '../../../utils';
import {
  PriorityForm,
  PriorityFormState,
  priorityFormSchema,
} from '../../forms/common';
import { ImportContentsView } from './ImportContentsView';

const schema = priorityFormSchema;

export type FormState = PriorityFormState;

const testIds = {
  toggleShowStagingTimetables:
    'PreviewTimetablesPage::toggleShowStagingTimetables',
  saveButton: 'PreviewTimetablesPage::saveButton',
  cancelButton: 'PreviewTimetablesPage::cancelButton',
};

export const PreviewTimetablesPage = (): JSX.Element => {
  const { t } = useTranslation();
  const history = useHistory();

  const { confirmTimetablesImport, vehicleJourneys, vehicleScheduleFrames } =
    useConfirmTimetablesImport();
  const [showStagingTimetables, toggleShowStagingTimetables] = useReducer(
    (value) => !value,
    false,
  );
  const { setIsLoading } = useLoader(Operation.ConfirmTimetablesImport);

  const vehicleJourneyCount = vehicleJourneys?.length || 0;
  const importedTimetablesExist = vehicleJourneyCount > 0;

  const formRef = useRef<ExplicitAny>(null);

  const methods = useForm<FormState>({
    defaultValues: undefined,
    resolver: zodResolver(schema),
  });

  const { handleSubmit } = methods;

  const onSave = () => {
    submitFormByRef(formRef);
  };

  const onSubmit = async (state: FormState) => {
    setIsLoading(true);

    try {
      await confirmTimetablesImport(
        state.priority as unknown as TimetablePriority,
      );
      showSuccessToast(t('timetables.importSuccess'));

      history.push({
        pathname: routeDetails[Path.timetablesImport].getLink(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <h1>{t('timetablesPreview.preview')}</h1>
      <div className="overflow-none mt-9 rounded border border-grey">
        <Row className="justify-between rounded-t-sm border-brand bg-brand pl-16 pr-8 text-white">
          <div className="py-2">
            <h2>
              {t('timetablesPreview.departures')} {vehicleJourneyCount}
            </h2>
          </div>
          <div className="flex items-center">
            <button
              onClick={toggleShowStagingTimetables}
              type="button"
              className="font-bold"
            >
              {showStagingTimetables
                ? t('timetablesPreview.closeContent')
                : t('timetablesPreview.showContent')}
            </button>
            <AccordionButton
              testId={testIds.toggleShowStagingTimetables}
              isOpen={showStagingTimetables}
              onToggle={toggleShowStagingTimetables}
              iconClassName="text-white text-[50px]"
            />
          </div>
        </Row>
        <Row className="items-center space-x-14 py-9 px-16">
          <h3>{t('timetablesPreview.contentUsage')}</h3>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <FormProvider {...methods}>
            <form
              id="save-timetables-form"
              onSubmit={handleSubmit(onSubmit)}
              ref={formRef}
            >
              <PriorityForm showLabel={false} />
            </form>
          </FormProvider>
        </Row>
        <Visible visible={showStagingTimetables}>
          <div className="items-center space-x-14 rounded-b-sm bg-hsl-neutral-blue py-9 px-16">
            <ImportContentsView vehicleScheduleFrames={vehicleScheduleFrames} />
          </div>
        </Visible>
      </div>
      <div className="pt-10">
        <Row className="justify-end space-x-4">
          <SimpleButton
            inverted
            testId={testIds.cancelButton}
            href={Path.timetablesImport}
          >
            {t('cancel')}
          </SimpleButton>
          <SimpleButton
            testId={testIds.saveButton}
            onClick={onSave}
            disabled={!importedTimetablesExist}
          >
            {t('timetablesPreview.save')}
          </SimpleButton>
        </Row>
      </div>
    </Container>
  );
};
