import noop from 'lodash/noop';
import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ControlledElement } from '../../../../forms/common/ControlledElement';
import {
  NameConsistencyChecker,
  SelectMemberStopsDropdown,
  StopAreaFormState,
} from '../../../../forms/stop-area';
import { SlimSimpleButton } from '../../../stops/stop-details/layout';

const testIds = {
  saveButton: 'MemberStops::saveButton',
  cancelButton: 'MemberStops::cancelButton',
  selectMemberStops: 'MemberStops::selectMemberStops',
};

function useMemberStopIds(): ReadonlyArray<string> {
  const { watch } = useFormContext<StopAreaFormState>();
  console.log(watch());
  const memberStops = watch('quays');
  return memberStops.map((it) => it.id);
}

type StopAreaMemberStopsEditHeaderProps = {
  readonly areaId: string | null | undefined;
  readonly onCancel: () => void;
};

export const StopAreaMemberStopsEditHeader: FC<
  StopAreaMemberStopsEditHeaderProps
> = ({ areaId, onCancel }) => {
  const { t } = useTranslation();
  const memberStopIds = useMemberStopIds();

  return (
    <>
      <div className="flex flex-grow flex-wrap-reverse items-center gap-x-4 gap-y-1 md:justify-center lg:flex-nowrap">
        <div className="hidden flex-grow lg:block" />

        <NameConsistencyChecker.MembersOnlyForm
          className="lg:flex-shrink-0"
          memberStopIds={memberStopIds}
          stopAreaId={areaId}
        />

        <ControlledElement
          id="memberStops"
          testId={testIds.selectMemberStops}
          fieldPath="memberStops"
          // eslint-disable-next-line react/no-unstable-nested-components
          inputElementRenderer={({ value, onChange, testId }) => (
            <SelectMemberStopsDropdown
              className="lg:w-1/2"
              editedStopAreaId={areaId}
              // The form related component typings have been effed up.
              // Everything is typed as a string.
              // Cast to Any until the form-typings get fixed (huge rewrite)
              value={value as ExplicitAny}
              onChange={onChange}
              testId={testId}
            />
          )}
        />
      </div>

      <div className="flex items-stretch gap-2 md:flex-wrap lg:flex-nowrap">
        <SlimSimpleButton
          containerClassName="w-full"
          className="flex-grow"
          inverted
          onClick={onCancel}
          testId={testIds.cancelButton}
        >
          {t('cancel')}
        </SlimSimpleButton>

        <SlimSimpleButton
          containerClassName="w-full"
          className="flex-grow"
          type="submit"
          onClick={noop}
          testId={testIds.saveButton}
        >
          {t('save')}
        </SlimSimpleButton>
      </div>
    </>
  );
};
