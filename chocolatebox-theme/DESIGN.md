---
name: chocolatebox season skin
platform: mobile app, 390 x 844 pt (iPhone), portrait
language: Korean UI copy
seasons: [christmas, newyear, valentine, spring, family, summer, autumn]
colors:
  header: "#DC3328"
  accent: "#D82B3A"
  cta: "#DC3328"
  accent-tint: "#FDE2E5"
  canvas: "#F5F5F5"
  surface: "#FFFFFF"
  ink: "#111111"
  muted: "#6E6E6E"
  line: "#E6E6E6"
  coin-bean: "#4B241A"
  banner-from: "#150B2E"
  banner-to: "#33196F"
radius: { card: 24, banner: 24, tile: 10, pill: 999, sheet: 24 }
spacing: { gutter: 16, grid-gap-x: 12, grid-gap-y: 20, section: 16 }
type: { family: "Pretendard, Apple SD Gothic Neo, Noto Sans KR, sans-serif" }
---

# chocolatebox — DESIGN.md

> Gemini 사용법: 시즌별 Gemini 대화(또는 Gem)를 시작할 때 이 파일 전체를 먼저 붙여넣고 "Read this DESIGN.md and follow it for every image in this chat."라고 보낸 뒤, page-prompts.md의 화면 프롬프트를 순서대로 넣으세요.

## 1. Overview

chocolatebox is a Korean gift-box (random box) shopping app. The structure never changes between seasons: only color, decoration, key visuals, box-card borders and copy change. The interface should feel like a top-tier Korean commerce app running a seasonal event: premium, clean and festive, never cheap or cluttered. Hierarchy comes from the header color, one strong key visual per screen and clear type; white content areas stay calm. Seasonal illustrations are premium 3D renders (Cinema 4D / Octane look: glossy clearcoat and satin materials, soft studio light, gentle rim light, subtle depth of field), never flat clip-art.

## 2. Color roles (base)

| role | value | use |
| --- | --- | --- |
| `header` | `#DC3328` | Top header bar on the box-purchase home. The loudest color on the screen. |
| `accent` | `#D82B3A` | Prices in points, active tab text, highlighted words, sold-out tags. Never a large background. |
| `cta` | `#DC3328` | Fixed bottom purchase bar ("CHOCOLATE BOX 뽑기"). |
| `accent-tint` | `#FDE2E5` | Active bottom-tab pill, soft notes. |
| `canvas` | `#F5F5F5` | Page background behind box cards. |
| `surface` | `#FFFFFF` | Top bars, sheets, product areas, tab bar. |
| `ink` | `#111111` | Primary text and the black primary button ("다음"). |
| `muted` | `#6E6E6E` | Stock counts, timestamps, secondary text. |
| `line` | `#E6E6E6` | Hairlines under bars and tabs, outlined rows. |
| `coin-bean` | `#4B241A` | The brown "B" bean coin. |

Policy: the season replaces `header`, `accent`, `cta`, `accent-tint`, the banner gradient and the buy-screen palette. `canvas`, `surface`, `ink`, `muted` and `line` never change, so the app stays recognizable in every season.

## 3. Typography

| style | size / weight | use |
| --- | --- | --- |
| Banner title | 30 / 900, line-height 1.1, letter-spacing -0.03em, white + one highlighted line, stacked 1-4px dark shadow (3D extrude) + soft drop shadow | Main banner, centered, two lines |
| Buy title | 54 / 900 italic, gold gradient fill, 8px dark outline | "CHANCE" / "PREMIUM" with white "UP" badge |
| Header items | 16 / 800 white | Coins and counters in the header |
| Card label | 16 / 500 in the card color | "초콜릿박스", "찬스업 14회"... |
| Body | 14.5 / 400, line-height 1.45, ink | Card descriptions |
| Price | 20 / 900 | "₩ 2,850,000" |
| CTA | 20 / 800 white | Bottom purchase bar |
| Tab | 12 / 400, active 800 | Bottom tab bar |

Korean text is always rendered exactly as specified. Never invent, translate or decorate copy.

## 4. Layout

- Width 390, side gutter 16. Header 56 tall; bottom tab bar 76 tall; top bars on sub-screens 56 tall with a 1px `line` under them.
- Box-purchase home: header → garland → main banner (rounded 24, ~196 tall) → 2x2 box-card grid (gap 12 x 20) → tab bar.
- The order and size of every block is fixed. Seasons may only change what is inside the banner and the decoration around blocks.

## 5. Components

- **Header bar** — Solid season `header`. Items: white "P" coin + points, brown "B" coin + count + chevron, white "%" square + coupons + chevron, right "초코덕 >". No decoration on the bar itself.
- **Garland** — A single delicate strand of the season motif hanging below the header (or the top bar). Thin, small, evenly spaced. Never covers tabs or text.
- **Main banner** — Rounded 24, radial gradient from the season banner colors, soft center spotlight, film grain at ~15%. Premium 3D props on the LEFT and RIGHT edges only (may be cropped by the frame); the center 55% stays clear for the two-line title; white rounded button "포인트샵 바로가기" with `accent` text along the bottom.
- **Box card** — The 3D box image inside is the product and is NEVER recolored, redrawn or covered. Seasonal styling only around it: a 3px foil-gradient border (season foil), a 1.5px inner white hairline, a soft shadow tinted with the season color, and a small 3D charm (about 56px) hanging over the top-left corner of the first card and the top-right corner of the last card. White pill label centered on the image.
- **Info box** — Rounded 12, season info tint background with matching ink text; motif only at its edges.
- **Tabs (sub-screen)** — White, active tab bold ink with a 3px ink underline. No season color on tabs.
- **Bottom tab bar** — White. Active item sits in an `accent-tint` pill with `accent` icon and text.
- **CTA bar** — Full-width fixed bar in season `cta`, subtle top gloss, a small 3D charm left of the white bold label.
- **News card** — Large rounded card (26) in a season news color with a white organic blob holding the product photo; neighbor cards peek from both sides.
- **Purchase row** — First row filled with `accent` and white text; other rows white with a 1.5px `line` outline. Rounded 14.
- **Mission card** — Rounded 20 in season mission color, 3D charm on the right, white bold title, white button with `accent` text.
- **Buy stage** — Dark vertical gradient (season grid colors), radiating light rays, glowing floor ellipse in season glow color, 3D props at the far left and right, gold "CHANCE UP PREMIUM" title on top.
- **Number tile** — Rounded 10, 58 tall. Available: season tile color with a lighter top gradient and a 3px dark bottom shadow, white number. Sold-out: dimmed dark, no shadow. Taken: season taken color. Selected: season selected color with white inner ring and glow.
- **Bottom sheet** — White, rounded 24 top, strong upward shadow. Yellow slot chips for chosen numbers, dashed slots with "+", full-width black pill button "다음".

## 6. Decoration policy

- One hero 3D scene per screen (home banner or buy stage). Everywhere else decoration is small and sits at edges.
- Decoration never overlaps text, prices, product photos or box images. Text contrast stays at least 4.5:1.
- 3D render style everywhere (props, charms, garlands). No flat clip-art, no outlined cartoon icons, no emoji.
- At most 2 accent hues per season beyond gold/white. Avoid neon, rainbow gradients and busy patterns.

## 7. Season overlays

### 크리스마스 (christmas) · 12/01–12/26

Mood: Christmas; palette deep emerald green, cranberry red, warm gold, snow white.

| token | value |
| --- | --- |
| header | `#C0262D` |
| accent | `#C0262D` |
| cta | `#1F7A44` |
| accent-tint | `#FDE2E3` |
| info bg / ink | `#E7FEF0 / #1F7A44` |
| banner gradient | `#0F2A1D → #1F5B3A` |
| banner highlight | `#FFD84D` |
| buy gradient | `#0B1F3A → #16407A` |
| number tile | `#1F5FBF` |
| selected / taken | `#FFD84D / #1E7A4F` |
| stage glow | `#9CC8FF` |
| news cards | `#1F7A44, #C0262D, #1F5FBF` |
| mission | `#C0262D` |
| box-card foil | `#FFE7A3 → #D4A23A → #FFF6D8 → #B7832A → #F3D27A` |

- Banner copy: "메리 크리스마스!" / "선물이 가득!!" · Mission: "크리스마스 초코미션빙고"
- Hero 3D props — left: a stylized glossy Christmas tree with a gold star, a red-and-white candy cane, a metallic red ornament; right: a red gift box with a gold satin ribbon, a small white gift box with a green ribbon, metallic gold and blue ornaments
- Motif (garland, small accents): tiny warm string lights, small metallic ornaments, snowflakes, pine sprigs
- Box-card border: thin brushed-gold foil border; corner charm: a single glossy metallic red Christmas ornament ball with a gold cap

### 신년 (newyear) · 12/27–01/19

Mood: Korean Lunar New Year; palette midnight navy, lucky red, antique gold, ivory.

| token | value |
| --- | --- |
| header | `#14233F` |
| accent | `#9A6A12` |
| cta | `#8A5F10` |
| accent-tint | `#FDF4E2` |
| info bg / ink | `#E7EFFE / #14233F` |
| banner gradient | `#0A1228 → #26345E` |
| banner highlight | `#FFD84D` |
| buy gradient | `#0A1228 → #1F2F66` |
| number tile | `#3347A8` |
| selected / taken | `#FFD84D / #0E5C73` |
| stage glow | `#E8C86A` |
| news cards | `#1F2F66, #8A5F10, #B0243A` |
| mission | `#9A6A12` |
| box-card foil | `#FFF0B8 → #E0A93B → #FFF8DC → #A9761C → #F5D57E` |

- Banner copy: "새해 복" / "많이 받으세요!!" · Mission: "신년 초코미션빙고"
- Hero 3D props — left: a red silk Korean lucky pouch (bokjumeoni) with gold cord and pleated top, antique gold Korean coins (round with a square hole); right: a navy silk bokjumeoni with gold cord, more gold coins, small gold stars
- Motif (garland, small accents): gold sparkles, small gold coins, tiny traditional Korean cloud patterns in gold line
- Box-card border: thin gold-leaf border; corner charm: a single red silk Korean lucky pouch (bokjumeoni) with gold cord

### 발렌타인 (valentine) · 01/20–02/20

Mood: Valentine's Day (chocolate gift brand); palette deep plum, ruby red, blush pink, milk-chocolate brown, rose gold.

| token | value |
| --- | --- |
| header | `#C2284E` |
| accent | `#C2284E` |
| cta | `#C2284E` |
| accent-tint | `#FDE2E9` |
| info bg / ink | `#FEE7EC / #C2284E` |
| banner gradient | `#3A0F2A → #8E1F4F` |
| banner highlight | `#FFC2D8` |
| buy gradient | `#33082A → #7A1B55` |
| number tile | `#A02A78` |
| selected / taken | `#FF9EC4 / #5C2A7A` |
| stage glow | `#FF8FB1` |
| news cards | `#B5214D, #7A2E8E, #D6288E` |
| mission | `#B5214D` |
| box-card foil | `#FFD9CF → #E39A89 → #FFF1EC → #C26E62 → #F7C3B5` |

- Banner copy: "달콤한 마음을" / "전해요!!" · Mission: "발렌타인 초코미션빙고"
- Hero 3D props — left: a large glossy red 3D heart, a small pink heart, a dark chocolate truffle; right: a glossy milk-chocolate heart, white and cocoa-dusted chocolate truffles, rose-gold sparkles
- Motif (garland, small accents): small glossy hearts, chocolate drizzle, rose-gold sparkles
- Box-card border: thin rose-gold foil border; corner charm: a single glossy red 3D heart

### 봄 (spring) · 02/21–04/30

Mood: Spring cherry blossom; palette soft sakura pink, fresh spring green, cream white.

| token | value |
| --- | --- |
| header | `#CA456E` |
| accent | `#C23A6A` |
| cta | `#3A845C` |
| accent-tint | `#FDE2EC` |
| info bg / ink | `#E7FEF1 / #387F58` |
| banner gradient | `#C93A6B → #F28DB0` |
| banner highlight | `#FFF3B0` |
| buy gradient | `#10301F → #20603F` |
| number tile | `#2F8F5F` |
| selected / taken | `#FFB6D0 / #7A3A5C` |
| stage glow | `#9BE0B5` |
| news cards | `#3F8F63, #CC4B73, #7A5BC0` |
| mission | `#3A845C` |
| box-card foil | `#FFE3EE → #F4A9C6 → #FFFFFF → #DDBDF0 → #FFD3E4` |

- Banner copy: "봄맞이 쇼핑의" / "즐거움이 가득!!" · Mission: "봄맞이 초코미션빙고"
- Hero 3D props — left: a cherry blossom branch entering from the top-left with clusters of 3D sakura flowers (translucent petals, yellow stamens); right: a cherry blossom branch entering from the top-right with more sakura clusters
- Motif (garland, small accents): falling sakura petals, small blossoms
- Box-card border: thin pearl-pink iridescent border; corner charm: a single pink cherry blossom flower with yellow stamens

### 가정의 달 (family) · 05/01–05/31

Mood: Korean Family Month (May, Parents' Day); palette warm coral rose, carnation red, cream, soft gold.

| token | value |
| --- | --- |
| header | `#C0344F` |
| accent | `#B8334F` |
| cta | `#2E7D52` |
| accent-tint | `#FDE2E8` |
| info bg / ink | `#E7FEF1 / #2E7D52` |
| banner gradient | `#B32B52 → #EE6F86` |
| banner highlight | `#FFE08A` |
| buy gradient | `#2A0F24 → #6A2350` |
| number tile | `#9B3070` |
| selected / taken | `#FFE08A / #2E6B5C` |
| stage glow | `#FF9FB5` |
| news cards | `#B8334F, #2E7D52, #B8691F` |
| mission | `#2E7D52` |
| box-card foil | `#FFE0C2 → #F09A74 → #FFF4EA → #D46E56 → #FFCDAA` |

- Banner copy: "가정의 달," / "감사를 전해요!!" · Mission: "가정의 달 초코미션빙고"
- Hero 3D props — left: a bouquet of red and pink carnations tied with a yellow satin ribbon, a small gold heart; right: a cream envelope sealed with a red heart, small glossy red and pink hearts
- Motif (garland, small accents): small carnations, tiny hearts, ribbon curls
- Box-card border: thin coral-gold foil border; corner charm: a single red carnation flower head with a short green calyx

### 여름 (summer) · 06/01–08/31

Mood: Summer; palette ocean blue, aqua, coral pink, sunny yellow.

| token | value |
| --- | --- |
| header | `#0D7AAE` |
| accent | `#0E6FA5` |
| cta | `#D1441B` |
| accent-tint | `#E2F4FD` |
| info bg / ink | `#E7F6FE / #0D75A7` |
| banner gradient | `#085E9C → #22AEE3` |
| banner highlight | `#FFE45C` |
| buy gradient | `#06284A → #0E5A8C` |
| number tile | `#1A78B8` |
| selected / taken | `#FFE45C / #0E7A6A` |
| stage glow | `#7AD8F0` |
| news cards | `#0E7FB5, #E4572E, #1FA37A` |
| mission | `#D1441B` |
| box-card foil | `#C9F3FF → #5CC9F0 → #FFFFFF → #8EE0C6 → #B5E5FF` |

- Banner copy: "시원한 여름," / "쇼핑의 즐거움!!" · Mission: "서머 초코미션빙고"
- Hero 3D props — left: a glossy striped beach ball, a pastel blue-pink popsicle; right: a pink-and-white striped swim ring, a yellow popsicle, a watermelon slice
- Motif (garland, small accents): water droplets, small bubbles, light caustics
- Box-card border: thin aqua holographic border; corner charm: a single glossy striped beach ball

### 가을 (autumn) · 09/01–11/30

Mood: Autumn; palette burnt orange, maple red, mustard yellow, warm brown.

| token | value |
| --- | --- |
| header | `#B5561F` |
| accent | `#B5481A` |
| cta | `#7A3E16` |
| accent-tint | `#FDEAE2` |
| info bg / ink | `#FEEFE7 / #AE531E` |
| banner gradient | `#4A1F0C → #A8481A` |
| banner highlight | `#FFC247` |
| buy gradient | `#2A1208 → #6B2E14` |
| number tile | `#9A4A22` |
| selected / taken | `#FFC247 / #5C5A1E` |
| stage glow | `#F2A65A` |
| news cards | `#B5561F, #7A5A12, #A6361E` |
| mission | `#A6361E` |
| box-card foil | `#FFD9A8 → #C46F2A → #FFE6C2 → #93501E → #E7A257` |

- Banner copy: "가을 맞이" / "쇼핑의 즐거움!!" · Mission: "가을 초코미션빙고"
- Hero 3D props — left: a large red maple leaf, a yellow maple leaf, acorns; right: a glossy Korean persimmon with green calyx, an orange maple leaf, a small acorn
- Motif (garland, small accents): falling maple leaves, small acorns
- Box-card border: thin copper foil border; corner charm: a single glossy red maple leaf

## 8. Do / Don't

- Do keep every screen's structure, sizes and copy identical to the original app.
- Do keep one consistent palette and render style across all five screens of a season.
- Don't recolor or redraw the 3D box images, product photos or the coins.
- Don't put seasonal color on body text, sub-screen tabs or the white surfaces.
- Don't add new UI, badges, stickers or text that the original screen does not have.

## 9. Known gaps

- Dark mode, empty/error states, loading states, motion timing and push/email templates are not defined here; do not invent them.
- Screens not covered: Home tab, 내보관함, 앱테크. Apply the same overlay rules if needed, but no layout is specified.
