import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { SimpleButton } from '../../../../common/Buttons';
import { InfoContainerHeaderButtonsProps } from '../../../../common/InfoContainer';
import { Visible } from '../../../../common/LayoutComponents';

const testIds = {
  toggle: (prefix: string) => `${prefix}::toggle`,
  addNewInfoSpotButton: (prefix: string) => `${prefix}::addNewInfoSpotButton`,
};

export const TerminalInfoSpotsHeaderButtons: FC<
  InfoContainerHeaderButtonsProps
> = ({
  controls: {
    isExpandable,
    isExpanded,
    setIsExpanded,
    isEditable,
    isInEditMode,
    setIsInEditMode,
  },
  testIdPrefix,
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex gap-2">
      <Visible visible={isEditable && !isInEditMode}>
        <SimpleButton
          shape="slim"
          testId={testIds.addNewInfoSpotButton(testIdPrefix)}
          onClick={() => setIsInEditMode(true)}
        >
          {t(($) => $.stopDetails.infoSpots.addInfoSpot)}
        </SimpleButton>
      </Visible>
      <Visible visible={isExpandable && !isInEditMode}>
        <SimpleButton
          shape="slim"
          onClick={() => setIsExpanded((expanded) => !expanded)}
          inverted={!isExpanded}
          testId={testIds.toggle(testIdPrefix)}
        >
          {isExpanded ? (
            <FaChevronUp className="text-white" aria-hidden />
          ) : (
            <FaChevronDown className="text-tweaked-brand" aria-hidden />
          )}
        </SimpleButton>
      </Visible>
    </div>
  );
};
