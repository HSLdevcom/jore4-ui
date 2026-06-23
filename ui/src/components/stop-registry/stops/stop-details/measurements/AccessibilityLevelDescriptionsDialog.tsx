import { Dialog } from '@headlessui/react';
import { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { StopRegistryAccessibilityLevel } from '../../../../../generated/graphql';
import { NewModalBody, NewModalHeader } from '../../../../../uiComponents';
import { Column, Row } from '../../../../common/LayoutComponents';
import {
  AccessibilityLevelIcon,
  AccessibilityLevelWithIcon,
} from './AccessibilityLevelIcon';

type DescriptionSectionProps = {
  readonly titlePrefix?: ReactNode;
  readonly title: ReactNode;
  readonly items: ReadonlyArray<ReactNode>;
  readonly level?: AccessibilityLevelWithIcon | null;
};

const DescriptionSection: FC<DescriptionSectionProps> = ({
  titlePrefix,
  title,
  items,
  level,
}) => {
  return (
    <div className="py-4 pr-3 pl-6 odd:bg-white even:bg-background">
      <h3 className="text-lg">
        {titlePrefix ? <>{titlePrefix}:</> : null} {title}
      </h3>
      <Row>
        <Column>
          <ul className="list-disc pl-4">
            {items.map((item) => (
              <li>{item}</li>
            ))}
          </ul>
        </Column>
        <Column>{level && <AccessibilityLevelIcon level={level} />}</Column>
      </Row>
    </div>
  );
};

type AccessibilityLevelDescriptionsDialogProps = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
};

export const AccessibilityLevelDescriptionsDialog: FC<
  AccessibilityLevelDescriptionsDialogProps
> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('common');
  const { t: tDescription } = useTranslation('common', {
    keyPrefix: ($) => $.stopDetails.accessibilityLevelDescriptions,
  });

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      // The dialog should be positioned so that it doesn't block the stop details.
      //  Placing it on the top right of screen works in most cases.
      className="absolute top-28 right-16 max-h-[calc(100vh-12rem)] overflow-y-auto border border-grey drop-shadow-lg"
    >
      <NewModalHeader
        heading={t(
          ($) => $.stopDetails.accessibilityLevelDescriptions.modalTitle,
        )}
        onClose={onClose}
        className="border-0 bg-white pb-0"
      />
      <NewModalBody className="max-w-md p-0">
        <DescriptionSection
          titlePrefix={4}
          title={t(($) => $.stopAccessibilityLevelEnum.fullyAccessible)}
          items={[
            tDescription(($) => $.fullyAccessible.item1),
            tDescription(($) => $.fullyAccessible.item2),
            tDescription(($) => $.fullyAccessible.item3),
            tDescription(($) => $.fullyAccessible.item4),
          ]}
          level={StopRegistryAccessibilityLevel.FullyAccessible}
        />

        <DescriptionSection
          titlePrefix={3}
          title={t(($) => $.stopAccessibilityLevelEnum.mostlyAccessible)}
          items={[
            tDescription(($) => $.mostlyAccessible.item1),
            tDescription(($) => $.mostlyAccessible.item2),
            tDescription(($) => $.mostlyAccessible.item3),
            tDescription(($) => $.mostlyAccessible.item4),
          ]}
          level={StopRegistryAccessibilityLevel.MostlyAccessible}
        />

        <DescriptionSection
          titlePrefix={2}
          title={t(($) => $.stopAccessibilityLevelEnum.partiallyInaccessible)}
          items={[
            tDescription(($) => $.partiallyInaccessible.item1),
            tDescription(($) => $.partiallyInaccessible.item2),
            tDescription(($) => $.partiallyInaccessible.item3),
            tDescription(($) => $.partiallyInaccessible.item4),
          ]}
          level={StopRegistryAccessibilityLevel.PartiallyInaccessible}
        />

        <DescriptionSection
          titlePrefix={1}
          title={t(($) => $.stopAccessibilityLevelEnum.inaccessible)}
          items={[
            tDescription(($) => $.inaccessible.item1),
            tDescription(($) => $.inaccessible.item2),
            tDescription(($) => $.inaccessible.item3),
            tDescription(($) => $.inaccessible.item4),
          ]}
          level={StopRegistryAccessibilityLevel.Inaccessible}
        />

        <DescriptionSection
          title={tDescription(($) => $.additionalInfo.title)}
          items={[
            tDescription(($) => $.additionalInfo.item1),
            tDescription(($) => $.additionalInfo.item2),
            tDescription(($) => $.additionalInfo.item3),
            tDescription(($) => $.additionalInfo.item4),
          ]}
        />
      </NewModalBody>
    </Dialog>
  );
};
