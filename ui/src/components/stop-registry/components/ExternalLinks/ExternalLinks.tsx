import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ExternalLinksDetailsFragment } from '../../../../generated/graphql';
import { Column, Row } from '../../../../layoutComponents';
import { EditButton, SimpleButton } from '../../../../uiComponents';
import { submitFormByRef } from '../../../../utils';
import { ExternalLinksForm } from './ExternalLinksForm';
import { ExternalLinksFormState } from './schema';

const testIds = {
  title: 'ExternalLinks::title',
  openExternalLink: 'ExternalLinks::openExternalLink',
  externalLink: 'ExternalLinks::externalLink',
  name: 'ExternalLinks::name',
  noExternalLinks: 'ExternalLinks::noExternalLinks',
  editButton: 'ExternalLinks::editButton',
  saveButton: 'ExternalLinks::saveButton',
  cancelButton: 'ExternalLinks::cancelButton',
  linksContainer: 'ExternalLinks::linksContainer',
};

type ExternalLinksProps = {
  readonly externalLinks: ReadonlyArray<ExternalLinksDetailsFragment>;
  readonly onSubmit: (state: ExternalLinksFormState) => void;
};

export const ExternalLinks: React.FC<ExternalLinksProps> = ({
  externalLinks,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    submitFormByRef(formRef);
  };

  const handleSubmit = (state: ExternalLinksFormState) => {
    onSubmit(state);
    setIsEditing(false);
  };

  const defaultValues: ExternalLinksFormState = {
    externalLinks: externalLinks?.length
      ? externalLinks.map((link) => ({
          name: link.name ?? null,
          location: link.location ?? null,
          toBeDeleted: false,
        }))
      : [],
  };

  return (
    <div>
      <Row className="items-center justify-between">
        <h3 data-testid={testIds.title}>
          {t('stopDetails.externalLinks.externalLinks')}
        </h3>
        {!isEditing && (
          <EditButton
            onClick={() => setIsEditing(true)}
            tooltip={t('accessibility:stops.editExternalLink')}
            testId={testIds.editButton}
          />
        )}
      </Row>

      {isEditing ? (
        <>
          <ExternalLinksForm
            ref={formRef}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
          />
          <Row className="mt-4 justify-end space-x-2">
            <SimpleButton
              testId={testIds.cancelButton}
              onClick={handleCancel}
              inverted
            >
              {t('cancel')}
            </SimpleButton>
            <SimpleButton testId={testIds.saveButton} onClick={handleSave}>
              {t('save')}
            </SimpleButton>
          </Row>
        </>
      ) : (
        <div
          data-testid={testIds.linksContainer}
          className="mt-2 border-b-2 pb-2"
        >
          {externalLinks?.length > 0 ? (
            externalLinks.map((link) => {
              const linkName = link.name ?? '';
              const linkLocation = link.location ?? '';

              return (
                <Row
                  key={`external-link-${link.name}`}
                  className="mb-1"
                  testId={testIds.externalLink}
                >
                  <Column>
                    <Link
                      to={linkLocation}
                      data-testid={testIds.openExternalLink}
                      title={t('accessibility:stops.openExternalLink', {
                        linkTitle: linkName,
                      })}
                      className="py-1 font-bold"
                    >
                      <span data-testid={testIds.name}>{linkName}</span>
                      <i className="icon-open-in-new ml-1" aria-hidden="true" />
                    </Link>
                  </Column>
                </Row>
              );
            })
          ) : (
            <Row testId={testIds.noExternalLinks}>
              <Column>
                <span>{t('stopDetails.externalLinks.noExternalLinks')}</span>
              </Column>
            </Row>
          )}
        </div>
      )}
    </div>
  );
};
