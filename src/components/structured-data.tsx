import { CONTACT_EMAIL, SITE_URL, SOCIALS } from "@/lib/config";
import { RECORDED, RECORDED_COPY, LIVE, LIVE_COPY, TULSA_TAROT_READER_URL } from "@/lib/offerings";
import { getRoute } from "@/lib/routes";
import type { Guide } from "@/lib/content";
import { OG_DEFAULT } from "@/lib/metadata";
import { FAQ_ITEMS } from "@/lib/content/faq";

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const PERSON_ID = `${SITE_URL}/about#tyler-martin`;
export const TULSA_ID = "https://tulsatarotreader.com/#business";

const socialsList = Object.values(SOCIALS).filter((url) => url.length > 0);

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

function organization() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: "Ordinary Mystic",
    alternateName: "Ordinary Mystic Readings",
    url: SITE_URL,
    // TODO headshot: swap for a designed logo once one exists.
    logo: `${SITE_URL}/images/profile-img.png`,
    email: CONTACT_EMAIL,
    founder: { "@id": PERSON_ID },
    subOrganization: {
      "@type": "ProfessionalService",
      "@id": TULSA_ID,
      name: "Tulsa Tarot Reader",
      url: TULSA_TAROT_READER_URL,
    },
    sameAs: socialsList.length ? socialsList : undefined,
  };
}

function person() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Tyler Martin",
    alternateName: "Ordinary Mystic",
    jobTitle: "Tarot reader",
    url: `${SITE_URL}/about`,
    // TODO headshot: swap for a real headshot once one is supplied (WP-3).
    image: `${SITE_URL}/images/profile-img.png`,
    worksFor: { "@id": ORG_ID },
    sameAs: [...socialsList, `${TULSA_TAROT_READER_URL}/about`],
  };
}

function website() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: "Ordinary Mystic",
    publisher: { "@id": ORG_ID },
    inLanguage: "en-US",
  };
}

/** Organization + Person + WebSite. Rendered once, in the root layout. */
export function StructuredData() {
  return (
    <>
      <JsonLd data={organization()} />
      <JsonLd data={person()} />
      <JsonLd data={website()} />
    </>
  );
}

/** Service + Offer for a reading kind. Rendered on `/`, `/readings`, the
 * matching `/readings/*` page, and the two Tulsa hand-off pages, which all
 * reuse the same `@id` rather than describing their own service. Prices
 * always come from `offerings.ts`, never retyped. */
export function ReadingServiceSchema({
  kind,
}: {
  kind: "recorded" | "live";
}) {
  const copy = kind === "recorded" ? RECORDED_COPY : LIVE_COPY;
  const tiers = kind === "recorded" ? RECORDED : LIVE;
  const pageUrl = `${SITE_URL}/readings/${kind}`;

  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/#service-${kind}`,
    name: copy.title,
    description: copy.lede,
    serviceType: "Tarot reading",
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Country", name: "United States" },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: pageUrl,
    },
    ...(kind === "recorded"
      ? {
          serviceOutput:
            "A personalized video walkthrough plus a written synthesis",
        }
      : {}),
    offers: tiers.map((tier) => ({
      "@type": "Offer",
      name: `${tier.minutes}-minute ${kind} reading`,
      price: String(tier.price),
      priceCurrency: "USD",
      url: tier.url || pageUrl,
      availability: "https://schema.org/InStock",
    })),
  };

  return <JsonLd data={data} />;
}

function breadcrumbTrail(path: string) {
  const trail = [];
  let current: string | undefined = path;
  while (current) {
    const route = getRoute(current);
    trail.unshift(route);
    current = route.parent;
  }
  return trail;
}

/** BreadcrumbList built by walking `parent` links in `routes.ts` back to "/". */
export function BreadcrumbSchema({ path }: { path: string }) {
  const trail = breadcrumbTrail(path);
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: trail.map((route, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: route.label,
          item: `${SITE_URL}${route.path === "/" ? "" : route.path}`,
        })),
      }}
    />
  );
}

/** Article for a guide or lesson (not BlogPosting). Author and publisher are
 * referenced by `@id` so they resolve to the layout's Person and Organization.
 * Guides never carry FAQPage, even when they show a visible FAQ. */
export function ArticleSchema({ guide }: { guide: Guide }) {
  const fm = guide.frontmatter;
  const url = `${SITE_URL}/${fm.wing}/${guide.slug}`;
  const keywords = [
    ...(fm.tags ?? []),
    ...(fm.planets ?? []),
    ...(fm.signs ?? []),
    ...(fm.houses ?? []),
    ...(fm.cards ?? []),
  ];

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": `${url}#article`,
        headline: fm.title,
        description: fm.description,
        datePublished: fm.date,
        dateModified: fm.updated,
        author: { "@id": PERSON_ID },
        publisher: { "@id": ORG_ID },
        mainEntityOfPage: url,
        image: `${SITE_URL}${fm.image ?? OG_DEFAULT.url}`,
        keywords: keywords.length ? keywords.join(", ") : undefined,
        articleSection: fm.category,
      }}
    />
  );
}

/** FAQPage from every question in `src/lib/content/faq.ts`. Rendered on /faq
 * only: it is the site's one FAQPage. Other pages show visible FAQs with no
 * schema. */
export function FaqSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${SITE_URL}/faq#faq`,
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }}
    />
  );
}
