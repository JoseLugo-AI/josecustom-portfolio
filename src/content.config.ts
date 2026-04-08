import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const sites = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/sites' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    tagline: z.string(),
    neighborhood: z.string(),
    address: z.string(),
    phone: z.string(),
    email: z.string(),
    theme: z.object({
      primary: z.string(),
      secondary: z.string(),
      accent: z.string(),
      bg: z.string(),
      text: z.string(),
      navBg: z.string(),
      fontHeading: z.string(),
      fontBody: z.string(),
      fontHeadingUrl: z.string(),
      fontBodyUrl: z.string(),
    }),
    hero: z.object({
      variant: z.string(),
      headline: z.string(),
      subheadline: z.string(),
      image: z.string(),
      ctaText: z.string(),
      ctaHref: z.string().default('#contact'),
    }),
    nav: z.object({
      variant: z.string(),
      links: z.array(z.object({
        label: z.string(),
        href: z.string(),
      })),
    }),
    sections: z.array(z.any()),
  }),
});

export const collections = { sites };
