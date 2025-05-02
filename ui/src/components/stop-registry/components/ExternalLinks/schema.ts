import { z } from 'zod';
import { ExternalLinksDetailsFragment } from '../../../../generated/graphql';

export const externalLinksSchema = z.object({
  name: z.string().nullable(),
  location: z.string().nullable(),
  toBeDeleted: z.boolean(),
});

export const ExternalLinksFormSchema = z.object({
  externalLinks: z.array(externalLinksSchema),
});

export type ExternalLinksState = z.infer<typeof externalLinksSchema>;
export type ExternalLinksFormState = z.infer<typeof ExternalLinksFormSchema>;

export const mapExternalLinkDataToFormState = (
  externalLink: ExternalLinksDetailsFragment,
): ExternalLinksState => {
  return {
    name: externalLink.name ?? null,
    location: externalLink.location ?? null,
    toBeDeleted: false,
  };
};
