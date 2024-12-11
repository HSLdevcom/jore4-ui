import React, { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { LoadingWrapper } from '../../../../uiComponents/LoadingWrapper';
import { SlimSimpleButton } from '../../../stop-registry/stops/stop-details/layout';
import {
  AreNamesConsistentResult,
  TypedName,
  useAreNamesConsistent,
  useAreStopAreaNamesConsistentWithStops,
  useAreStopNamesConsistentWithStopArea,
} from './useNamesAreValid';

const testIds = {
  loader: 'NameConsistencyChecker::loading',
  inconsistent: 'NameConsistencyChecker::inconsistent',
};

type NameConsistencyCheckerProps = {
  readonly areNamesConsistentResult: AreNamesConsistentResult;
  readonly className?: string;
};

const NameConsistencyCheckerImpl: FC<NameConsistencyCheckerProps> = ({
  areNamesConsistentResult: { consistent, error, loading, refetch },
  className,
}) => {
  const { t } = useTranslation();

  if (error) {
    return (
      <div
        aria-live="polite"
        className={twMerge('flex items-center', className)}
      >
        <Trans
          t={t}
          i18nKey="stopArea.checkingNamesFailed"
          components={{
            RefetchButton: (
              <SlimSimpleButton containerClassName="ml-2" onClick={refetch} />
            ),
          }}
        />
      </div>
    );
  }

  return (
    <LoadingWrapper
      testId={testIds.loader}
      loading={loading}
      loadingText={
        <span aria-live="polite">{t('stopArea.checkingNames')}</span>
      }
      size={16}
      orientation="row"
    >
      {consistent ? null : (
        <p
          aria-live="polite"
          className={twMerge('text-hsl-red', className)}
          data-testid={testIds.inconsistent}
        >
          {t('stopArea.sharedNameNotice')}
        </p>
      )}
    </LoadingWrapper>
  );
};

type NameAndMembersFormProps = {
  readonly className?: string;
  readonly memberStopIds: ReadonlyArray<string>;
  readonly stopAreaId: string | null | undefined;
  readonly stopAreaNameOverrides?: ReadonlyArray<TypedName>;
};

const NameAndMembersForm: FC<NameAndMembersFormProps> = ({
  className,
  memberStopIds,
  stopAreaId,
  stopAreaNameOverrides = [],
}) => {
  const result = useAreNamesConsistent(
    stopAreaId ?? null,
    memberStopIds,
    stopAreaNameOverrides,
  );

  return (
    <NameConsistencyCheckerImpl
      areNamesConsistentResult={result}
      className={className}
    />
  );
};

type MembersOnlyFormProps = {
  readonly className?: string;
  readonly memberStopIds: ReadonlyArray<string>;
  readonly stopAreaId: string | null | undefined;
};

const MembersOnlyForm: FC<MembersOnlyFormProps> = ({
  className,
  memberStopIds,
  stopAreaId,
}) => {
  return (
    <NameAndMembersForm
      className={className}
      memberStopIds={memberStopIds}
      stopAreaId={stopAreaId}
    />
  );
};

type NameOnlyFormProps = {
  readonly className?: string;
  readonly stopAreaId: string;
  readonly stopAreaNameOverrides: ReadonlyArray<TypedName>;
};

const NameOnlyForm: FC<NameOnlyFormProps> = ({
  className,
  stopAreaId,
  stopAreaNameOverrides,
}) => {
  const result = useAreStopNamesConsistentWithStopArea(
    stopAreaId,
    stopAreaNameOverrides,
  );

  return (
    <NameConsistencyCheckerImpl
      areNamesConsistentResult={result}
      className={className}
    />
  );
};

type StopNameFormProps = {
  readonly className?: string;
  readonly stopAreaId: string;
  readonly stopNames: ReadonlyArray<TypedName>;
};

const StopNameForm: FC<StopNameFormProps> = ({
  className,
  stopAreaId,
  stopNames,
}) => {
  const result = useAreStopAreaNamesConsistentWithStops(stopAreaId, stopNames);

  return (
    <NameConsistencyCheckerImpl
      areNamesConsistentResult={result}
      className={className}
    />
  );
};

type NameConsistencyChecker = typeof NameConsistencyCheckerImpl & {
  readonly MembersOnlyForm: typeof MembersOnlyForm;
  readonly NameAndMembersForm: typeof NameAndMembersForm;
  readonly NameOnlyForm: typeof NameOnlyForm;
  readonly StopNameForm: typeof StopNameForm;
};

export const NameConsistencyChecker: NameConsistencyChecker = Object.assign(
  NameConsistencyCheckerImpl,
  {
    MembersOnlyForm,
    NameAndMembersForm,
    NameOnlyForm,
    StopNameForm,
  },
);
