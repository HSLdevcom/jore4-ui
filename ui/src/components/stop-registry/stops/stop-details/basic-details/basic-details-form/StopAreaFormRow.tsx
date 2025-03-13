import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useGetStopDetails } from '../../../../../../hooks';
import { Column } from '../../../../../../layoutComponents';
import { Path, routeDetails } from '../../../../../../router/routeDetails';
import { FormRow, InputField } from '../../../../../forms/common';
import { getFormattedQuayCodes } from '../BasicDetailsMemberStops';
import { StopBasicDetailsFormState } from './schema';

const testIds = {
  areaLink: 'StopBasicDetailsForm::areaLink',
  areaQuays: 'StopBasicDetailsForm::areaQuays',
  areaPrivateCode: 'StopBasicDetailsForm::areaPrivateCode',
  areaName: 'StopBasicDetailsForm::areaName',
  areaNameSwe: 'StopBasicDetailsForm::areaNameSwe',
  areaNameLong: 'StopBasicDetailsForm::areaNameLong',
  areaNameLongSwe: 'StopBasicDetailsForm::areaNameLongSwe',
  areaAbbreviationName: 'StopBasicDetailsForm::areaAbbreviationName',
  areaAbbreviationNameSwe: 'StopBasicDetailsForm::areaAbbreviationNameSwe',
};

export const StopAreaFormRow = () => {
  const { stopDetails } = useGetStopDetails();
  const { t } = useTranslation();

  return (
    <div className="-mx-5 -mt-5 bg-background px-5 py-5">
      <Link
        to={routeDetails[Path.stopAreaDetails].getLink(
          stopDetails?.stop_place?.id,
        )}
        data-testid={testIds.areaLink}
        title={t('accessibility:stopAreas.showStopAreaDetails', {
          areaLabel: stopDetails?.stop_place?.name,
        })}
      >
        <div className="mb-5">
          <h3 data-testid="StopBasicDetailsForm::areaPrivateCode">
            {t('stopDetails.basicAreaDetails.areaPrivateCodeForm', {
              privateCode: stopDetails?.stop_place?.privateCode?.value ?? '',
            })}
            <i className="icon-open-in-new ml-1" aria-hidden="true" />
          </h3>
          <span data-testid="StopBasicDetailsForm::areaQuays">
            {stopDetails ? getFormattedQuayCodes(stopDetails, t) : ''}
          </span>
        </div>
      </Link>
      <FormRow mdColumns={2} className="mb-5">
        <Column>
          <InputField<StopBasicDetailsFormState>
            type="text"
            translationPrefix="stopDetails.basicAreaDetails"
            fieldPath="areaName"
            // TODO: This is disabled until we add saving stop area information
            disabled
            testId={testIds.areaName}
          />
        </Column>
        <Column>
          <InputField<StopBasicDetailsFormState>
            type="text"
            translationPrefix="stopDetails.basicAreaDetails"
            fieldPath="areaNameSwe"
            // TODO: This is disabled until we add saving stop area information
            disabled
            testId={testIds.areaNameSwe}
          />
        </Column>
      </FormRow>
      <FormRow mdColumns={4}>
        <Column>
          <InputField<StopBasicDetailsFormState>
            type="text"
            translationPrefix="stopDetails.basicAreaDetails"
            fieldPath="areaNameLongFin"
            // TODO: This is disabled until we add saving stop area information
            disabled
            testId={testIds.areaNameLong}
          />
        </Column>
        <Column>
          <InputField<StopBasicDetailsFormState>
            type="text"
            translationPrefix="stopDetails.basicAreaDetails"
            fieldPath="areaNameLongSwe"
            // TODO: This is disabled until we add saving stop area information
            disabled
            testId={testIds.areaNameLongSwe}
          />
        </Column>
        <Column>
          <InputField<StopBasicDetailsFormState>
            type="text"
            translationPrefix="stopDetails.basicAreaDetails"
            fieldPath="areaAbbreviationFin"
            // TODO: This is disabled until we add saving stop area information
            disabled
            testId={testIds.areaAbbreviationName}
          />
        </Column>
        <Column>
          <InputField<StopBasicDetailsFormState>
            type="text"
            translationPrefix="stopDetails.basicAreaDetails"
            fieldPath="areaAbbreviationSwe"
            // TODO: This is disabled until we add saving stop area information
            disabled
            testId={testIds.areaAbbreviationNameSwe}
          />
        </Column>
      </FormRow>
    </div>
  );
};
