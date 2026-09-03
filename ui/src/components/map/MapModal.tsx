import { FC, KeyboardEventHandler, ReactNode } from 'react';
import { twJoin, twMerge } from 'tailwind-merge';
import { ModalBody, ModalHeader } from '../common/Modals';
import {
  NavigationContext,
  useWrapInContextNavigation,
} from '../forms/common/NavigationBlocker';

function doOnEscape<E extends HTMLElement>(
  callback: () => void,
): KeyboardEventHandler<E> {
  return (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      callback();
    }
  };
}

type ModalProps = {
  readonly className?: string;
  readonly headerClassName?: string;
  readonly bodyClassName?: string;
  readonly testId?: string;
  readonly heading: ReactNode;
  readonly onClose: () => void;

  readonly children: ReactNode;
  readonly navigationContext: NavigationContext;
};

export const MapModal: FC<ModalProps> = ({
  className,
  headerClassName,
  bodyClassName,
  testId,
  heading,
  onClose,
  children,
  navigationContext,
}) => {
  const wrapInContextNavigation = useWrapInContextNavigation(navigationContext);
  const requestNavigationOnClose = wrapInContextNavigation(onClose);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      data-testid={testId}
      className={twMerge('overflow-hidden bg-white', className)}
      onKeyDown={doOnEscape(requestNavigationOnClose)}
    >
      <ModalHeader
        className={headerClassName}
        onClose={requestNavigationOnClose}
        heading={heading}
      />

      <ModalBody
        className={twJoin(
          'overflow-auto border-x border-light-grey',
          bodyClassName,
        )}
      >
        {children}
      </ModalBody>
    </div>
  );
};
