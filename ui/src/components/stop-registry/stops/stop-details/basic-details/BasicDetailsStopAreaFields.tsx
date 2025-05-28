import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Path, routeDetails } from '../../../../../router/routeDetails';
import { StopWithDetails } from '../../../../../types';
import { AlternativeNames } from '../../../components/AlternativeNames/AlternativeNames';
import { DetailRow, LabeledDetail } from '../layout';
import {
  getFormattedQuayCodes,
  getQuayPublicCodes,
} from './BasicDetailsMemberStops';

type StopAreaDetailsSectionProps = {
  readonly stop: StopWithDetails;
};

const testIds = {
  areaLink: 'BasicDetailsSection::areaLink',
  areaPrivateCode: 'BasicDetailsSection::areaPrivateCode',
  areaQuays: 'BasicDetailsSection::areaQuays',
  areaName: 'BasicDetailsSection::areaName',
  areaNameSwe: 'BasicDetailsSection::areaNameSwe',
  areaNameEng: 'BasicDetailsSection::areaNameEng',
  areaNameLong: 'BasicDetailsSection::areaNameLong',
  areaNameLongSwe: 'BasicDetailsSection::areaNameLongSwe',
  areaNameLongEng: 'BasicDetailsSection::areaNameLongEng',
  areaAbbreviationName: 'BasicDetailsSection::areaAbbreviationName',
  areaAbbreviationNameSwe: 'BasicDetailsSection::areaAbbreviationNameSwe',
  areaAbbreviationNameEng: 'BasicDetailsSection::areaAbbreviationNameEng',
};

export const StopAreaDetailsSection: FC<StopAreaDetailsSectionProps> = ({
  stop,
}) => {
  const { t } = useTranslation();

  return (
    <div className="-mx-5 -mt-5 bg-background px-5 pt-2.5">
      {/* Has negative margin to stretch grey bg to previous div */}
      <DetailRow>
        <Link
          to={routeDetails[Path.stopAreaDetails].getLink(stop.stop_place?.id)}
          data-testid={testIds.areaLink}
          title={t('accessibility:stopAreas.showStopAreaDetails', {
            areaLabel: stop.stop_place?.name,
          })}
        >
          <div className="flex flex-col">
            <div className="text-sm">
              {t('stopDetails.basicAreaDetails.areaPrivateCode')}
            </div>
            <div
              className="text-sm font-bold"
              data-testid={testIds.areaPrivateCode}
            >
              <span>{stop.stop_place?.privateCode?.value}</span>
              <i className="icon-open-in-new ml-1" aria-hidden="true" />
            </div>
          </div>
        </Link>
        <LabeledDetail
          title={t('stopDetails.basicAreaDetails.areaMemberStops', {
            count: getQuayPublicCodes(stop).length,
          })}
          detail={getFormattedQuayCodes(t, stop)}
          testId="BasicDetailsSection::areaQuays"
        />
        <LabeledDetail
          title={t('stopDetails.basicAreaDetails.areaName')}
          detail={stop.stop_place?.name}
          testId={testIds.areaName}
        />
        <LabeledDetail
          title={t('stopDetails.basicAreaDetails.areaNameSwe')}
          detail={stop.stop_place?.nameSwe}
          testId={testIds.areaNameSwe}
        />
      </DetailRow>
      <div className="-mx-5 mb-1 flex-wrap items-end gap-4 bg-background px-5 py-5 lg:flex-nowrap">
        {stop.stop_place && (
          <AlternativeNames alternativeNames={stop.stop_place} />
        )}
      </div>
    </div>
  );
};
