import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ExternalLinksDetailsFragment,
  TerminalExternalLinksDetailsFragment,
} from '../../../../generated/graphql';
import { Row } from '../../../../layoutComponents';
import { EditButton } from '../../../../uiComponents';
import { ExternalLinksForm } from './ExternalLinksForm';
import { ExternalLinksList } from './ExternalLinksList';
import { ExternalLinksFormState } from './schema';

const testIds = {
  title: 'ExternalLinks::title',
  openExternalLink: 'ExternalLinks::openExternalLink',
  externalLink: 'ExternalLinks::externalLink',
  name: 'ExternalLinks::name',
  noExternalLinks: 'ExternalLinks::noExternalLinks',
  editButton: 'ExternalLinks::editButton',
  linksContainer: 'ExternalLinks::linksContainer',
};

type ExternalLinksProps = {
  readonly externalLinks: ReadonlyArray<
    ExternalLinksDetailsFragment | TerminalExternalLinksDetailsFragment
  >;
  readonly onSubmit: (state: ExternalLinksFormState) => void;
};

export const ExternalLinks: FC<ExternalLinksProps> = ({
  externalLinks,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);

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
        <ExternalLinksForm
          externalLinks={externalLinks}
          setIsEditing={setIsEditing}
          onSubmit={onSubmit}
        />
      ) : (
        <ExternalLinksList externalLinks={externalLinks} />
      )}
    </div>
  );
};
