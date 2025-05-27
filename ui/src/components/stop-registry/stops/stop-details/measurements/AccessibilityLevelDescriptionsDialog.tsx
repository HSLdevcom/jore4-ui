import { Dialog } from '@headlessui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StopRegistryAccessibilityLevel } from '../../../../../generated/graphql';
import { Column, Row } from '../../../../../layoutComponents';
import { NewModalBody, NewModalHeader } from '../../../../../uiComponents';
import { AccessibilityLevelIcon } from './AccessibilityLevelIcon';

type AccessibilityLevelDescriptionsDialogProps = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
};

export const AccessibilityLevelDescriptionsDialog: React.FC<
  AccessibilityLevelDescriptionsDialogProps
> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  const translationKeys = {
    fullyAccessible: {
      item1: 'stopDetails.accessibilityLevelDescriptions.fullyAccessible.item1',
      item2: 'stopDetails.accessibilityLevelDescriptions.fullyAccessible.item2',
      item3: 'stopDetails.accessibilityLevelDescriptions.fullyAccessible.item3',
      item4: 'stopDetails.accessibilityLevelDescriptions.fullyAccessible.item4',
    },
    mostlyAccessible: {
      item1:
        'stopDetails.accessibilityLevelDescriptions.mostlyAccessible.item1',
      item2:
        'stopDetails.accessibilityLevelDescriptions.mostlyAccessible.item2',
      item3:
        'stopDetails.accessibilityLevelDescriptions.mostlyAccessible.item3',
      item4:
        'stopDetails.accessibilityLevelDescriptions.mostlyAccessible.item4',
    },
    partiallyInaccessible: {
      item1:
        'stopDetails.accessibilityLevelDescriptions.partiallyInaccessible.item1',
      item2:
        'stopDetails.accessibilityLevelDescriptions.partiallyInaccessible.item2',
      item3:
        'stopDetails.accessibilityLevelDescriptions.partiallyInaccessible.item3',
      item4:
        'stopDetails.accessibilityLevelDescriptions.partiallyInaccessible.item4',
    },
    inaccessible: {
      item1: 'stopDetails.accessibilityLevelDescriptions.inaccessible.item1',
      item2: 'stopDetails.accessibilityLevelDescriptions.inaccessible.item2',
      item3: 'stopDetails.accessibilityLevelDescriptions.inaccessible.item3',
      item4: 'stopDetails.accessibilityLevelDescriptions.inaccessible.item4',
    },
    additionalInfo: {
      item1: 'stopDetails.accessibilityLevelDescriptions.additionalInfo.item1',
      item2: 'stopDetails.accessibilityLevelDescriptions.additionalInfo.item2',
      item3: 'stopDetails.accessibilityLevelDescriptions.additionalInfo.item3',
      item4: 'stopDetails.accessibilityLevelDescriptions.additionalInfo.item4',
    },
  };

  const infoSectionClassName = 'odd:bg-white even:bg-background pl-6 pr-3 py-4';
  const listStyle = 'list-disc pl-4';

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      /* The dialog should be positioned so that it doesn't block the stop details. Placing it on the top right of screen works in most cases. */
      className="absolute right-16 top-28 max-h-[calc(100vh-12rem)] overflow-y-auto border border-grey drop-shadow-lg"
    >
      <NewModalHeader
        heading={t('stopDetails.accessibilityLevelDescriptions.modalTitle')}
        onClose={onClose}
        className="border-0 bg-white pb-0"
      />
      <NewModalBody className="max-w-md !p-0">
        <div className={`${infoSectionClassName}`}>
          <h3 className="text-lg">
            4: {t('stopAccessibilityLevelEnum.fullyAccessible')}
          </h3>
          <Row>
            <Column>
              <ul className={listStyle}>
                <li>{t(translationKeys.fullyAccessible.item1)}</li>
                <li>{t(translationKeys.fullyAccessible.item2)}</li>
                <li>{t(translationKeys.fullyAccessible.item3)}</li>
                <li>{t(translationKeys.fullyAccessible.item4)}</li>
              </ul>
            </Column>
            <Column>
              <AccessibilityLevelIcon
                level={StopRegistryAccessibilityLevel.FullyAccessible}
              />
            </Column>
          </Row>
        </div>
        <div className={`${infoSectionClassName}`}>
          <h3 className="text-lg">
            3: {t('stopAccessibilityLevelEnum.mostlyAccessible')}
          </h3>
          <Row>
            <Column>
              <ul className={listStyle}>
                <li>{t(translationKeys.mostlyAccessible.item1)}</li>
                <li>{t(translationKeys.mostlyAccessible.item2)}</li>
                <li>{t(translationKeys.mostlyAccessible.item3)}</li>
                <li>{t(translationKeys.mostlyAccessible.item4)}</li>
              </ul>
            </Column>
            <Column>
              <AccessibilityLevelIcon
                level={StopRegistryAccessibilityLevel.MostlyAccessible}
              />
            </Column>
          </Row>
        </div>
        <div className={`${infoSectionClassName}`}>
          <h3 className="text-lg">
            2: {t('stopAccessibilityLevelEnum.partiallyInaccessible')}
          </h3>
          <Row>
            <Column>
              <ul className={listStyle}>
                <li>{t(translationKeys.partiallyInaccessible.item1)}</li>
                <li>{t(translationKeys.partiallyInaccessible.item2)}</li>
                <li>{t(translationKeys.partiallyInaccessible.item3)}</li>
                <li>{t(translationKeys.partiallyInaccessible.item4)}</li>
              </ul>
            </Column>
            <Column>
              <AccessibilityLevelIcon
                level={StopRegistryAccessibilityLevel.PartiallyInaccessible}
              />
            </Column>
          </Row>
        </div>
        <div className={`${infoSectionClassName}`}>
          <h3 className="text-lg">
            1: {t('stopAccessibilityLevelEnum.inaccessible')}
          </h3>
          <Row>
            <Column>
              <ul className={listStyle}>
                <li>{t(translationKeys.inaccessible.item1)}</li>
                <li>{t(translationKeys.inaccessible.item2)}</li>
                <li>{t(translationKeys.inaccessible.item3)}</li>
                <li>{t(translationKeys.inaccessible.item4)}</li>
              </ul>
            </Column>
            <Column>
              <AccessibilityLevelIcon
                level={StopRegistryAccessibilityLevel.Inaccessible}
              />
            </Column>
          </Row>
        </div>
        <div className={`${infoSectionClassName}`}>
          <h3 className="text-sm">
            {t(
              'stopDetails.accessibilityLevelDescriptions.additionalInfo.title',
            )}
          </h3>
          <ul className={listStyle}>
            <li>{t(translationKeys.additionalInfo.item1)}</li>
            <li>{t(translationKeys.additionalInfo.item2)}</li>
            <li>{t(translationKeys.additionalInfo.item3)}</li>
            <li>{t(translationKeys.additionalInfo.item4)}</li>
          </ul>
        </div>
      </NewModalBody>
    </Dialog>
  );
};
