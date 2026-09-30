export type AuthorProfile = {
  slug: string;
  name: string;
  description: string;
  image: string;
};

// Socials are deliberately absent: the Person schema in the root layout
// carries `sameAs`.
export const AUTHORS: Record<string, AuthorProfile> = {
  "tyler-martin": {
    slug: "tyler-martin",
    name: "Tyler Martin",
    description:
      "Tyler Martin is a tarot reader and astrologer based in Tulsa, Oklahoma, who practices Hellenistic astrology. He writes grounded essays that translate symbolic systems into practical frameworks for decision-making, timing, and self-reflection.",
    // TODO headshot: swap for a real headshot once one is supplied (WP-3).
    image: "/images/profile-img.png",
  },
};

export const DEFAULT_AUTHOR = AUTHORS["tyler-martin"];
