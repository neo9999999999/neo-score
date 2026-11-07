"""Writes chocolatebox-theme/DESIGN.md (getdesign.md / Google Stitch style design contract) from the theme tokens."""
import json, os
from prompts_data import SEASONS

HERE = os.path.dirname(os.path.abspath(__file__))
T = json.load(open(os.path.join(HERE, 'theme_tokens.json')))
ORDER = ['christmas', 'newyear', 'valentine', 'spring', 'family', 'summer', 'autumn']
FOIL = {'christmas': '#FFE7A3 → #D4A23A → #FFF6D8 → #B7832A → #F3D27A', 'newyear': '#FFF0B8 → #E0A93B → #FFF8DC → #A9761C → #F5D57E',
        'valentine': '#FFD9CF → #E39A89 → #FFF1EC → #C26E62 → #F7C3B5', 'spring': '#FFE3EE → #F4A9C6 → #FFFFFF → #DDBDF0 → #FFD3E4',
        'family': '#FFE0C2 → #F09A74 → #FFF4EA → #D46E56 → #FFCDAA', 'summer': '#C9F3FF → #5CC9F0 → #FFFFFF → #8EE0C6 → #B5E5FF',
        'autumn': '#FFD9A8 → #C46F2A → #FFE6C2 → #93501E → #E7A257'}
WIN = {'christmas': '12/01–12/26', 'newyear': '12/27–01/19', 'valentine': '01/20–02/20', 'spring': '02/21–04/30',
       'family': '05/01–05/31', 'summer': '06/01–08/31', 'autumn': '09/01–11/30'}
d = T['default']

L = []
A = L.append
A('---')
A('name: chocolatebox season skin')
A('platform: mobile app, 390 x 844 pt (iPhone), portrait')
A('language: Korean UI copy')
A('seasons: [' + ', '.join(ORDER) + ']')
A('colors:')
for k, v in [('header', d['header']), ('accent', d['accent']), ('cta', d['cta']), ('accent-tint', d['tab']), ('canvas', '#F5F5F5'),
             ('surface', '#FFFFFF'), ('ink', '#111111'), ('muted', '#6E6E6E'), ('line', '#E6E6E6'), ('coin-bean', '#4B241A'),
             ('banner-from', d['banner'][0]), ('banner-to', d['banner'][1])]:
    A(f'  {k}: "{v}"')
A('radius: { card: 24, banner: 24, tile: 10, pill: 999, sheet: 24 }')
A('spacing: { gutter: 16, grid-gap-x: 12, grid-gap-y: 20, section: 16 }')
A('type: { family: "Pretendard, Apple SD Gothic Neo, Noto Sans KR, sans-serif" }')
A('---')
A('')
A('# chocolatebox — DESIGN.md')
A('')
A('> Gemini 사용법: 시즌별 Gemini 대화(또는 Gem)를 시작할 때 이 파일 전체를 먼저 붙여넣고 "Read this DESIGN.md and follow it for every image in this chat."라고 보낸 뒤, page-prompts.md의 화면 프롬프트를 순서대로 넣으세요.')
A('')
A('## 1. Overview')
A('')
A('chocolatebox is a Korean gift-box (random box) shopping app. The structure never changes between seasons: '
  'only color, decoration, key visuals, box-card borders and copy change. The interface should feel like a top-tier Korean '
  'commerce app running a seasonal event: premium, clean and festive, never cheap or cluttered. Hierarchy comes from the '
  'header color, one strong key visual per screen and clear type; white content areas stay calm. Seasonal illustrations are '
  'premium 3D renders (Cinema 4D / Octane look: glossy clearcoat and satin materials, soft studio light, gentle rim light, '
  'subtle depth of field), never flat clip-art.')
A('')
A('## 2. Color roles (base)')
A('')
A('| role | value | use |')
A('| --- | --- | --- |')
for r, v, u in [('header', d['header'], 'Top header bar on the box-purchase home. The loudest color on the screen.'),
                ('accent', d['accent'], 'Prices in points, active tab text, highlighted words, sold-out tags. Never a large background.'),
                ('cta', d['cta'], 'Fixed bottom purchase bar ("CHOCOLATE BOX 뽑기").'),
                ('accent-tint', d['tab'], 'Active bottom-tab pill, soft notes.'),
                ('canvas', '#F5F5F5', 'Page background behind box cards.'),
                ('surface', '#FFFFFF', 'Top bars, sheets, product areas, tab bar.'),
                ('ink', '#111111', 'Primary text and the black primary button ("다음").'),
                ('muted', '#6E6E6E', 'Stock counts, timestamps, secondary text.'),
                ('line', '#E6E6E6', 'Hairlines under bars and tabs, outlined rows.'),
                ('coin-bean', '#4B241A', 'The brown "B" bean coin.')]:
    A(f'| `{r}` | `{v}` | {u} |')
A('')
A('Policy: the season replaces `header`, `accent`, `cta`, `accent-tint`, the banner gradient and the buy-screen palette. '
  '`canvas`, `surface`, `ink`, `muted` and `line` never change, so the app stays recognizable in every season.')
A('')
A('## 3. Typography')
A('')
A('| style | size / weight | use |')
A('| --- | --- | --- |')
for r in [('Banner title', '30 / 900, line-height 1.1, letter-spacing -0.03em, white on both lines (no single-word recolor), stacked 1-4px dark shadow (3D extrude) + soft drop shadow', 'Main banner, centered, two lines'),
          ('Buy title', '54 / 900 italic, gold gradient fill, 8px dark outline', '"CHANCE" / "PREMIUM" with white "UP" badge'),
          ('Header items', '16 / 800 white', 'Coins and counters in the header'),
          ('Card label', '16 / 500 in the card color', '"초콜릿박스", "찬스업 14회"...'),
          ('Body', '14.5 / 400, line-height 1.45, ink', 'Card descriptions'),
          ('Price', '20 / 900', '"₩ 2,850,000"'),
          ('CTA', '20 / 800 white', 'Bottom purchase bar'),
          ('Tab', '12 / 400, active 800', 'Bottom tab bar')]:
    A(f'| {r[0]} | {r[1]} | {r[2]} |')
A('')
A('Korean text is always rendered exactly as specified. Never invent, translate or decorate copy.')
A('')
A('## 4. Layout')
A('')
A('- Width 390, side gutter 16. Header 56 tall; bottom tab bar 76 tall; top bars on sub-screens 56 tall with a 1px `line` under them.')
A('- Box-purchase home: header → garland → main banner (rounded 24, ~196 tall) → 2x2 box-card grid (gap 12 x 20) → tab bar.')
A('- The order and size of every block is fixed. Seasons may only change what is inside the banner and the decoration around blocks.')
A('')
A('## 5. Components')
A('')
for name, rule in [
    ('Header bar', 'Solid season `header`. Items: white "P" coin + points, brown "B" coin + count + chevron, white "%" square + coupons + chevron, right "초코덕 >". No decoration on the bar itself.'),
    ('Garland', 'A single delicate strand of the season motif hanging below the header (or the top bar). Thin, small, evenly spaced. Never covers tabs or text.'),
    ('Main banner', 'Rounded 24, radial gradient from the season banner colors, soft center spotlight, film grain at ~15%. Premium 3D props on the LEFT and RIGHT edges only (may be cropped by the frame); the center 55% stays clear for the two-line title; white rounded button "포인트샵 바로가기" with `accent` text along the bottom.'),
    ('Box card', 'The 3D box image inside is the product and is NEVER recolored, redrawn or covered. Seasonal styling only around it: a 3px foil-gradient border (season foil), a 1.5px inner white hairline, a soft shadow tinted with the season color, and a small 3D charm (about 56px) hanging over the top-left corner of the first card and the top-right corner of the last card. White pill label centered on the image.'),
    ('Info box', 'Rounded 12, season info tint background with matching ink text; motif only at its edges.'),
    ('Tabs (sub-screen)', 'White, active tab bold ink with a 3px ink underline. No season color on tabs.'),
    ('Bottom tab bar', 'White. Active item sits in an `accent-tint` pill with `accent` icon and text.'),
    ('CTA bar', 'Full-width fixed bar in season `cta`, subtle top gloss, a small 3D charm left of the white bold label.'),
    ('News card', 'Large rounded card (26) in a season news color with a white organic blob holding the product photo; neighbor cards peek from both sides.'),
    ('Purchase row', 'First row filled with `accent` and white text; other rows white with a 1.5px `line` outline. Rounded 14.'),
    ('Mission card', 'Rounded 20 in season mission color, 3D charm on the right, white bold title, white button with `accent` text.'),
    ('Buy stage', 'Dark vertical gradient (season grid colors), radiating light rays, glowing floor ellipse in season glow color, 3D props at the far left and right, gold "CHANCE UP PREMIUM" title on top.'),
    ('Number tile', 'Rounded 10, 58 tall. Available: season tile color with a lighter top gradient and a 3px dark bottom shadow, white number. Sold-out: dimmed dark, no shadow. Taken: season taken color. Selected: season selected color with white inner ring and glow.'),
    ('Bottom sheet', 'White, rounded 24 top, strong upward shadow. Yellow slot chips for chosen numbers, dashed slots with "+", full-width black pill button "다음".')]:
    A(f'- **{name}** — {rule}')
A('')
A('## 6. Decoration policy')
A('')
A('- One hero 3D scene per screen (home banner or buy stage). Everywhere else decoration is small and sits at edges.')
A('- Decoration never overlaps text, prices, product photos or box images. Text contrast stays at least 4.5:1.')
A('- 3D render style everywhere (props, charms, garlands). No flat clip-art, no outlined cartoon icons, no emoji.')
A('- At most 2 accent hues per season beyond gold/white. Avoid neon, rainbow gradients and busy patterns.')
A('')
A('## 7. Season overlays')
A('')
for sk in ORDER:
    s, t = SEASONS[sk], T[sk]
    l1, l2 = (t['copy']['banner'].split('|') + [''])[:2]
    A(f"### {s['ko']} ({sk}) · {WIN[sk]}")
    A('')
    A(f"Mood: {s['name']}; palette {s['palette']}.")
    A('')
    A('| token | value |')
    A('| --- | --- |')
    for k, v in [('header', t['header']), ('accent', t['accent']), ('cta', t['cta']), ('accent-tint', t['tab']),
                 ('info bg / ink', f"{t['info']} / {t['infoInk']}"), ('banner gradient', f"{t['banner'][0]} → {t['banner'][1]}"),
                 ('buy gradient', f"{t['grid'][0]} → {t['grid'][1]}"), ('number tile', t['cell']),
                 ('selected / taken', f"{t['mine']} / {t['taken']}"), ('stage glow', t['glow']), ('news cards', ', '.join(t['news'])),
                 ('mission', t['mission']), ('box-card foil', FOIL[sk])]:
        A(f'| {k} | `{v}` |')
    A('')
    A(f"- Banner copy: \"{l1}\" / \"{l2}\" (both white) · Mission: \"{t['copy']['mission']}\"")
    A(f"- Hero 3D props — left: {s['left']}; right: {s['right']}")
    A(f"- Motif (garland, small accents): {s['motif']}")
    A(f"- Box-card border: {s['frame']}; corner charm: {s['charm']}")
    A('')
A('## 8. Anti-AI-slop rules')
A('')
A('Adapted from the Refero design skill (styles.refero.design). Gemini output must not look AI-generated.')
A('')
for r in [
    'No indigo/violet drift. The default skin keeps its original brand purple; seasonal skins never slide into violet.',
    'Cards only where the user taps: box cards, product tiles, news cards, purchase rows. No extra decorative boxes.',
    'Light mode is the baseline. Only the buy (number-picking) screen is dark, as in the original app.',
    'No emoji, no emoji-like icons, no decorative left accent stripes.',
    'No single word recolored, italicized or swapped to another font for flair. Hierarchy comes from size, weight and layout.',
    'Token roles are part of the token: accent = prices, active states, sold-out tags; CTA color = bottom purchase bar only; foil = box-card borders only; motif = garland and edge accents only.',
    '60/30/10: 60-80% neutral white/gray surfaces, 10-20% text grays, 5-10% season color. Maximum 2 colors per component.',
    'Media roles stay real: product photos and the 3D gift boxes are the real assets; seasonal props are rendered images, never CSS-like blobs or flat clip-art.',
    'Identity test: with the season removed, the screen must still read as chocolatebox (3D gift boxes, P/B coins, black "다음" button, structure).',
    'Copy test: no added copy. If text was not in the original screen, it does not appear.']:
    A(f'- {r}')
A('')
A('## 9. Visual QA (check every Gemini result)')
A('')
A('- **P0** broken or unreadable: overlapping UI, garbled or wrong Korean text, missing key elements → regenerate.')
A('- **P1** design drift: layout or proportions differ from the original, box images recolored, palette off-season, AI-slop tells above → regenerate with a corrective note.')
A('- **P2** moderate mismatch: decoration too dense, contrast weak, one component off-token → fix with an edit prompt ("keep everything, only change …").')
A('- **P3** polish: tiny spacing, shadow strength → acceptable for review; note it.')
A('- Pass only with no P0/P1/P2. Compare every screen of a season against that season\'s approved home screen (visual target).')
A('')
A('## 10. Do / Don\'t')
A('')
A('- Do keep every screen\'s structure, sizes and copy identical to the original app.')
A('- Do keep one consistent palette and render style across all five screens of a season.')
A('- Don\'t recolor or redraw the 3D box images, product photos or the coins.')
A('- Don\'t put seasonal color on body text, sub-screen tabs or the white surfaces.')
A('- Don\'t add new UI, badges, stickers or text that the original screen does not have.')
A('')
A('## 11. Known gaps')
A('')
A('- Dark mode, empty/error states, loading states, motion timing and push/email templates are not defined here; do not invent them.')
A('- Screens not covered: Home tab, 내보관함, 앱테크. Apply the same overlay rules if needed, but no layout is specified.')
out = os.path.join(HERE, '..', '..', 'DESIGN.md')
open(out, 'w').write('\n'.join(L) + '\n')
print(os.path.normpath(out), len(L), 'lines')
