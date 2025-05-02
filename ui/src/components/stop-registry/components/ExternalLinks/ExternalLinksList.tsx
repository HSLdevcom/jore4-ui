import { useTranslation } from 'react-i18next';
import { ExternalLinksDetailsFragment } from '../../../../generated/graphql';
import { Column, Row } from '../../../../layoutComponents';

const testIds = {
  linksContainer: 'ExternalLinks::linksContainer',
  openExternalLink: 'ExternalLinks::openExternalLink',
  externalLink: 'ExternalLinks::externalLink',
  name: 'ExternalLinks::name',
  noExternalLinks: 'ExternalLinks::noExternalLinks',
};

type ExternalLinksListProps = {
  readonly externalLinks: ReadonlyArray<ExternalLinksDetailsFragment>;
};

export const ExternalLinksList: React.FC<ExternalLinksListProps> = ({
  externalLinks,
}) => {
  const { t } = useTranslation();

  return (
    <div data-testid={testIds.linksContainer} className="mt-2 border-b-2 pb-2">
      {externalLinks && externalLinks.length > 0 ? (
        externalLinks
          .filter((link) => !!link.name)
          .map((link) => {
            return (
              <Row
                key={`external-link-${link.name}`}
                className="mb-1"
                testId={testIds.externalLink}
              >
                <Column>
                  <a
                    href={link.location ?? ''}
                    title={t('accessibility:stops.openExternalLink', {
                      linkTitle: link.name,
                    })}
                    referrerPolicy="no-referrer"
                    rel="external noopener noreferrer"
                    target="_blank"
                    data-testid={testIds.openExternalLink}
                    className="py-1 font-bold"
                  >
                    <span data-testid={testIds.name}>{link.name}</span>
                    <i className="icon-open-in-new ml-1" aria-hidden="true" />
                  </a>
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
  );
};
