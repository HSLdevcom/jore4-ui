import { t } from 'i18next';
import { FC, useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { twJoin } from 'tailwind-merge';
import {
  InfoSpotDetailsFragment,
  StopRegistryIntendedUser,
} from '../../../../../../generated/graphql';
import {
  mapIntendedUserToUiName,
  mapZoneLabelToUiName,
} from '../../../../../../utils/i18n';
import { AddNewButton, SimpleButton } from '../../../../../common/Buttons';
import {
  EnumDropdown,
  NullableBooleanDropdown,
} from '../../../../../common/Dropdowns';
import { InputField } from '../../../../../common/Inputs';
import { Column, Row } from '../../../../../common/LayoutComponents';
import { ZoneLabel } from '../../../../types';
import { InfoSpotsFormState, PosterState } from '../types';
import { defaultInfoSpotPosterValues, mapStringToPurpose } from '../utils';
import { InfoSpotsFormPosters } from './InfoSpotsFormPosters';
import { SizeFormFragment } from './SizeFormFragment';

const testIds = {
  description: 'InfoSpotFormFields::description',
  label: 'InfoSpotFormFields::label',
  intendedUser: 'InfoSpotFormFields::intendedUser',
  latitude: 'InfoSpotFormFields::latitude',
  longitude: 'InfoSpotFormFields::longitude',
  backlight: 'InfoSpotFormFields::backlight',
  floor: 'InfoSpotFormFields::floor',
  railInformation: 'InfoSpotFormFields::railInformation',
  stops: 'InfoSpotFormFields::stops',
  terminals: 'InfoSpotFormFields::terminals',
  zoneLabel: 'InfoSpotFormFields::zoneLabel',
  posterSize: 'InfoSpotPosterFormFields::posterSize',
  posterLines: 'InfoSpotPosterFormFields::posterLines',
  deleteInfoSpot: 'InfoSpotFormFields::deleteInfoSpot',
  moveUpInfoSpot: 'InfoSpotFormFields::moveUpInfoSpot',
  moveDownInfoSpot: 'InfoSpotFormFields::moveDownInfoSpot',
  positionIndicator: 'InfoSpotFormFields::positionIndicator',
  addInfoSpotPoster: 'InfoSpotFormFields::addInfoSpotPoster',
  noPosters: 'InfoSpotFormFields::noPosters',
};

type InfoSpotFormFieldsProps = {
  readonly infoSpotIndex: number;
  readonly infoSpotsData: ReadonlyArray<InfoSpotDetailsFragment>;
  readonly onRemove: (index: number) => void;
  readonly onMoveUp: (index: number) => void;
  readonly onMoveDown: (index: number) => void;
  readonly isFirst: boolean;
  readonly isLast: boolean;
  readonly totalCount: number;
};

export const InfoSpotFormFields: FC<InfoSpotFormFieldsProps> = ({
  infoSpotIndex,
  infoSpotsData,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  totalCount,
}) => {
  const { register, watch, getValues, setValue, control } =
    useFormContext<InfoSpotsFormState>();
  const toBeDeleted = watch(`infoSpots.${infoSpotIndex}.toBeDeleted`);
  const [justMoved, setJustMoved] = useState(false);

  const { fields: posters, append: appendPoster } = useFieldArray({
    control,
    name: `infoSpots.${infoSpotIndex}.poster`,
  });

  const addPoster = () => {
    const newPoster: PosterState = {
      size: {
        uiState: 'EXISTING',
        width: defaultInfoSpotPosterValues.width,
        height: defaultInfoSpotPosterValues.height,
      },
      label: mapStringToPurpose(defaultInfoSpotPosterValues.label),
      lines: '',
      toBeDeletedPoster: false,
      id: null,
    };
    appendPoster(newPoster);
  };

  const onRemovePoster = (idx: number, posterIndex: number) => {
    const newToBeDeleted = !getValues(
      `infoSpots.${idx}.poster.${posterIndex}.toBeDeletedPoster`,
    );
    setValue(
      `infoSpots.${idx}.poster.${posterIndex}.toBeDeletedPoster`,
      newToBeDeleted,
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true, // Add this to trigger revalidation
      },
    );
  };

  const handleMoveUp = () => {
    onMoveUp(infoSpotIndex);
    setJustMoved(true);
  };

  const handleMoveDown = () => {
    onMoveDown(infoSpotIndex);
    setJustMoved(true);
  };

  useEffect(() => {
    if (!justMoved) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setJustMoved(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [justMoved]);

  return (
    <Column>
      <div className="bg-background p-5">
        <span className="mb-2.5 block text-xl">
          <i
            className="icon-passenger-info mr-2.5 text-brand"
            role="presentation"
          />
          {t(($) => $.stopDetails.infoSpots.infoSpot, {
            infoSpot: infoSpotsData[infoSpotIndex]?.label,
          })}
        </span>
        <Row className="flex-wrap items-end gap-4 py-2.5">
          <InputField<InfoSpotsFormState>
            type="text"
            translationPrefix="stopDetails"
            fieldPath={`infoSpots.${infoSpotIndex}.label`}
            testId={testIds.label}
            disabled={toBeDeleted}
          />

          <InputField<InfoSpotsFormState>
            translationPrefix="stopDetails"
            fieldPath={`infoSpots.${infoSpotIndex}.intendedUser`}
            testId={testIds.intendedUser}
            // eslint-disable-next-line react/no-unstable-nested-components
            inputElementRenderer={(props) => (
              <EnumDropdown<StopRegistryIntendedUser>
                enumType={StopRegistryIntendedUser}
                placeholder={t(($) => $.unknown)}
                uiNameMapper={(val) => mapIntendedUserToUiName(t, val)}
                buttonClassName="min-w-32"
                includeNullOption
                disabled={toBeDeleted}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...props}
              />
            )}
          />

          <SizeFormFragment<InfoSpotsFormState>
            sizeStatePath={`infoSpots.${infoSpotIndex}.size`}
            titlePath="stopDetails.infoSpots.size"
            disabled={toBeDeleted}
          />

          <InputField<InfoSpotsFormState>
            translationPrefix="stopDetails"
            fieldPath={`infoSpots.${infoSpotIndex}.backlight`}
            testId={testIds.backlight}
            // eslint-disable-next-line react/no-unstable-nested-components
            inputElementRenderer={(props) => (
              <NullableBooleanDropdown
                placeholder={t(($) => $.unknown)}
                buttonClassName="min-w-32"
                disabled={toBeDeleted}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...props}
              />
            )}
          />
        </Row>
        <Row className="flex-wrap items-end gap-4 py-2.5 lg:flex-nowrap">
          <InputField<InfoSpotsFormState>
            translationPrefix="stopDetails"
            fieldPath={`infoSpots.${infoSpotIndex}.zoneLabel`}
            testId={testIds.zoneLabel}
            // eslint-disable-next-line react/no-unstable-nested-components
            inputElementRenderer={(props) => (
              <EnumDropdown<ZoneLabel>
                enumType={ZoneLabel}
                placeholder={t(($) => $.unknown)}
                uiNameMapper={(val) => mapZoneLabelToUiName(t, val)}
                buttonClassName="min-w-32"
                disabled={toBeDeleted}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...props}
              />
            )}
          />

          <InputField<InfoSpotsFormState>
            type="text"
            translationPrefix="stopDetails"
            fieldPath={`infoSpots.${infoSpotIndex}.railInformation`}
            inputClassName="w-20"
            testId={testIds.railInformation}
            disabled={toBeDeleted}
          />

          <InputField<InfoSpotsFormState>
            type="text"
            translationPrefix="stopDetails"
            fieldPath={`infoSpots.${infoSpotIndex}.floor`}
            inputClassName="w-20"
            testId={testIds.floor}
            disabled={toBeDeleted}
          />
        </Row>
        <Column className="items-stretch gap-4 bg-background py-2.5">
          <InputField<InfoSpotsFormState>
            type="text"
            translationPrefix="stopDetails"
            fieldPath={`infoSpots.${infoSpotIndex}.description.value`}
            testId={testIds.description}
            customTitlePath="stopDetails.infoSpots.description"
            disabled={toBeDeleted}
          />

          <Row className="justify-between gap-2">
            <SimpleButton
              shape="slim"
              testId={testIds.deleteInfoSpot}
              onClick={() => onRemove(infoSpotIndex)}
              inverted
            >
              {toBeDeleted
                ? t(($) => $.stopDetails.infoSpots.cancelDeleteInfoSpot)
                : t(($) => $.stopDetails.infoSpots.deleteInfoSpot)}
            </SimpleButton>
            <Row className="gap-2">
              <span
                data-testid={testIds.positionIndicator}
                className={twJoin(
                  'flex items-center rounded-sm p-2 transition-colors',
                  justMoved
                    ? 'bg-hsl-light-green'
                    : 'bg-gray-300 duration-3000',
                )}
              >
                {infoSpotIndex + 1}/{totalCount}
              </span>
              <SimpleButton
                className="rounded-sm px-2"
                shape="slim"
                testId={testIds.moveUpInfoSpot}
                onClick={handleMoveUp}
                disabled={isFirst || toBeDeleted}
                inverted
              >
                <i className="icon-arrow rotate-180" />
              </SimpleButton>
              <SimpleButton
                className="rounded-sm px-2"
                shape="slim"
                testId={testIds.moveDownInfoSpot}
                onClick={handleMoveDown}
                disabled={isLast || toBeDeleted}
                inverted
              >
                <i className="icon-arrow" />
              </SimpleButton>
            </Row>
          </Row>
        </Column>
      </div>
      {posters?.length ? (
        posters.map((poster, posterIndex) => (
          <InfoSpotsFormPosters
            key={poster.id}
            infoSpotIndex={infoSpotIndex}
            posterIndex={posterIndex}
            addPoster={addPoster}
            onRemovePoster={onRemovePoster}
            infoSpotToBeDeleted={toBeDeleted}
          />
        ))
      ) : (
        <Row className="items-center p-5">
          <span data-testid={testIds.noPosters}>
            <i className="icon-alert mr-2.5 text-hsl-red" role="presentation" />
            {t(($) => $.stopDetails.infoSpots.noPosters)}
          </span>
          <AddNewButton
            testId={testIds.addInfoSpotPoster}
            label={t(($) => $.stopDetails.infoSpots.addInfoSpotPoster)}
            onClick={addPoster}
            className="ml-auto"
          />
        </Row>
      )}
      <input
        type="checkbox"
        hidden
        {...register(`infoSpots.${infoSpotIndex}.toBeDeleted`)}
      />
    </Column>
  );
};
