import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import {
  useConfirmTimetablesImportUIAction,
  useTimetablesImport,
  useToggle,
} from '../../../hooks';
import { Container, Row, Visible } from '../../../layoutComponents';
import { Path, routeDetails } from '../../../router/routeDetails';
import { AccordionButton, SimpleButton } from '../../../uiComponents';
import { submitFormByRef } from '../../../utils';
import {
  ConfirmPreviewedTimetablesImportForm,
  FormState,
} from './ConfirmPreviewedTimetablesImportForm';
import { ImportContentsView } from './ImportContentsView';

const testIds = {
  toggleShowStagingTimetables:
    'PreviewTimetablesPage::toggleShowStagingTimetables',
  saveButton: 'PreviewTimetablesPage::saveButton',
  cancelButton: 'PreviewTimetablesPage::cancelButton',
};

const defaultValues: Partial<FormState> = {
  // No default for priority, this is on purpose: design decision.
  timetableImportStrategy: 'replace',
};

export const PreviewTimetablesPage = (): JSX.Element => {
  const { t } = useTranslation();
  const history = useHistory();

  const { vehicleJourneys, vehicleScheduleFrames } = useTimetablesImport();
  const [showStagingTimetables, toggleShowStagingTimetables] = useToggle(true);
  const { onConfirmTimetablesImport } = useConfirmTimetablesImportUIAction();

  const vehicleJourneyCount = vehicleJourneys?.length || 0;
  const importedTimetablesExist = vehicleJourneyCount > 0;

  const formRef = useRef<ExplicitAny>(null);

  const onSave = () => {
    submitFormByRef(formRef);
  };

  const onSubmit = async (state: FormState) => {
    await onConfirmTimetablesImport(
      state.priority,
      state.timetableImportStrategy,
    );

    history.push({
      pathname: routeDetails[Path.timetablesImport].getLink(),
    });
  };

  return (
    <Container>
      <h1>{t('timetablesPreview.preview')}</h1>
      <div className="overflow-none mt-9 rounded border border-grey">
        <Row className="justify-between rounded-t-sm border-brand bg-brand pl-16 pr-8 text-white">
          <div className="py-2">
            <h2>
              {t('timetablesPreview.departures', {
                count: vehicleJourneyCount,
              })}
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
          <ConfirmPreviewedTimetablesImportForm
            ref={formRef}
            onSubmit={onSubmit}
            defaultValues={defaultValues}
          />
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
