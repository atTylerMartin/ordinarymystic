export type AuthorProfile = {
  slug: string;
  name: string;
  bio: string;
  description: string;
  image: string;
  socials: {
    label: string;
    url: string;
  }[];
};

export const AUTHORS: Record<string, AuthorProfile> = {
  "tyler-martin": {
    "slug": "tyler-martin",
    "name": "Tyler, the Ordinary Mystic",
    "bio": "Practical astrology and tarot for skeptics who want signal over noise.",
    "description": "Tyler Martin is a tarot reader and astrologer based in Tulsa, Oklahoma. He practices Hellenistic astrology and writes grounded essays translating symbolic systems into practical frameworks for decision-making, timing, and self-reflection. His work is built for skeptics and serious practitioners who want signal over noise.",
    "image": "/images/profile-img.png",
    "socials": []
  }
};

export const DEFAULT_AUTHOR_SLUG = "tyler-martin";

export function getAuthorBySlug(slug?: string): AuthorProfile {
  if (!slug) return AUTHORS[DEFAULT_AUTHOR_SLUG];
  return AUTHORS[slug] ?? AUTHORS[DEFAULT_AUTHOR_SLUG];
}
