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
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { BlockerFunction, useBlocker } from 'react-router';
import { ConfirmationDialog } from '../../../uiComponents';

type PendingClickFn = () => void;
type IsNavigationAllowedFn = (
  args:
    | Readonly<Parameters<BlockerFunction>[0]>
    | { readonly closeButton: true },
) => boolean;

type UnRegisterBlockFn = () => void;
type RegisterBlockFn = (blockerFn?: IsNavigationAllowedFn) => UnRegisterBlockFn;
type RequestClickFn = (action: PendingClickFn) => void;

type BlockerContext = {
  readonly registerBlock: RegisterBlockFn;
  readonly requestClick: RequestClickFn;
};

const navigationBlockerContext = createContext<BlockerContext>({
  registerBlock: () => noop,
  requestClick: noop,
});

export function useRegisterBlock(blockerFn?: IsNavigationAllowedFn) {
  const { registerBlock } = useContext(navigationBlockerContext);
  useEffect(() => registerBlock(blockerFn), [registerBlock, blockerFn]);
}

type MinimalFormState = { readonly isDirty: boolean };
export function useDirtyFormBlockNavigation(formState: MinimalFormState) {
  const { registerBlock } = useContext(navigationBlockerContext);

  const { isDirty } = formState;
  useEffect(() => registerBlock(() => isDirty), [registerBlock, isDirty]);
}

export function useRequestClick(): RequestClickFn {
  return useContext(navigationBlockerContext).requestClick;
}

export const NavigationBlocker: FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation();

  // Any clicks to nonnavigation (modal) close buttons
  const [pendingClicks, setPendingClicks] = useState<
    ReadonlyArray<PendingClickFn>
  >([]);

  // Any and all "check whether to block navigation/click" functions
  const [blocks, setBlocks] = useState<ReadonlyArray<IsNavigationAllowedFn>>(
    [],
  );

  // React router's navigation blocker
  const blocker = useBlocker((args) => blocks.some((it) => it(args)));

  const proceed = () => {
    pendingClicks.forEach((it) => it());
    setPendingClicks([]);
    blocker.proceed?.();
  };

  const reset = () => {
    setPendingClicks([]);
    blocker.reset?.();
  };

  // Registers a new blocker form a nested scope, returns a cleanup function.
  const registerBlock: RegisterBlockFn = useCallback(
    (blockerFn?: IsNavigationAllowedFn) => {
      const customOrDefaultBlocker: IsNavigationAllowedFn =
        blockerFn ?? (() => true);
      setBlocks((p) => p.concat(customOrDefaultBlocker));
      return () => setBlocks((p) => without(p, customOrDefaultBlocker));
    },
    [],
  );

  // Checks if clicks are blocker, if so opens up the confirmation modal
  // and schedules the action for later execution. Else schedules the action
  // for immediate async execution.
  const requestClick: RequestClickFn = useCallback(
    (action) => {
      if (blocks.some((it) => it({ closeButton: true }))) {
        setPendingClicks((p) => p.concat(action));
      } else {
        // Stay consistent with the execution. Blocked = async, non-blocked = async.
        setTimeout(action, 0);
      }
    },
    [blocks],
  );

  const value: BlockerContext = useMemo(
    () => ({ registerBlock, requestClick }),
    [registerBlock, requestClick],
  );

  return (
    <navigationBlockerContext.Provider value={value}>
      {children}

      <ConfirmationDialog
        className="z-10"
        isOpen={blocker.state === 'blocked' || pendingClicks.length > 0}
        onConfirm={proceed}
        onCancel={reset}
        title={t('navigationBlock.title')}
        description={t('navigationBlock.body')}
        confirmText={t('navigationBlock.proceed')}
        cancelText={t('navigationBlock.cancel')}
        widthClassName="max-w-[400px]"
      />
    </navigationBlockerContext.Provider>
  );
};
