import { TFunction } from 'i18next';
import compact from 'lodash/compact';

export type ExternalLink = {
  name?: string | null;
  location?: string | null;
  orderNum?: number | null;
};

type FormattedExternalLink = {
  name: string;
  location: string;
  orderNum: number;
};

type ExternalLinksListProps = {
  links: FormattedExternalLink[];
  id?: string;
};

export const ExternalLinksList = ({ links, id }: ExternalLinksListProps) => {
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

export function formatExternalLinks<T extends ExternalLink>(
  links: readonly (T | null)[],
): FormattedExternalLink[] {
  return compact(links).map((link) => ({
    name: link?.name ?? '',
    location: link?.location ?? '',
    orderNum: link?.orderNum ?? 0,
  }));
}

export function formatLinks<T extends ExternalLink>(
  links: readonly (T | null)[] | null | undefined,
  t: TFunction,
) {
  const formatted = formatExternalLinks(links ?? []);
  return formatted.length === 0
    ? t(($) => $.changeHistory.externalLinks.noExternalLinks)
    : formatted;
}
