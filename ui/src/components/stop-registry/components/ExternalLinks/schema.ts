import { z } from 'zod';
import { ExternalLinksDetailsFragment } from '../../../../generated/graphql';

export const externalLinksSchema = z.object({
  name: z.string().min(2).default(''),
  location: z.string().url().nullable(),
  orderNum: z.number().int(),
  toBeDeleted: z.boolean(),
});

export const externalLinksFormSchema = z.object({
  externalLinks: z.array(externalLinksSchema),
});

export type ExternalLinksState = z.infer<typeof externalLinksSchema>;
export type ExternalLinksFormState = z.infer<typeof externalLinksFormSchema>;

export const mapExternalLinkDataToFormState = (
  externalLink: ExternalLinksDetailsFragment,
): ExternalLinksState => {
  return {
    name: externalLink.name ?? '',
    location: externalLink.location ?? null,
    orderNum: externalLink.orderNum ?? 0,
    toBeDeleted: false,
  };
};
