import { z } from 'zod';

export type SVGProps = React.ComponentProps<'svg'>;

export const siteLanguageSchema = z.enum(['en']);
export type SiteLanguage = z.infer<typeof siteLanguageSchema>;
