import merge from 'lodash/merge';
import noop from 'lodash/noop';
import { useState } from 'react';
import { InfoContainerControls } from './InfoContainerControls';

type InfoContainerControlOptions = {
  readonly isExpandable: boolean;
  readonly isEditable: boolean;
  readonly expandedByDefault: boolean;
  readonly onSave: () => void;
  readonly onCancel: () => void;
};

const defaultOptions: InfoContainerControlOptions = {
  isExpandable: false,
  isEditable: false,
  expandedByDefault: true,
  onSave: noop,
  onCancel: noop,
};

function getAllOptions(
  options: Partial<InfoContainerControlOptions> | undefined,
): InfoContainerControlOptions {
  if (options) {
    return merge(options, defaultOptions);
  }

  return defaultOptions;
}

/**
 * Create the state and controls to use with {@link InfoContainer}
 *
 * @param options Enabled features and edit hooks
 */
export function useInfoContainerControls(
  options?: Partial<InfoContainerControlOptions>,
): InfoContainerControls {
  const { isExpandable, isEditable, expandedByDefault, onSave, onCancel } =
    getAllOptions(options);

  const [isExpanded, setIsExpanded] = useState(expandedByDefault);
  const [isInEditMode, setIsInEditMode] = useState(false);

  return {
    isExpandable,
    isExpanded,
    setIsExpanded,

    isEditable,
    isInEditMode,
    setIsInEditMode,

    onSave,
    onCancel: () => {
      setIsInEditMode(false);
      onCancel();
    },
  };
}
