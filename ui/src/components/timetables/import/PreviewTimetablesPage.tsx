import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  useAppSelector,
  useConfirmTimetablesImportUIAction,
  useTimetablesImport,
  useToggle,
} from '../../../hooks';
import {
  useGetStagingVehicleScheduleFrameIds,
  useReplaceDeviations,
  useToReplaceVehicleScheduleFrames,
  useVehicleScheduleFrameWithRouteLabelAndLineId,
} from '../../../hooks/timetables-import/deviations';
import { Container, Row, Visible } from '../../../layoutComponents';
import { selectIsImportOperationLoading } from '../../../redux';
import { Path, routeDetails } from '../../../router/routeDetails';
import {
  AccordionButton,
  LoadingOverlay,
  SimpleButton,
} from '../../../uiComponents';
import { submitFormByRef } from '../../../utils';
import { ConfirmPreviewedTimetablesImportForm } from './ConfirmPreviewedTimetablesImportForm';
import { ImportContentsView } from './ImportContentsView';
import { SpecialDayMixedPrioritiesWarning } from './SpecialDayMixedPrioritiesWarning';
import { SummarySection } from './SummarySection';
import { FormState, getDefaultValues } from './TimetablesImportFormSchema';

const testIds = {
  toggleShowStagingTimetables:
    'PreviewTimetablesPage::toggleShowStagingTimetables',
  saveButton: 'PreviewTimetablesPage::saveButton',
  closePreviewButton: 'PreviewTimetablesPage::closePreviewButton',
  loading: 'PrieviewTimetablesPage::LoadingOverlay',
};

export const PreviewTimetablesPage = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    vehicleJourneys,
    vehicleScheduleFrames,
    importingSomeSpecialDays,
    inconsistentSpecialDayPrioritiesStaged,
  } = useTimetablesImport();
  const [showStagingTimetables, toggleShowStagingTimetables] = useToggle(true);
  const { onConfirmTimetablesImport } = useConfirmTimetablesImportUIAction();
  const { fetchToReplaceFrames } = useToReplaceVehicleScheduleFrames();
  const { fetchVehicleFrames } =
    useVehicleScheduleFrameWithRouteLabelAndLineId();
  const { fetchStagingVehicleFrameIds } =
    useGetStagingVehicleScheduleFrameIds();
  const { clearRouteDeviations, deviations, fetchRouteDeviations } =
    useReplaceDeviations(
      fetchToReplaceFrames,
      fetchVehicleFrames,
      fetchStagingVehicleFrameIds,
    );

  const isLoading = useAppSelector(selectIsImportOperationLoading);
  const vehicleJourneyCount = vehicleJourneys?.length || 0;
  const importedTimetablesExist = vehicleJourneyCount > 0;
  // Default might be set incorrectly if data has not been fetched for the form.
  const formReadyForRender = !!vehicleScheduleFrames?.length;

  const formRef = useRef<ExplicitAny>(null);

  const onSave = () => {
    submitFormByRef(formRef);
  };

  const onSubmit = async (state: FormState) => {
    await onConfirmTimetablesImport(
      vehicleScheduleFrames.map((vsf) => vsf.vehicle_schedule_frame_id),
      state.priority,
      state.timetableImportStrategy,
    );

    navigate({
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
        <div className="py-9 px-16">
          <Row className="items-center space-x-14">
            <h3>{t('timetablesPreview.contentUsage')}</h3>
            <Visible visible={formReadyForRender}>
              <ConfirmPreviewedTimetablesImportForm
                ref={formRef}
                fetchRouteDeviations={fetchRouteDeviations}
                clearRouteDeviations={clearRouteDeviations}
                onSubmit={onSubmit}
                defaultValues={getDefaultValues({ importingSomeSpecialDays })}
              />
            </Visible>
          </Row>
          <Visible visible={inconsistentSpecialDayPrioritiesStaged}>
            <SpecialDayMixedPrioritiesWarning />
          </Visible>
        </div>
        <Visible visible={showStagingTimetables}>
          <div className="items-center space-x-14 rounded-b-sm bg-hsl-neutral-blue py-9 px-16">
            <ImportContentsView vehicleScheduleFrames={vehicleScheduleFrames} />
          </div>
        </Visible>
      </div>
      <SummarySection className="mt-10" deviations={deviations} />
      <div className="pt-10">
        <Row className="justify-end space-x-4">
          <SimpleButton
            inverted
            testId={testIds.closePreviewButton}
            disabled={isLoading}
            href={Path.timetablesImport}
          >
            {t('timetablesPreview.closePreview')}
          </SimpleButton>
          <SimpleButton
            testId={testIds.saveButton}
            onClick={onSave}
            disabled={!importedTimetablesExist || isLoading}
          >
            {t('timetablesPreview.save')}
          </SimpleButton>
        </Row>
      </div>
      <LoadingOverlay testId={testIds.loading} visible={isLoading} />
    </Container>
  );
};
