import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../../hooks';
import { Column, Row } from '../../../layoutComponents';
import { openTimingPlaceModalAction } from '../../../redux';
import { SimpleButton } from '../../../uiComponents';
import { InputField } from '../common';
import { ChooseTimingPlaceDropdown } from './ChooseTimingPlaceDropdown';

const testIds = {
  timingPlaceDropdown: 'TimingPlaceSelector::timingPlaceDropdown',
  addTimingPlaceButton: 'TimingPlaceSelector::addTimingPlaceButton',
};

export const TimingPlaceSelector = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  return (
    <Column>
      <Row>
        <InputField
          translationPrefix="stops"
          fieldPath="timingPlaceId"
          testId={testIds.timingPlaceDropdown}
          inputElementRenderer={(props) => (
            <ChooseTimingPlaceDropdown
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...props}
            />
          )}
          className="flex-1"
        />
        <SimpleButton
          containerClassName="self-end ml-6"
          onClick={() => dispatch(openTimingPlaceModalAction())}
          testId={testIds.addTimingPlaceButton}
        >
          {t('stops.createTimingPlace')}
        </SimpleButton>
      </Row>
    </Column>
  );
};
