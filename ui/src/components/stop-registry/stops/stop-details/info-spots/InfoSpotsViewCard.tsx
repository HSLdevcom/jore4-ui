import { useTranslation } from 'react-i18next';
import { InfoSpotDetailsFragment } from '../../../../../generated/graphql';
import { HorizontalSeparator, Visible } from '../../../../../layoutComponents';
import { DetailRow, LabeledDetail } from '../layout';
import {
  formatDimension,
  optionalBooleanToUiText,
  valueToUiText,
} from '../utils';

const testIds = {
  container: 'InfoSpotsViewCard::container',
  backlight: 'InfoSpotsViewCard::backlight',
  description: 'InfoSpotsViewCard::description',
  floor: 'InfoSpotsViewCard::floor',
  label: 'InfoSpotsViewCard::label',
  posterPlaceSize: 'InfoSpotsViewCard::posterPlaceSize',
  infoSpotType: 'InfoSpotsViewCard::infoSpotType',
  displayType: 'InfoSpotsViewCard::displayType',
  speechProperty: 'InfoSpotsViewCard::speechProperty',
  purpose: 'InfoSpotsViewCard::purpose',
  railInformation: 'InfoSpotsViewCard::railInformation',
  zoneLabel: 'InfoSpotsViewCard::zoneLabel',
  maintenance: 'InfoSpotsViewCard::maintenance',
  poster: 'InfoSpotsViewCard::poster',
};
interface Props {
  infoSpot: InfoSpotDetailsFragment;
}

export const InfoSpotsViewCard = ({ infoSpot }: Props) => {
  const { t } = useTranslation();
  const { poster } = infoSpot;

  return (
    <div data-testid={testIds.container}>
      <div className="-ml-5 -mr-5 bg-background px-5">
        <DetailRow>
          <LabeledDetail
            title={t('stopDetails.infoSpots.label')}
            detail={infoSpot.label}
            testId={testIds.label}
          />
          <LabeledDetail
            title={t('stopDetails.infoSpots.purpose')}
            detail={infoSpot.purpose}
            testId={testIds.purpose}
          />
          <LabeledDetail
            title={t('stopDetails.infoSpots.posterPlaceType')}
            detail={valueToUiText(infoSpot.infoSpotType)}
            testId={testIds.infoSpotType}
          />
          {infoSpot.infoSpotType === 'static' && (
            <>
              <LabeledDetail
                title={t('stopDetails.infoSpots.posterPlaceSize')}
                detail={formatDimension(infoSpot.posterPlaceSize)}
                testId={testIds.posterPlaceSize}
              />
              <LabeledDetail
                title={t('stopDetails.infoSpots.backlight')}
                detail={optionalBooleanToUiText(infoSpot.backlight)}
                testId={testIds.backlight}
              />
              <LabeledDetail
                title={t('stopDetails.infoSpots.maintenance')}
                detail={infoSpot.maintenance}
                testId={testIds.maintenance}
              />
            </>
          )}
          {infoSpot.infoSpotType === 'dynamic' && (
            <>
              <LabeledDetail
                title={t('stopDetails.infoSpots.displayType')}
                detail={valueToUiText(infoSpot.displayType)}
                testId={testIds.displayType}
              />
              <LabeledDetail
                title={t('stopDetails.infoSpots.speechProperty')}
                detail={optionalBooleanToUiText(infoSpot.speechProperty)}
                testId={testIds.speechProperty}
              />
            </>
          )}
          <LabeledDetail
            title={t('stopDetails.location.latitude')}
            detail="PUUTTUU"
            testId={testIds.backlight}
          />
          <LabeledDetail
            title={t('stopDetails.location.longitude')}
            detail="PUUTTUU"
            testId={testIds.backlight}
          />
        </DetailRow>
        <DetailRow>
          <LabeledDetail
            title={t('stopDetails.infoSpots.description')}
            detail={infoSpot.description?.value}
            testId={testIds.description}
          />
        </DetailRow>
      </div>
      {infoSpot.infoSpotType === 'static' &&
        poster?.map((item, index) => (
          <div key={item?.label}>
            <DetailRow className="pl-5">
              <LabeledDetail
                title={t('stopDetails.infoSpots.posterSize')}
                detail={item?.posterSize}
                testId={testIds.poster}
              />
              <LabeledDetail
                title={t('stopDetails.infoSpots.posterLabel')}
                detail={item?.label}
                testId={testIds.poster}
              />
              <LabeledDetail
                title={t('stopDetails.infoSpots.posterLines')}
                detail={item?.lines}
                testId={testIds.poster}
              />
            </DetailRow>
            <Visible visible>
              <HorizontalSeparator
                className={index !== poster.length - 1 ? 'ml-5' : '-ml-5 -mr-5'}
              />
            </Visible>
          </div>
        ))}
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.infoSpots.stops')}
          detail={infoSpot.infoSpotLocations?.[0]}
          testId={testIds.zoneLabel}
        />
        <LabeledDetail
          title={t('stopDetails.infoSpots.terminals')}
          detail={infoSpot.infoSpotLocations?.[1]}
          testId={testIds.zoneLabel}
        />
        <LabeledDetail
          title={t('stopDetails.infoSpots.zoneLabel')}
          detail={infoSpot.zoneLabel}
          testId={testIds.zoneLabel}
        />
        <LabeledDetail
          title={t('stopDetails.infoSpots.railInformation')}
          detail={infoSpot.railInformation}
          testId={testIds.railInformation}
        />
        <LabeledDetail
          title={t('stopDetails.infoSpots.floor')}
          detail={infoSpot.floor}
          testId={testIds.floor}
        />
      </DetailRow>
    </div>
  );
};
