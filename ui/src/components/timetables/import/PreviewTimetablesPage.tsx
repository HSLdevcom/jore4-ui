import { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useAppSelector } from '../../../hooks';
import { Container, Row, Visible } from '../../../layoutComponents';
import { selectIsJoreOperationLoading } from '../../../redux';
import { Path, routeDetails } from '../../../router/routeDetails';
import { AccordionButton, SimpleButton } from '../../../uiComponents';
import { submitFormByRef } from '../../../utils';
import { PageTitle } from '../../common';
import { useToggle } from '../../common/hooks';
import { CombineSameContractWarning } from './CombineSameContractWarning';
import { ConfirmPreviewedTimetablesImportForm } from './ConfirmPreviewedTimetablesImportForm';
import { ImportContentsView } from './contents-view';
import {
  useCombiningSameContractTimetables,
  useConfirmTimetablesImportUIAction,
  useDuplicateJourneyDeviations,
  useGetStagingVehicleScheduleFrameIds,
  useReplaceDeviations,
  useStagingAndTargetFramesForCombine,
  useTimetablesImport,
  useToCombineTargetVehicleScheduleFrameId,
  useToReplaceVehicleScheduleFrames,
  useVehicleScheduleFrameWithJourneys,
  useVehicleScheduleFrameWithRouteLabelAndLineId,
} from './hooks';
import { SpecialDayMixedPrioritiesWarning } from './SpecialDayMixedPrioritiesWarning';
import { SummarySection } from './SummarySection';
import { FormState, getDefaultValues } from './TimetablesImportFormSchema';

const testIds = {
  previewTitle: 'PreviewTimetablesPage::previewTitle',
  toggleShowStagingTimetables:
    'PreviewTimetablesPage::toggleShowStagingTimetables',
  saveButton: 'PreviewTimetablesPage::saveButton',
  closePreviewButton: 'PreviewTimetablesPage::closePreviewButton',
  loading: 'PrieviewTimetablesPage::LoadingOverlay',
};

export const PreviewTimetablesPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    vehicleJourneys,
    vehicleScheduleFrames,
    importingSomeSpecialDays,
    inconsistentSpecialDayPrioritiesStaged,
  } = useTimetablesImport();
  const [showStagingTimetables, toggleShowStagingTimetables] = useToggle(true);
  const { fetchToCombineTargetFrameId } =
    useToCombineTargetVehicleScheduleFrameId();
  const { onConfirmTimetablesImport, showConfirmFailedErrorDialog } =
    useConfirmTimetablesImportUIAction();
  const { fetchToReplaceFrames } = useToReplaceVehicleScheduleFrames();
  const { fetchVehicleFrames } =
    useVehicleScheduleFrameWithRouteLabelAndLineId();
  const { fetchVehicleFramesWithJourneys } =
    useVehicleScheduleFrameWithJourneys();
  const { fetchStagingVehicleFrameIds } =
    useGetStagingVehicleScheduleFrameIds();
  const { clearRouteDeviations, deviations, fetchRouteDeviations } =
    useReplaceDeviations(
      fetchToReplaceFrames,
      fetchVehicleFrames,
      fetchStagingVehicleFrameIds,
    );
  const {
    stagingAndTargetFramesForCombine,
    fetchStagingAndTargetFramesForCombine,
    clearStagingAndTargetFramesForCombine,
  } = useStagingAndTargetFramesForCombine(
    fetchToCombineTargetFrameId,
    fetchVehicleFramesWithJourneys,
    fetchStagingVehicleFrameIds,
  );
  const { duplicateJourneys } = useDuplicateJourneyDeviations(
    stagingAndTargetFramesForCombine,
  );
  const { combiningSameContractTimetables } =
    useCombiningSameContractTimetables(stagingAndTargetFramesForCombine);

  const isLoading = useAppSelector(selectIsJoreOperationLoading);
  const vehicleJourneyCount = vehicleJourneys?.length ?? 0;
  const importedTimetablesExist = vehicleJourneyCount > 0;
  // Default might be set incorrectly if data has not been fetched for the form.
  const formReadyForRender = !!vehicleScheduleFrames?.length;

  const formRef = useRef<ExplicitAny>(null);

  const onSave = () => {
    submitFormByRef(formRef);
  };

  const onSubmit = async (state: FormState) => {
    try {
      await onConfirmTimetablesImport(
        vehicleScheduleFrames.map((vsf) => vsf.vehicle_schedule_frame_id),
        state.priority,
        state.timetableImportStrategy,
      );

      navigate({
        pathname: routeDetails[Path.timetablesImport].getLink(),
      });
    } catch (error) {
      showConfirmFailedErrorDialog(error);
    }
  };

  return (
    <Container>
      <PageTitle.H1>{t('timetablesPreview.preview')}</PageTitle.H1>
      <div className="overflow-none mt-9 rounded-sm border border-grey">
        <Row className="justify-between rounded-t-sm border-brand bg-brand pr-8 pl-16 text-white">
          <h2 className="py-2" data-testid={testIds.previewTitle}>
            {t('timetablesPreview.departures', {
              count: vehicleJourneyCount,
            })}
          </h2>
          <div className="flex items-center">
            <label
              htmlFor="timetablesPreviewToggle"
              className="my-0 cursor-pointer text-base"
              aria-hidden
            >
              {showStagingTimetables
                ? t('timetablesPreview.closeContent')
                : t('timetablesPreview.showContent')}
              <AccordionButton
                identifier="timetablesPreviewToggle"
                testId={testIds.toggleShowStagingTimetables}
                isOpen={showStagingTimetables}
                onToggle={toggleShowStagingTimetables}
                iconClassName="text-[50px] text-white"
                openTooltip={t('accessibility:timetables.showPreview')}
                closeTooltip={t('accessibility:timetables.closePreview')}
                controls="fileContent"
              />
            </label>
          </div>
        </Row>
        <div className="px-16 py-9">
          <Row className="items-center gap-14">
            <h3>{t('timetablesPreview.contentUsage')}</h3>
            <Visible visible={formReadyForRender}>
              <ConfirmPreviewedTimetablesImportForm
                ref={formRef}
                fetchRouteDeviations={fetchRouteDeviations}
                fetchStagingAndTargetFramesForCombine={
                  fetchStagingAndTargetFramesForCombine
                }
                clearRouteDeviations={clearRouteDeviations}
                clearStagingAndTargetFramesForCombine={
                  clearStagingAndTargetFramesForCombine
                }
                onSubmit={onSubmit}
                defaultValues={getDefaultValues({ importingSomeSpecialDays })}
              />
            </Visible>
          </Row>
          <Visible visible={combiningSameContractTimetables}>
            <CombineSameContractWarning iconClassName="h-6 w-6" />
          </Visible>
          <Visible visible={inconsistentSpecialDayPrioritiesStaged}>
            <SpecialDayMixedPrioritiesWarning />
          </Visible>
        </div>
        <Visible visible={showStagingTimetables}>
          <div
            id="fileContent"
            className="flex items-center gap-14 rounded-b-sm bg-hsl-neutral-blue px-16 py-9"
          >
            <ImportContentsView vehicleScheduleFrames={vehicleScheduleFrames} />
          </div>
        </Visible>
      </div>
      <SummarySection
        className="mt-10"
        deviations={deviations}
        duplicateJourneys={duplicateJourneys}
      />
      <div className="pt-10">
        <Row className="justify-end gap-4">
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
    </Container>
  );
};
