import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Path, routeDetails } from '../../../../../router/routeDetails';
import { StopWithDetails } from '../../../../../types';
import { DetailRow, LabeledDetail } from '../layout';
import {
  getFormattedQuayCodes,
  getQuayPublicCodes,
} from './BasicDetailsMemberStops';

type Props = {
  stop: StopWithDetails;
};

const testIds = {
  areaLink: 'BasicDetailsSection::areaLink',
  areaPrivateCode: 'BasicDetailsSection::areaPrivateCode',
  areaQuays: 'BasicDetailsSection::areaQuays',
  areaName: 'BasicDetailsSection::areaName',
  areaNameSwe: 'BasicDetailsSection::areaNameSwe',
  areaNameLong: 'BasicDetailsSection::areaNameLong',
  areaNameLongSwe: 'BasicDetailsSection::areaNameLongSwe',
  areaAbbreviationName: 'BasicDetailsSection::areaAbbreviationName',
  areaAbbreviationNameSwe: 'BasicDetailsSection::areaAbbreviationNameSwe',
};

export const StopAreaDetailsSection = ({ stop }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      {/* Has negative margin to stretch grey bg to previous div */}
      <div className="-mx-5 -mt-5 bg-background px-5 pt-2.5">
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
        <DetailRow className="-mx-5 flex-wrap items-end gap-4 bg-background px-5 py-5 lg:flex-nowrap">
          <LabeledDetail
            title={t('stopDetails.basicAreaDetails.areaNameLongFin')}
            detail={stop.stop_place?.nameLongFin}
            testId={testIds.areaNameLong}
          />
          <LabeledDetail
            title={t('stopDetails.basicAreaDetails.areaNameLongSwe')}
            detail={stop.stop_place?.nameLongSwe}
            testId={testIds.areaNameLongSwe}
          />
          <div className="h-9 w-[0px] border-r border-black" />
          <LabeledDetail
            title={t('stopDetails.basicAreaDetails.areaAbbreviationFin')}
            detail={stop.stop_place?.abbreviationFin}
            testId={testIds.areaAbbreviationName}
          />
          <LabeledDetail
            title={t('stopDetails.basicAreaDetails.areaAbbreviationSwe')}
            detail={stop.stop_place?.abbreviationSwe}
            testId={testIds.areaAbbreviationNameSwe}
          />
        </DetailRow>
      </div>
    </>
  );
};
