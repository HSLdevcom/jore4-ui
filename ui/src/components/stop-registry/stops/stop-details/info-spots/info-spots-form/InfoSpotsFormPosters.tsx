import { t } from 'i18next';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { Row } from '../../../../../../layoutComponents';
import { SimpleButton } from '../../../../../../uiComponents';
import { AddNewButton } from '../../../../../../uiComponents/AddNewButton';
import { InputField } from '../../../../../forms/common';
import { InfoSpotsFormState } from '../types';
import { usePosterNames } from './InfoSpotsPosterNames';
import { SizeFormFragment } from './SizeFormFragment';

const testIds = {
  addInfoSpotPoster: 'InfoSpotFormFields::addInfoSpotPoster',
  posterContainer: 'InfoSpotPosterFormFields::container',
  posterSize: 'InfoSpotPosterFormFields::posterSize',
  posterLabel: 'InfoSpotPosterFormFields::posterLabel',
  posterLines: 'InfoSpotPosterFormFields::posterLines',
  deleteInfoSpotPoster: 'InfoSpotFormFields::deleteInfoSpotPoster',
};

type InfoSpotsFormPostersProps = {
  readonly infoSpotIndex: number;
  readonly posterIndex: number;
  readonly infoSpotToBeDeleted?: boolean;
  readonly addPoster: (index: number) => void;
  readonly onRemovePoster: (index: number, posterIndex: number) => void;
};

export const InfoSpotsFormPosters: FC<InfoSpotsFormPostersProps> = ({
  infoSpotIndex,
  posterIndex,
  infoSpotToBeDeleted,
  addPoster,
  onRemovePoster,
}) => {
  const { watch } = useFormContext<InfoSpotsFormState>();
  const toBeDeletedPoster = watch(
    `infoSpots.${infoSpotIndex}.poster.${posterIndex}.toBeDeletedPoster`,
  );

  const posters = watch(`infoSpots.${infoSpotIndex}.poster`) ?? [];
  const isLastPoster = posterIndex === posters.length - 1;

  const posterOptions = usePosterNames();

  return (
    <div data-testid={testIds.posterContainer}>
      <Row className="my-5 flex-wrap items-end gap-4 px-10">
        <SizeFormFragment<InfoSpotsFormState>
          titlePath="stopDetails.infoSpots.posterSize"
          sizeStatePath={`infoSpots.${infoSpotIndex}.poster.${posterIndex}.size`}
          disabled={toBeDeletedPoster || infoSpotToBeDeleted}
        />

        <InputField<InfoSpotsFormState>
          type="text"
          translationPrefix="stopDetails"
          fieldPath={`infoSpots.${infoSpotIndex}.poster.${posterIndex}.label`}
          customTitlePath="stopDetails.infoSpots.posterLabel"
          testId={testIds.posterLabel}
          disabled={toBeDeletedPoster || infoSpotToBeDeleted}
          list="posternames-data-list"
        />
        <datalist id="posternames-data-list">
          {posterOptions.map(({ label }) => (
            <option key={label} value={label ?? ''}>
              {label}
            </option>
          ))}
        </datalist>
        <InputField<InfoSpotsFormState>
          type="text"
          translationPrefix="stopDetails"
          fieldPath={`infoSpots.${infoSpotIndex}.poster.${posterIndex}.lines`}
          customTitlePath="stopDetails.infoSpots.posterLines"
          testId={testIds.posterLines}
          disabled={toBeDeletedPoster || infoSpotToBeDeleted}
        />
      </Row>
      <Row className="px-10 pb-5">
        <SimpleButton
          shape="slim"
          testId={testIds.deleteInfoSpotPoster}
          onClick={() => onRemovePoster(infoSpotIndex, posterIndex)}
          inverted
          disabled={infoSpotToBeDeleted}
        >
          {t(
            toBeDeletedPoster
              ? 'stopDetails.infoSpots.cancelDeleteInfoSpot'
              : 'stopDetails.infoSpots.deleteInfoSpotPoster',
          )}
        </SimpleButton>
        {isLastPoster && !infoSpotToBeDeleted && (
          <AddNewButton
            testId={testIds.addInfoSpotPoster}
            label={t('stopDetails.infoSpots.addInfoSpotPoster')}
            onClick={() => addPoster(infoSpotIndex)}
            className="ml-auto"
          />
        )}
      </Row>
    </div>
  );
};
