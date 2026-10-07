import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteStopFieldsFragment } from '../../../../../generated/graphql';
import {
  excludeStopFromJourneyPatternAction,
  includeStopToJourneyPatternAction,
  useAppDispatch,
} from '../../../../../redux';
import { SimpleDropdownMenuItem } from '../../../../common/Dropdowns';

const testIds = {
  toggleStopInJourneyPatternButton:
    'RouteStopsOverlayRow::menu::toggleStopInJourneyPatternButton',
};

type ToggleOnRouteProps = {
  readonly belongsToJourneyPattern: boolean;
  readonly stop: RouteStopFieldsFragment;
};

export const ToggleOnRoute: FC<ToggleOnRouteProps> = ({
  belongsToJourneyPattern,
  stop,
}) => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const setBelongsToJourneyPattern = (onRoute: boolean) => {
    const setBelongsToJourneyPatternAction = onRoute
      ? includeStopToJourneyPatternAction
      : excludeStopFromJourneyPatternAction;

    dispatch(setBelongsToJourneyPatternAction(stop.label));
  };

  return (
    <SimpleDropdownMenuItem
      onClick={() => setBelongsToJourneyPattern(!belongsToJourneyPattern)}
      testId={testIds.toggleStopInJourneyPatternButton}
    >
      {belongsToJourneyPattern
        ? t(($) => $.stops.removeFromRoute)
        : t(($) => $.stops.addToRoute)}
    </SimpleDropdownMenuItem>
  );
};
