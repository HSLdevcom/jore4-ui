import noop from 'lodash/noop';
import { RefObject, useEffect, useState } from 'react';

export type VisibilityMap<ID extends string> = Readonly<Record<ID, boolean>>;

// Maps lines to { [lineId]: true } object.
function getAllShownMap<ID extends string>(
  groups: ReadonlyArray<ID>,
): VisibilityMap<ID> {
  const entries = groups.map((id) => [id, true]);
  return Object.fromEntries(entries);
}

/**
 * Keep a list of lines that do not fit on the screen.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
 *
 * @param allShown if true, the visibility map is disabled/not needed.
 * @param groups list of all lines that are expected to be in the list.
 * @param groupListRef ref to list container.
 */
export function useVisibilityMap<ID extends string>(
  allShown: boolean,
  groups: ReadonlyArray<ID>,
  groupListRef: RefObject<HTMLDivElement>,
): VisibilityMap<ID> {
  const [visibilityMap, setVisibilityMap] = useState<VisibilityMap<ID>>(() =>
    getAllShownMap(groups),
  );

  useEffect(() => {
    // Reset to default state
    setVisibilityMap(getAllShownMap(groups));

    if (allShown) {
      return noop;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const update = Object.fromEntries(
          entries.map((it) => [
            (it.target as HTMLElement).dataset.groupId ?? '',
            it.isIntersecting,
          ]),
        );

        setVisibilityMap((p) => ({ ...p, ...update }));
      },
      {
        root: groupListRef.current, // Check the lines against the container
        threshold: 1, // 1 = if even 1 pixel overflows, mark the line as intersecting
      },
    );

    // Observe each line = child
    Array.from(groupListRef.current?.children ?? []).forEach((child) => {
      if (
        child instanceof HTMLElement &&
        groups.includes(child.dataset.groupId as ID)
      ) {
        observer.observe(child);
      }
    });

    return () => observer.disconnect(); // Stop observing on cleanup
  }, [allShown, groups, groupListRef]);

  return visibilityMap;
}
