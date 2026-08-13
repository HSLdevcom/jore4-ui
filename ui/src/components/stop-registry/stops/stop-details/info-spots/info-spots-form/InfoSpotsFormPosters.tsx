import { t } from 'i18next';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { AddNewButton, SimpleButton } from '../../../../../common/Buttons';
import { InputField } from '../../../../../common/Inputs';
import { Row } from '../../../../../common/LayoutComponents';
import { InfoSpotsFormState } from '../types';
import { PositionMoveControls, PurposeFormFragment } from '../utils';
import { SizeFormFragment } from '../utils/SizeFormFragment';

const testIds = {
  addInfoSpotPoster: 'InfoSpotFormFields::addInfoSpotPoster',
  posterContainer: 'InfoSpotPosterFormFields::container',
  posterSize: 'InfoSpotPosterFormFields::posterSize',
  posterLines: 'InfoSpotPosterFormFields::posterLines',
  deleteInfoSpotPoster: 'InfoSpotFormFields::deleteInfoSpotPoster',
  moveUpPoster: 'InfoSpotPosterFormFields::moveUpPoster',
  moveDownPoster: 'InfoSpotPosterFormFields::moveDownPoster',
  posterPositionIndicator: 'InfoSpotPosterFormFields::positionIndicator',
};

type InfoSpotsFormPostersProps = {
  readonly infoSpotIndex: number;
  readonly posterIndex: number;
  readonly infoSpotToBeDeleted?: boolean;
  readonly addPoster: () => void;
  readonly onRemovePoster: (index: number, posterIndex: number) => void;
  readonly onMovePosterUp: (posterIndex: number) => void;
  readonly onMovePosterDown: (posterIndex: number) => void;
  readonly isFirstPoster: boolean;
  readonly isLastPoster: boolean;
  readonly totalPosters: number;
};

export const InfoSpotsFormPosters: FC<InfoSpotsFormPostersProps> = ({
  infoSpotIndex,
  posterIndex,
  infoSpotToBeDeleted,
  addPoster,
  onRemovePoster,
  onMovePosterUp,
  onMovePosterDown,
  isFirstPoster,
  isLastPoster,
  totalPosters,
}) => {
  const { watch } = useFormContext<InfoSpotsFormState>();
  const toBeDeletedPoster = watch(
    `infoSpots.${infoSpotIndex}.poster.${posterIndex}.toBeDeletedPoster`,
  );

  return (
    <div data-testid={testIds.posterContainer}>
      <Row className="my-5 flex-wrap items-end gap-4 pr-5 pl-10">
        <SizeFormFragment<InfoSpotsFormState>
          titlePath="stopDetails.infoSpots.posterSize"
          sizeStatePath={`infoSpots.${infoSpotIndex}.poster.${posterIndex}.size`}
          disabled={toBeDeletedPoster || infoSpotToBeDeleted}
        />

        <PurposeFormFragment<InfoSpotsFormState>
          purposeStatePath={`infoSpots.${infoSpotIndex}.poster.${posterIndex}.label`}
          titlePath="stopDetails.infoSpots.posterPurpose"
          disabled={toBeDeletedPoster || infoSpotToBeDeleted}
        />
        <InputField<InfoSpotsFormState>
          type="text"
          translationPrefix="stopDetails"
          fieldPath={`infoSpots.${infoSpotIndex}.poster.${posterIndex}.lines`}
          customTitlePath="stopDetails.infoSpots.posterLines"
          testId={testIds.posterLines}
          disabled={toBeDeletedPoster || infoSpotToBeDeleted}
          className="grow"
        />
      </Row>
      <Row className="justify-between pr-5 pb-5 pl-10">
        <SimpleButton
          shape="slim"
          testId={testIds.deleteInfoSpotPoster}
          onClick={() => onRemovePoster(infoSpotIndex, posterIndex)}
          inverted
          disabled={infoSpotToBeDeleted}
        >
          {t(($) =>
            toBeDeletedPoster
              ? $.stopDetails.infoSpots.cancelDeleteInfoSpot
              : $.stopDetails.infoSpots.deleteInfoSpotPoster,
          )}
        </SimpleButton>
        <PositionMoveControls
          position={posterIndex + 1}
          total={totalPosters}
          isFirst={isFirstPoster}
          isLast={isLastPoster}
          disabled={toBeDeletedPoster || infoSpotToBeDeleted}
          onMoveUp={() => onMovePosterUp(posterIndex)}
          onMoveDown={() => onMovePosterDown(posterIndex)}
          testIds={{
            positionIndicator: testIds.posterPositionIndicator,
            moveUp: testIds.moveUpPoster,
            moveDown: testIds.moveDownPoster,
          }}
        />
      </Row>
      <Row className="pr-5 pb-5 pl-10">
        {isLastPoster && !infoSpotToBeDeleted && (
          <AddNewButton
            testId={testIds.addInfoSpotPoster}
            label={t(($) => $.stopDetails.infoSpots.addInfoSpotPoster)}
            onClick={addPoster}
            className="ml-auto"
          />
        )}
      </Row>
    </div>
  );
};
