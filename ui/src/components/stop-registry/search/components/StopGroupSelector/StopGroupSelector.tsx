import {
  Dispatch,
  FocusEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
  RefObject,
  SetStateAction,
  SyntheticEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { twJoin, twMerge } from 'tailwind-merge';
import { Visible } from '../../../../../layoutComponents';
import { StopGroupOption } from './StopGroupOption';
import { StopGroupSelectorItem } from './StopGroupSelectorItem';
import { VisibilityMap, useVisibilityMap } from './useVisibilityMap';

const testIds = {
  showAll: `StopGroupSelector::showAllButton`,
  showLess: `StopGroupSelector::showLessButton`,
};

function stopEvent(event: SyntheticEvent) {
  event.stopPropagation();
  event.preventDefault();
}

/**
 * Walk up through the DOM tree from start up to topParent,
 * and try to find a HTMLElement that has data-group-id attribute.
 *
 * @param start 1st child to test
 * @param topParent assumed ancestor of start
 */
function findChildGroupElement(
  start: Element,
  topParent: Element,
): HTMLElement | null {
  let current: Element | null = start;

  while (current && current !== topParent) {
    if (current instanceof HTMLElement) {
      const { groupId } = current.dataset;
      if (typeof groupId === 'string') {
        return current;
      }
    }

    current = current.parentElement;
  }

  return null;
}

/**
 * Perform findChildGroupElement on the Event targets.
 *
 * @param target start from
 * @param currentTarget search up to
 */
function findGroupElementFromEvent({
  target,
  currentTarget,
}: SyntheticEvent): HTMLElement | null {
  if (
    !(target instanceof HTMLElement) ||
    !(currentTarget instanceof HTMLElement)
  ) {
    return null;
  }

  return findChildGroupElement(target, currentTarget);
}

function domRectContains(container: DOMRect, assumedChild: DOMRect): boolean {
  return (
    assumedChild.left >= container.left &&
    assumedChild.right <= container.right &&
    assumedChild.top >= container.top &&
    assumedChild.bottom <= container.bottom
  );
}

function someSelectedItemIsInView(groupElement: HTMLElement): boolean {
  const allSelected = groupElement.querySelectorAll('[aria-selected="true"]');
  const containerRect = groupElement.getBoundingClientRect();

  for (const selected of allSelected) {
    const selectedRect = selected.getBoundingClientRect();
    const visible = domRectContains(containerRect, selectedRect);

    if (visible) {
      return true;
    }
  }

  return false;
}

function useControls(
  groups: ReadonlyArray<StopGroupSelectorItem<string>>,
  onSelect: (selected: string | null) => void,
  showAll: boolean,
  visibilityMap: VisibilityMap<string>,
  groupListRef: RefObject<HTMLElement | null>,
  selectedGroups: ReadonlyArray<string> | null,
  setLastToHaveFocus: Dispatch<SetStateAction<string | null>>,
) {
  const [focusWithin, setFocusWithin] = useState(false);

  const onMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
    const group = findGroupElementFromEvent(e);
    if (group) {
      const { groupId } = group.dataset;
      const isSelected = group.ariaSelected === 'true';
      if (typeof groupId === 'string') {
        onSelect(groupId);
        // When selected, return to it. Else should prefer another selected option.
        setLastToHaveFocus(isSelected ? null : groupId);
      }
    }
  };

  // Find the child element with the given id as data-group-id.
  // Used to focus previous/next group.
  const focusByGroupId = (groupId: string) => {
    const targetElement = groupListRef.current?.querySelector(
      `[data-group-id="${groupId}"]`,
    );

    if (targetElement instanceof HTMLElement) {
      targetElement.focus();
    }
  };

  // On left arrow
  const onFocusPrevious = (currentGroupId: string) => {
    const currentIndex = groups.findIndex(
      (group) => group.id === currentGroupId,
    );
    if (currentIndex >= 1) {
      focusByGroupId(groups[currentIndex - 1].id);
    }
  };

  // On left arrow + some modifier key
  const onFocusPreviousSelected = (currentGroupId: string) => {
    if (!selectedGroups || selectedGroups.length === 0) {
      return;
    }

    if (selectedGroups.length === 1) {
      focusByGroupId(selectedGroups[0]);
    }

    const currentIndex = groups.findIndex(
      (group) => group.id === currentGroupId,
    );
    if (currentIndex > 0) {
      const previousGroups = groups.slice(0, currentIndex);
      const previousSelected = previousGroups.findLast((group) =>
        selectedGroups.includes(group.id),
      );
      if (previousSelected) {
        focusByGroupId(previousSelected.id);
      }
    }
  };

  // On right arrow
  const onFocusNext = (currentGroupId: string) => {
    const currentIndex = groups.findIndex(
      (group) => group.id === currentGroupId,
    );
    if (currentIndex >= 0 && currentIndex < groups.length - 1) {
      focusByGroupId(groups[currentIndex + 1].id);
    }
  };

  // On right arrow + some modifier key
  const onFocusNextSelected = (currentGroupId: string) => {
    if (!selectedGroups || selectedGroups.length === 0) {
      return;
    }

    if (selectedGroups.length === 1) {
      focusByGroupId(selectedGroups[0]);
    }

    const currentIndex = groups.findIndex(
      (group) => group.id === currentGroupId,
    );
    if (currentIndex >= 0 && currentIndex < groups.length - 1) {
      const nextGroups = groups.slice(currentIndex + 1);
      const nextSelected = nextGroups.find((group) =>
        selectedGroups.includes(group.id),
      );
      if (nextSelected) {
        focusByGroupId(nextSelected.id);
      }
    }
  };

  // Focus the group visually above or below (technically allows left/right too)
  // the currently focused group.
  const focusByVisualLocation = (
    currentGroup: HTMLElement,
    getCoordinates: (
      rect: DOMRect,
      gapInPixels: number,
    ) => { x: number; y: number },
  ) => {
    if (groupListRef.current === null) {
      return;
    }

    // Compute the pixel size of the list elements gap CSS attribute
    const gapInPixels = Number.parseFloat(
      window.getComputedStyle(groupListRef.current).gap,
    );

    const { x, y } = getCoordinates(
      currentGroup.getBoundingClientRect(),
      gapInPixels,
    );

    // Resolve top most element at xy coordinated relative to viewport.
    const elementAtPoint = document.elementFromPoint(x, y);

    // See if we have a valid group element as or as an ancestor of the
    // element found at the coordinates.
    if (elementAtPoint && groupListRef.current.contains(elementAtPoint)) {
      const groupElement = findChildGroupElement(
        elementAtPoint,
        groupListRef.current,
      );

      // If found -> Focus!
      groupElement?.focus();
    }
  };

  // On up arrow
  const onFocusAbove = (currentGroup: HTMLElement) => {
    focusByVisualLocation(
      currentGroup,
      ({ height, top, width, left }, gapInPixels) => ({
        x: Math.round(left + width / 2),
        y: Math.round(top - height / 2 - gapInPixels),
      }),
    );
  };

  // On down arrow
  const onFocusBelow = (currentGroup: HTMLElement) => {
    focusByVisualLocation(
      currentGroup,
      ({ height, bottom, width, left }, gapInPixels) => ({
        x: Math.round(left + width / 2),
        y: Math.round(bottom + height / 2 + gapInPixels),
      }),
    );
  };

  const onKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) => {
    const group = findGroupElementFromEvent(e);

    if (group) {
      const { groupId } = group.dataset;
      const isSelected = group.ariaSelected === 'true';
      if (typeof groupId !== 'string') {
        return;
      }

      const modifier = e.altKey || e.ctrlKey || e.metaKey || e.shiftKey;

      switch (e.key) {
        case ' ':
          onSelect(groupId);
          // When selected, return to it. Else should prefer another selected option.
          setLastToHaveFocus(isSelected ? null : groupId);
          stopEvent(e);
          break;

        case 'ArrowLeft':
          if (modifier) {
            onFocusPreviousSelected(groupId);
          } else {
            onFocusPrevious(groupId);
          }
          stopEvent(e);
          break;

        case 'ArrowRight':
          if (modifier) {
            onFocusNextSelected(groupId);
          } else {
            onFocusNext(groupId);
          }
          stopEvent(e);
          break;

        case 'ArrowUp':
          onFocusAbove(group);
          stopEvent(e);
          break;

        case 'ArrowDown':
          onFocusBelow(group);
          stopEvent(e);
          break;

        default:
          break;
      }
    }
  };

  // Find the selected item, and if it is not fully visible within the list
  // container, scroll the group element into view.
  const scrollSelectedIntoViewIfNeeded = useCallback(
    (behavior: ScrollBehavior, groupId?: string | null) => {
      if (!groupListRef.current) {
        return;
      }

      const someIsInView = someSelectedItemIsInView(groupListRef.current);
      if (someIsInView) {
        return;
      }

      let selected: Element | null;

      if (groupId) {
        // If groupId is provided, find the specific group element
        selected = groupListRef.current.querySelector(
          `[data-group-id="${groupId}"][aria-selected="true"]`,
        );
      }

      // Fallback to first selected element if no groupId provided or not found
      selected ??= groupListRef.current.querySelector('[aria-selected="true"]');

      if (!selected) {
        return;
      }

      const selectedRect = selected.getBoundingClientRect();
      const containerRect = groupListRef.current.getBoundingClientRect();
      const visible = domRectContains(containerRect, selectedRect);
      if (!visible) {
        selected.scrollIntoView({
          block: 'center',
          inline: 'center',
          behavior,
        });
      }
    },
    [groupListRef],
  );

  // Scroll the group element into view when it receives focus.
  const onFocus: FocusEventHandler<HTMLDivElement> = (e) => {
    if (!(e.target instanceof HTMLButtonElement)) {
      setFocusWithin(true);

      const group = findGroupElementFromEvent(e);
      if (group) {
        if (group.ariaSelected === 'true') {
          setLastToHaveFocus(group.dataset.groupId ?? null);
        }

        group.scrollIntoView({
          block: 'center',
          inline: 'center',
          behavior: 'smooth',
        });
      }
    }
  };

  // When the focus leaves the container element, and we are in minimized mode,
  // make sure the selected group is visible. Aka, if the user has "scrolled"
  // through the groups with ← & → arrow keys, without making a new selection.
  const onBlur: FocusEventHandler<HTMLDivElement> = (e) => {
    if (groupListRef.current === null) {
      return;
    }

    if (
      !groupListRef.current.contains(e.relatedTarget) ||
      e.relatedTarget instanceof HTMLButtonElement
    ) {
      setFocusWithin(false);

      if (!showAll) {
        // Scroll to the last selected group
        const latestSelected = selectedGroups?.at(-1);
        scrollSelectedIntoViewIfNeeded('smooth', latestSelected);
      }
    }
  };

  return {
    focusWithin,
    onMouseDown,
    onKeyDown,
    onBlur,
    onFocus,
    scrollSelectedIntoViewIfNeeded,
  };
}

function resolveFocusableElementId(
  focusWithinList: boolean,
  lastToHaveFocus: string | null,
  visibilityMap: VisibilityMap<string>,
  selected: ReadonlyArray<string> | null,
  groups: ReadonlyArray<StopGroupSelectorItem<string>>,
) {
  // If the list has focus within tab should always select exit from the list.
  if (focusWithinList) {
    return null;
  }

  // Else prefer to refocus the element that was last interacted with.
  // Should always be visible, might need to wait for scroll to finish.
  if (lastToHaveFocus && visibilityMap[lastToHaveFocus]) {
    return lastToHaveFocus;
  }

  // Fallbacks, 1st visible selected option
  const firstVisibleSelectedOption = selected?.find(
    (option) => visibilityMap[option],
  );
  if (firstVisibleSelectedOption) {
    return firstVisibleSelectedOption;
  }

  // Any 1st visible option.
  return groups.find((option) => visibilityMap[option.id])?.id;
}

type StopGroupSelectorProps = {
  readonly className?: string;
  readonly groups: ReadonlyArray<StopGroupSelectorItem<string>>;
  readonly label: ReactNode;
  readonly onSelect: (selected: ReadonlyArray<string> | null) => void;
  readonly selected: ReadonlyArray<string> | null;
};

const SHOW_ALL_BY_DEFAULT_MAX = 20;
const MAX_PADDING = 5;

export const StopGroupSelector = ({
  className,
  groups,
  label: radioGroupLabel,
  onSelect,
  selected,
}: StopGroupSelectorProps) => {
  const { t } = useTranslation();
  const id = useId();

  const showAllByDefault = groups.length <= SHOW_ALL_BY_DEFAULT_MAX;
  const [showAll, setShowAll] = useState(showAllByDefault);
  useEffect(() => setShowAll(showAllByDefault), [showAllByDefault]);

  const [lastToHaveFocus, setLastToHaveFocus] = useState<string | null>(null);

  const groupListRef = useRef<HTMLDivElement | null>(null);
  const groupIds = useMemo(() => groups.map((group) => group.id), [groups]);
  const visibilityMap = useVisibilityMap(showAll, groupIds, groupListRef);

  const someGroupIsHidden = useMemo(
    () => Object.values(visibilityMap).some((visible) => !visible),
    [visibilityMap],
  );

  const longestLabel = useMemo(
    () =>
      Math.min(
        Math.max(...groups.map((group) => group.label.length)),
        MAX_PADDING,
      ),
    [groups],
  );

  const handleSelect = useCallback(
    (selectedId: string | null) => {
      if (!selectedId) {
        return;
      }

      // If nothing is selected, set the new selected value
      if (!selected) {
        onSelect([selectedId]);
        return;
      }

      // If the selectedId is not in the selected array, add it
      if (!selected.includes(selectedId)) {
        onSelect([...selected, selectedId]);
        return;
      }

      // If the selectedId is already in the selected array,
      // remove it if it is not the only selected value
      if (selected.length > 1) {
        onSelect(selected.filter((sId) => sId !== selectedId));
      }
    },
    [onSelect, selected],
  );

  const {
    focusWithin,
    onMouseDown,
    onBlur,
    onFocus,
    onKeyDown,
    scrollSelectedIntoViewIfNeeded,
  } = useControls(
    groups,
    handleSelect,
    showAll,
    visibilityMap,
    groupListRef,
    selected,
    setLastToHaveFocus,
  );

  // Make sure the selected group is visible, on mount
  // or when the list if groups change.
  useEffect(() => {
    // Defer to next render cycle after the component is mounted to make sure that
    // the target element is not counted as visible if it is not.
    setTimeout(() => {
      // Scroll to the first selected group
      scrollSelectedIntoViewIfNeeded('instant');
    }, 0);
  }, [groups, scrollSelectedIntoViewIfNeeded]);

  useEffect(() => {
    if (!groupIds.includes(lastToHaveFocus as string)) {
      setLastToHaveFocus(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupIds]);

  const focusableOption = resolveFocusableElementId(
    focusWithin,
    lastToHaveFocus,
    visibilityMap,
    selected,
    groups,
  );

  return (
    <div
      className={twMerge('flex gap-2', className)}
      role="listbox"
      aria-labelledby={id}
      aria-multiselectable="true"
    >
      <label
        id={id}
        // Align the bottom of the labels text with the bottom of the options text.
        className="mb-0 mt-[calc(0.5rem+2px)] text-nowrap"
        role="none"
      >
        {radioGroupLabel}
      </label>

      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        onMouseDown={onMouseDown}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        className={twJoin(
          // focusByVisualLocation relies on the gap CSS attribute being present.
          // padding 4px to account for focus outline on the options.
          'flex items-center gap-2 overflow-x-auto p-[4px]',
          showAll ? 'flex-wrap' : '',
        )}
        ref={groupListRef}
        style={{ scrollbarWidth: 'none' }}
      >
        {groups.map((group) => (
          <StopGroupOption
            key={group.id}
            group={group}
            longestLabel={longestLabel}
            selected={!!selected?.includes(group.id)}
            showAll={showAll}
            showAllByDefault={showAllByDefault}
            visible={visibilityMap[group.id]}
            focusable={focusableOption === group.id}
          />
        ))}

        {/* Hide button is nested in here to render the button as a last element in the list. */}
        <Visible visible={!showAllByDefault && showAll}>
          <button
            className="text-nowrap text-base font-bold text-brand"
            data-testid={testIds.showLess}
            onClick={() => {
              setShowAll(false);
              // Make sure the selected group is visible when minimizing the list.
              // Defer to next render cycle, we need to wait for setShowAll call
              // to get flushed onto screen.
              setTimeout(() => {
                scrollSelectedIntoViewIfNeeded('instant', focusableOption);
              }, 0);
            }}
            type="button"
          >
            {t('stopRegistrySearch.showLessLines')}
          </button>
        </Visible>
      </div>

      {/* Show more button is outside the list as to exclude from the overflow calculations.  */}
      <Visible visible={!showAll && someGroupIsHidden}>
        <button
          className="text-nowrap text-base font-bold text-brand"
          data-testid={testIds.showAll}
          onClick={() => setShowAll(true)}
          type="button"
        >
          {t('stopRegistrySearch.showAllLines', { count: groups.length })}
        </button>
      </Visible>
    </div>
  );
};
