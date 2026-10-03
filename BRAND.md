# Ordinary Mystic brand kit

The one source for Canva, Descript, YouTube and anything else off the site. Everything
here is pulled from what the site actually renders (`src/app/globals.css`,
`src/app/layout.tsx`, `public/images/`). When the site changes, change this file.

## Mark

- The illustrated avatar, `public/images/profile-img.png` (1024 px square), is the only
  mark. There is no wordmark; the name is set in the heading font. On dark grounds the
  avatar sits in a circle on the gradient, as `public/images/og-default.png` shows.
- A real headshot joins the kit when the Ordinary Mystic reshoot happens (plain dark
  background, deck in hand, warm light). It is for `/about`, `/links`, TikTok and YouTube
  profiles. It does not replace the avatar on tiles.

## Fonts

| Role | Font | Weights | Notes |
|---|---|---|---|
| Headings, tile text, the name | Montserrat | 900 for H1 and tiles, 700 for subheads | Google font, in Canva's library |
| Body, captions, UI | Geist | 400, 500, 600 | Vercel's open font (OFL), the same body face as Tulsa Tarot Reader. In Canva search "Geist"; if missing, upload the TTF from vercel.com/font |
| Numbers, code | Geist Mono | 400 | Rare |

## Colors

| Name | Hex | Use |
|---|---|---|
| Deep | `#151326` | Hero and tile background, start of the gradient |
| Mid | `#213752` | End of the gradient, Tarot Tip Tuesday tiles |
| Transition | `#1a2742` | The gradient's middle stop |
| Accent | `#2d2a4a` | Buttons, links on dark |
| Accent hover | `#3d3a6b` | |
| Paper | `#f5f4f2` | Page background, light tiles |
| Ink | `#0f172a` | Headings on light (Tailwind slate 900) |
| Body | `#334155` | Text on light (slate 700) |
| Muted | `#64748b` | Captions, kickers (slate 500) |
| Night | `#0d0c14` | Footer, deepest dark |
| Light on dark | `#e2e8f0` | Text on the gradient (slate 200) |

The signature treatment is the diagonal gradient Deep to Transition to Mid with white
Montserrat Black on top. The avatar carries two accents the CSS does not use, a gold ring
and a teal glow; sample them from the image when a highlight is needed and keep them to
hairlines and small marks, never fills.

## Voice

- Practical, grounded, first person. "No woo" is the positioning: no moons, crystals or
  candles as decoration, no "the universe is telling you".
- Not predictive. Readings are thinking tools and questions, never outcomes.
- Plain punctuation. No em dashes anywhere, captions included. Short sentences.
- Recorded readings are their own product, never "the cheaper option".
- The name is Ordinary Mystic; "Ordinary Mystic Readings" on handles and the homepage H1.
  Tyler Martin, the full name, is fine on this brand. (On Tulsa Tarot Reader the surname
  never appears.)

## Tile system for the four TikTok buckets

| Bucket | Treatment |
|---|---|
| Live highlights | Raw video, no tile. Lower-third caption in Geist on a Deep bar |
| Pop culture | Gradient tile, Montserrat Black hook, the avatar small, bottom right |
| Collective readings | Deep flat, one card photograph, the question in Montserrat 700 |
| Education and Tarot Tip Tuesday | Mid flat, kicker "Tarot Tip Tuesday" in Geist 600 caps, the tip in Montserrat Black |

## Tool setup

- **Canva Brand Kit**: the eleven colors above; Montserrat (headings) and Geist (body);
  the avatar as the logo; a 1080 x 1350 template per bucket row above; 1080 x 1920 for
  TikTok covers; 1200 x 630 for link previews.
- **Descript**: captions in Geist 600, white on a Deep bar at 80 percent opacity; title
  cards on the gradient in Montserrat Black; the avatar as the end card with the handle.
- **Tulsa Tarot Reader is a different kit** (Jost headings, cream paper, walnut, oxblood,
  gold). The only shared element is Geist as the body face. Tarot Tip Tuesday posts that
  cross to the TTR Instagram are rebuilt in that kit, with no Ordinary Mystic mark.
