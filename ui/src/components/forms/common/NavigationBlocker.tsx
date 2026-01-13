import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import noop from 'lodash/noop';
import without from 'lodash/without';
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { BlockerFunction, useBlocker } from 'react-router';
import { CloseIconButton, SimpleButtonButton } from '../../../uiComponents';

const testIds = {
  dialog: 'NavigationBlockedDialog',
  closeButton: 'NavigationBlockedDialog::closeButton',
  title: 'NavigationBlockedDialog::title',
  body: 'NavigationBlockedDialog::body',
  proceedButton: 'NavigationBlockedDialog::proceedButton',
  resetButton: 'NavigationBlockedDialog::resetButton',
};

// Context named after the file, that declares a blocker.
const knownNavigationContexts = [
  'BlockForAll',
  'ChangeTimetablesValidityForm',
  'CommonSubstitutePeriodForm',
  'ConfirmPreviewedTimetablesImportForm',
  'ConfirmTimetablesImportForm',
  'CopyStopAreaForm',
  'CopyStopForm',
  'CreateTimingPlaceForm',
  'EditStopForm',
  'ExternalLinksForm',
  'InfoSpotsForm',
  'LineForm',
  'LocationDetailsEdit',
  'LocationDetailsForm',
  'MaintenanceDetailsForm',
  'MeasurementsForm',
  'NavigationBlocker',
  'OccasionalSubstitutePeriodForm',
  'OrganisationDetailsForm',
  'RoutePropertiesForm',
  'SheltersForm',
  'SignageDetailsForm',
  'StopAreaDetailsEdit',
  'StopAreaForm',
  'StopAreaMemberStops',
  'StopBasicDetailsForm',
  'StopForm',
  'TemplateRouteSelector',
  'TerminalDetailsEdit',
  'TerminalForm',
  'TerminalInfoSpotsForm',
  'TerminalValidityForm',
  'TerminalMemberStopsForm',
  'TimingSettingsForm',
  'ViaForm',
] as const;

export type NavigationContext = (typeof knownNavigationContexts)[number];

// To be used in places like closing map page, blocks all possible dirty form contexts
const blockForAllFormsContext: NavigationContext = 'BlockForAll';

type IsNavigationAllowedFn = (
  args:
    | Readonly<Parameters<BlockerFunction>[0]>
    | { readonly context: NavigationContext | null },
) => boolean;
type UnregisterBlockFn = () => void;
type RegisterBlockFn = (blockerFn?: IsNavigationAllowedFn) => UnregisterBlockFn;

type PendingNavigationFn = () => void;
type RequestNavigationFn = (
  action: PendingNavigationFn,
  context?: NavigationContext,
) => void;

type BlockerContext = {
  readonly registerBlock: RegisterBlockFn;
  readonly requestNavigation: RequestNavigationFn;
};

export const navigationBlockerContext = createContext<BlockerContext>({
  registerBlock: () => noop,
  requestNavigation: noop,
});

function assertValidNavigationContext(
  context: unknown,
): asserts context is NavigationContext {
  if (!knownNavigationContexts.includes(context as NavigationContext)) {
    throw new Error(`Unknown navigation context (${context})!`);
  }
}

type MinimalFormState = {
  readonly isDirty: boolean;
  readonly isSubmitted: boolean;
  readonly isSubmitSuccessful: boolean;
};
type DirtyFormBlockNavigationOptions = {
  readonly allowSearchChange?: boolean; // Default false
  readonly allowStateChange?: boolean; // Default false
  readonly allowHashChange?: boolean; // Default false
};
export function useDirtyFormBlockNavigation(
  { isDirty, isSubmitted, isSubmitSuccessful }: MinimalFormState,
  context?: NavigationContext,
  {
    allowSearchChange = false,
    allowStateChange = false,
    allowHashChange = false,
  }: DirtyFormBlockNavigationOptions = {},
) {
  if (context) {
    assertValidNavigationContext(context);
  }

  const { registerBlock } = useContext(navigationBlockerContext);

  // Has something other than the allowed props of the location changed.
  const locationChangeCouldBlock: BlockerFunction = useCallback(
    ({ currentLocation: c, nextLocation: n }) =>
      c.pathname !== n.pathname ||
      (!allowSearchChange && c.search !== n.search) ||
      (!allowStateChange && c.state !== n.state) ||
      (!allowHashChange && c.hash !== n.hash),
    [allowSearchChange, allowStateChange, allowHashChange],
  );

  // If the form has been successfully submitted, we should no longer have
  // the need to block. Assumed that all modal/forms in the codebase are
  // closed down/navigated away as the result of a successfull submit.
  const submitIsOk = isSubmitted && isSubmitSuccessful;

  useEffect(() => {
    if (!isDirty) {
      return registerBlock(() => false);
    }

    return registerBlock((args) => {
      if ('currentLocation' in args && !locationChangeCouldBlock(args)) {
        return false;
      }

      // If processing a "close button click" that is trying to close a
      // modal, the form with the same context should be able to block it.
      // If args.context is blockAllFormsContext, skip context comparison block.
      if (
        context &&
        'context' in args &&
        args.context &&
        args.context !== blockForAllFormsContext &&
        args.context !== context
      ) {
        return false;
      }

      if (submitIsOk) {
        return false;
      }

      return true;
    });
  }, [registerBlock, isDirty, submitIsOk, context, locationChangeCouldBlock]);
}

/**
 * Wrap a "close modal" onClick handler in a "block navigation" feature.
 *
 * @param context Context/Name of the form that is being closed down.
 */
export function useWrapInContextNavigation(
  context: NavigationContext,
): (action: PendingNavigationFn) => () => void {
  assertValidNavigationContext(context);

  const { requestNavigation } = useContext(navigationBlockerContext);

  return useCallback(
    (action: PendingNavigationFn) => () => requestNavigation(action, context),
    [requestNavigation, context],
  );
}

// Default block navigation function
function blockNavigation() {
  return true;
}

type NavigationBlockedDialogProps = {
  readonly isOpen: boolean;
  readonly onProceed: () => void;
  readonly onReset: () => void;
};

const NavigationBlockedDialog: FC<NavigationBlockedDialogProps> = ({
  isOpen,
  onProceed,
  onReset,
}) => {
  const { t } = useTranslation();

  const initialFocusRef = useRef<HTMLButtonElement | null>(null);

  return (
    <Dialog
      className="fixed inset-0 z-50 flex h-full items-center justify-center bg-black bg-opacity-50"
      initialFocus={initialFocusRef}
      open={isOpen}
      onClose={onReset}
      data-testid={testIds.dialog}
    >
      {/* The actual basis number does not matter too much.
       * But it is needed to tell the flex-div above that the dialog itself should
       * stay smallish. Title row and the button row have nowrap stylings
       * that ensure that those rows should always take atleas as much width
       * as they need to show everything on one line.
       * The body text row should not request all the space it needs, but instead
       * should only consume as much with as is allocated by the title/button
       * rows.
       *
       * Easier solution would have been to use max-width but that would be
       * dependent on the locale (actual texts).
       */}
      <DialogPanel className="basis-[100px] rounded-md bg-white p-5 shadow-md">
        <DialogTitle
          as="h3"
          className="flex flex-nowrap justify-between space-x-5 text-nowrap"
          data-testid={testIds.title}
        >
          {t('navigationBlock.title')}

          <CloseIconButton onClick={onReset} testId={testIds.closeButton} />
        </DialogTitle>

        <Description className="my-5" data-testid={testIds.body}>
          {t('navigationBlock.body')}
        </Description>

        <div className="flex flex-nowrap space-x-5">
          <SimpleButtonButton
            className="text-nowrap"
            onClick={onProceed}
            testId={testIds.proceedButton}
          >
            {t('navigationBlock.proceed')}
          </SimpleButtonButton>

          <SimpleButtonButton
            className="text-nowrap"
            inverted
            onClick={onReset}
            testId={testIds.resetButton}
            ref={initialFocusRef}
          >
            {t('navigationBlock.cancel')}
          </SimpleButtonButton>
        </div>
      </DialogPanel>
    </Dialog>
  );
};

export const NavigationBlocker: FC<PropsWithChildren> = ({ children }) => {
  // Any clicks to nonnavigation (modal) close buttons
  const [pendingNavigations, setPendingNavigations] = useState<
    ReadonlyArray<PendingNavigationFn>
  >([]);

  // Any and all "check whether to block navigation/click" functions
  const [blocks, setBlocks] = useState<ReadonlyArray<IsNavigationAllowedFn>>(
    [],
  );

  // React router's navigation blocker
  const blocker = useBlocker(
    useCallback<BlockerFunction>(
      (args) => blocks.some((it) => it(args)),
      [blocks],
    ),
  );

  const proceed = () => {
    pendingNavigations.forEach((it) => it());
    setPendingNavigations([]);
    blocker.proceed?.();
  };

  const reset = () => {
    setPendingNavigations([]);
    blocker.reset?.();
  };

  // If the last blocker is removed, process pending navigations
  useEffect(() => {
    if (blocks.length === 0) {
      proceed();
    }

    // Trigger if block(ers) is changed or if ReactRouter's navigation blocker's
    // state changed (it can lag behind).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks, blocker.state]);

  // Registers a new blocker form a nested scope, returns a cleanup function.
  const registerBlock: RegisterBlockFn = useCallback(
    (blockerFn?: IsNavigationAllowedFn) => {
      // Wrap the given fn in a wrapper fn, so that we can just simply use
      // the fn's identity to manage multiple blocker instances.
      const customOrDefaultBlocker: IsNavigationAllowedFn = (args) =>
        (blockerFn ?? blockNavigation)(args);
      setBlocks((p) => p.concat(customOrDefaultBlocker));
      return () => setBlocks((p) => without(p, customOrDefaultBlocker));
    },
    [],
  );

  // Checks if clicks are blocker, if so opens up the confirmation modal
  // and schedules the action for later execution. Else schedules the action
  // for immediate async execution.
  const requestNavigation: RequestNavigationFn = useCallback(
    (action, context?) => {
      if (blocks.some((it) => it({ context: context ?? null }))) {
        setPendingNavigations((p) => p.concat(action));
      } else {
        // Stay consistent with the execution. Blocked = async, non-blocked = async.
        setTimeout(action, 0);
      }
    },
    [blocks],
  );

  const value: BlockerContext = useMemo(
    () => ({ registerBlock, requestNavigation }),
    [registerBlock, requestNavigation],
  );

  return (
    <navigationBlockerContext.Provider value={value}>
      {children}

      <NavigationBlockedDialog
        isOpen={blocker.state === 'blocked' || pendingNavigations.length > 0}
        onProceed={proceed}
        onReset={reset}
      />
    </navigationBlockerContext.Provider>
  );
};
