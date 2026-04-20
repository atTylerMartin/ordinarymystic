import { AUTHORS, DEFAULT_AUTHOR_SLUG } from "@/data/authors";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export function PersonJsonLd() {
  const author = AUTHORS[DEFAULT_AUTHOR_SLUG];

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    url: `${SITE_URL}/authors/${author.slug}`,
    image: `${SITE_URL}${author.image}`,
    description: author.description,
    sameAs: author.socials
      .map((social) => social.url)
      .filter((url) => url.startsWith("http")),
    jobTitle: "Tarot & Astrology Reader",
    worksFor: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/blog?tag={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
