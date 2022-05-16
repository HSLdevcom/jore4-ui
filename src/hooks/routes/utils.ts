export const extractFirstAndLastStopFromStops = (
  stopIdsWithinRoute: UUID[],
) => {
  // TODO: These will be removed from schema, remove from here as well
  const startingStopId = stopIdsWithinRoute[0];
  const finalStopId = stopIdsWithinRoute[stopIdsWithinRoute.length - 1];

  return { startingStopId, finalStopId };
};
