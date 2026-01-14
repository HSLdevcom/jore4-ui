import { Transition } from '@headlessui/react';
import { FC, JSXElementConstructor, ReactNode, isValidElement } from 'react';
import { twJoin, twMerge } from 'tailwind-merge';
import { DefaultHeaderButtons } from './DefaultHeaderButtons';
import { InfoContainerColors } from './InfoContainerColors';
import { InfoContainerControls } from './InfoContainerControls';
import { InfoContainerHeaderButtonsProps } from './InfoContainerHeaderButtonsProps';

declare module 'react' {
  // Augment "style" prop to accept our CSS Variables
  interface CSSProperties {
    '--backgroundColor'?: string;
    '--borderColor'?: string;
  }
}

type InfoContainerProps = {
  readonly className?: string;
  readonly bodyClassName?: string;
  /**
   * Actual content that can be hidden or shown in the container.
   */
  readonly children: ReactNode;
  /**
   * Color theme for the box:
   * - Gray colors for StopAreas
   * - HSL Blues for Stops
   * - Purples for Terminals
   */
  readonly colors: InfoContainerColors;
  /**
   * Custom set of buttons to show on the title bar.
   * Title bar contains 2 components: title-prop and this.
   * Raw React node or a constructor to a component that accepts,
   * the controls as a prop.
   *
   * In nested React nodes the colors can be accessed with the help
   * of tailwind classes by referencing the CSS-variables:
   * - --backgroundColor
   * - --borderColor
   */
  readonly headerButtons?:
    | JSXElementConstructor<InfoContainerHeaderButtonsProps>
    | ReactNode;
  /**
   * Encapsulated state and functions to control the state of the
   * InfoContainer. Preferably this info should've been defined within
   * the component itself, but existing code mandates this less-than
   * perfect shape.
   */
  readonly controls: InfoContainerControls;
  readonly testIdPrefix?: string;
  /**
   * Title shown on the tittle bar.
   * String gets wrapped in a <h4>-tags.
   * Complex titles with multiple React nodes should wrap the
   * actual title text within a <h4>-tag.
   *
   * See also headerButtons.
   */
  readonly title: ReactNode;
};

const testIds = {
  title: (prefix: string) => `${prefix}::title`,
  container: (prefix: string) => `${prefix}::container`,
  content: (prefix: string) => `${prefix}::content`,
};

// Proper docstring within the {@link InfoContainerProps} type
export const InfoContainer: FC<InfoContainerProps> = ({
  className,
  children,
  colors: { backgroundColor, borderColor },
  controls,
  headerButtons: HeaderButtons = DefaultHeaderButtons,
  testIdPrefix = '',
  title,
  bodyClassName,
}) => {
  const { isExpanded } = controls;

  return (
    <div
      className={twMerge(
        'rounded-t-lg border border-(--borderColor)',
        isExpanded ? '' : 'rounded-b-lg',
        className,
      )}
      style={{
        '--backgroundColor': backgroundColor,
        '--borderColor': borderColor,
      }}
      data-testid={testIds.container(testIdPrefix)}
    >
      <div
        className={twJoin(
          'flex h-14 items-center justify-between rounded-lg bg-(--backgroundColor) px-4 py-2',
          isExpanded ? 'rounded-b-none border-b border-(--borderColor)' : '',
        )}
      >
        <span data-testid={testIds.title(testIdPrefix)}>
          {isValidElement(title) ? title : <h4>{title}</h4>}
        </span>

        {typeof HeaderButtons === 'function' ? (
          <HeaderButtons controls={controls} testIdPrefix={testIdPrefix} />
        ) : (
          HeaderButtons
        )}
      </div>

      <Transition
        show={isExpanded}
        enter="transition-all duration-150 overflow-hidden"
        enterFrom="max-h-0"
        enterTo="max-h-screen"
        leave="transition-all duration-150 overflow-hidden"
        leaveFrom="max-h-screen"
        leaveTo="max-h-0"
      >
        <div
          data-testid={testIds.content(testIdPrefix)}
          className={twMerge('p-5', bodyClassName)}
        >
          {children}
        </div>
      </Transition>
    </div>
  );
};
