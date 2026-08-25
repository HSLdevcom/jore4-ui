import { TFunction } from 'i18next';
import compact from 'lodash/compact';
import { FC } from 'react';

type ExternalLink = {
  readonly name?: string | null;
  readonly location?: string | null;
  readonly orderNum?: number | null;
};

type FormattedExternalLink = {
  readonly name: string;
  readonly location: string;
  readonly orderNum: number;
};

type ExternalLinksListProps = {
  readonly links: ReadonlyArray<FormattedExternalLink>;
  readonly id?: string;
};

export const ExternalLinksList: FC<ExternalLinksListProps> = ({
  links,
  id,
}) => {
  return (
    <ol>
      {links.map((link) => (
        <li key={`${id}-${link.orderNum}`}>
          <a href={link.location}>{link.name}</a>
        </li>
      ))}
    </ol>
  );
};

function formatExternalLinks<T extends ExternalLink>(
  links: ReadonlyArray<T>,
): FormattedExternalLink[] {
  return links.map((link) => ({
    name: link.name ?? '',
    location: link.location ?? '',
    orderNum: link.orderNum ?? 0,
  }));
}

export function formatLinks<T extends ExternalLink>(
  t: TFunction,
  links: ReadonlyArray<T | null> | null | undefined,
) {
  const formatted = formatExternalLinks(compact(links));

  return formatted.length === 0
    ? t(($) => $.changeHistory.externalLinks.noExternalLinks)
    : formatted;
}
