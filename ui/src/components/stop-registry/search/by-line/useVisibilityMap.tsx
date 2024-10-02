import noop from 'lodash/noop';
import { RefObject, useEffect, useState } from 'react';
import { FindStopByLineInfo } from './useFindLinesByStopSearch';

type VisibilityMap = Readonly<Record<UUID, boolean>>;

// Maps lines to { [lineId]: true } object.
function getAllShownMap(
  lines: ReadonlyArray<FindStopByLineInfo>,
): VisibilityMap {
  const entries = lines.map((line) => [line.line_id, true]);
  return Object.fromEntries(entries);
}

/**
 * Keep a list of lines that do not fit on the screen.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
 *
 * @param allShown if true, the visibility map is disabled/not needed.
 * @param lines list of all lines that are expected to be in the list.
 * @param lineListRef ref to list container.
 */
export function useVisibilityMap(
  allShown: boolean,
  lines: ReadonlyArray<FindStopByLineInfo>,
  lineListRef: RefObject<HTMLDivElement>,
) {
  const [visibilityMap, setVisibilityMap] = useState<VisibilityMap>(() =>
    getAllShownMap(lines),
  );

  useEffect(() => {
    // Reset to default state
    setVisibilityMap(getAllShownMap(lines));

    if (allShown) {
      return noop;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const update = Object.fromEntries(
          entries.map((it) => [
            (it.target as HTMLElement).dataset.lineId ?? '',
            it.isIntersecting,
          ]),
        );

        setVisibilityMap((p) => ({ ...p, ...update }));
      },
      {
        root: lineListRef.current, // Check the lines against the container
        threshold: 1, // 1 = if even 1 pixel overflows, mark the line as intersecting
      },
    );

    const lineIds = lines.map((line) => line.line_id);

    // Observe each line = child
    Array.from(lineListRef.current?.children ?? []).forEach((child) => {
      if (
        child instanceof HTMLElement &&
        lineIds.includes(child.dataset.lineId ?? '')
      ) {
        observer.observe(child);
      }
    });

    return () => observer.disconnect(); // Stop observing on cleanup
  }, [allShown, lines, lineListRef]);

  return visibilityMap;
}
