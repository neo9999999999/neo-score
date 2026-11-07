"""Full-page Gemini prompts: 7 seasons x 5 screens -> page-prompts.md.

Each prompt describes a whole screen (layout top to bottom, every Korean string, season colors and decoration)
so Gemini can generate the complete page design, optionally with the original screenshot attached.
"""
import json, os
from prompts_data import SEASONS

HERE = os.path.dirname(os.path.abspath(__file__))
TOK = json.load(open(os.path.join(HERE, 'theme_tokens.json')))
ORDER = ['christmas', 'newyear', 'valentine', 'spring', 'family', 'summer', 'autumn']


def common(s, t):
    return (
        f"Follow the chocolatebox DESIGN.md given earlier in this chat (season: {s['ko']}). "
        f"Create a high-fidelity mobile app UI screen, 9:16 portrait (iPhone 390x844 layout), for \"chocolatebox\", a Korean "
        f"gift-box shopping app, in its {s['name']} season theme. If a screenshot is attached, keep its exact layout, element sizes "
        f"and all of its text, and restyle only.\n\n"
        f"THEME: palette {s['palette']}; header {t['header']}, accent {t['accent']}, CTA {t['cta']}. Mood: premium, clean and festive "
        f"but restrained, like a top-tier Korean commerce app's seasonal event skin. Seasonal illustrations are premium 3D renders "
        f"(Cinema 4D / Octane, glossy and satin materials, soft studio light). Decoration ({s['motif']}) stays near edges and never "
        f"overlaps text. White content areas stay clean.\n\n"
        f"TEXT: render every Korean string exactly as written inside quotes, crisp sans-serif (Pretendard / Apple SD Gothic Neo style). "
        f"Do not add, translate or change any text. Keep the 3D gift-box images inside the box cards as they are (only the card border "
        f"is themed). No watermark, no device frame.\n\n"
        f"AVOID (AI-slop tells): indigo/violet drift, emoji or emoji-like icons, decorative cards or boxes that the original "
        f"screen does not have, decorative left accent stripes, a single word recolored or swapped to another font for flair, "
        f"flat clip-art, generic abstract blobs, dark-mode drift (only the buy screen is dark), season color used outside its "
        f"role (accent only for prices/active states, CTA color only for the bottom bar, foil only for box-card borders). "
        f"Keep 60-80% of the screen neutral white/gray, season color concentrated in the header, key visual and CTA.\n\n")


def charm(s):
    return s['charm'].replace('a single ', '')


def boxes(s, t):
    l1, l2 = (t['copy']['banner'].split('|') + [''])[:2]
    return (
        "LAYOUT, top to bottom:\n"
        f"1) Header bar, solid {t['header']}: white coin chip \"P\" + \"5,000\", dark-brown coin \"B\" + \"30 >\", white square \"%\" + \"2개 >\", "
        "right side \"초코덕 >\" (white text).\n"
        f"2) A delicate garland of {s['motif']} hanging just below the header.\n"
        f"3) Main banner card (rounded corners, 16px side margins, about 190px tall): {s['bg']}. Premium 3D props on the left "
        f"({s['left']}) and on the right ({s['right']}). Centered two-line 3D title \"{l1}\" / \"{l2}\" in white, both lines the same color (hierarchy from size and weight only), with a "
        f"white rounded button \"포인트샵 바로가기\" ({t['accent']} text) along the bottom of the card.\n"
        "4) 2x2 grid of box cards (rounded corners) on a light gray page. Each card keeps its 3D gift-box image (pink cube, red gift, "
        "purple gift, yellow gift) and a white pill label: \"보유수량 : 99개\", \"남은시간 01:45:15\", \"보유수량 : 19개\", \"보유수량 : 39개\". "
        f"Every card gets a {s['frame']} with a soft glow; a small 3D {charm(s)} hangs on the top-left corner of the first card and the "
        "top-right corner of the last card. Under each card a colored label and a dark description: \"초콜릿박스\" / \"12,000원 이상의 "
        "상품으로 구성됩니다.\", \"찬스업 14회\" / \"100박스 한정! 더 좋은 상품을 받으세요!\", \"찬스업 프리미엄\" / \"프리미엄 상품으로 구성된 "
        "찬스업 프리미엄\", \"푸드박스 14회\" / \"가볍게 즐기는 간식형 푸드박스\".\n"
        f"5) White bottom tab bar: \"Home\", \"뉴스룸\" (small red dot), \"박스구매\" (active: {t['tab']} rounded pill, {t['accent']} icon "
        "and text), \"내보관함\", \"앱테크\".")


def shop(s, t):
    return (
        "LAYOUT, top to bottom:\n"
        "1) White top bar: back arrow, centered \"포인트샵\", right a black coin \"P\" + \"1,289,050\". A thin seasonal garland "
        f"({s['motif']}) below it.\n"
        f"2) Rounded info box, {t['info']} background with {t['infoInk']} text and faint {s['motif']} only at its edges: "
        "\"보유 포인트로 원하는 상품을 선택하여 교환할 수 있습니다.\" and \"(단, 상품권 및 기프티콘은 합산 1인 1일 최대 4개 교환 가능합니다.)\"\n"
        "3) Category row of round icons with labels: \"전체\" (selected, black circle), \"리퍼상품\", \"기프티콘\", \"가전\", \"식품\", \"뷰티\".\n"
        "4) Rounded search field with a magnifier icon: \"상품검색\".\n"
        f"5) Sort row: \"최신순 ▾\" and \"전체 1,124개\" (\"1,124\" in {t['accent']}).\n"
        "6) 2-column product grid, real product photos on light gray rounded tiles: \"ThanksQR 적립금 100,000원권\" / \"재고수량 : 0\" / "
        f"\"매진\" (blue); \"[르비에]대용량 텀블러 1.18L\" / \"재고수량 : 15\" / \"30,000 P\" ({t['accent']}); the next row (a smartphone, a "
        "box of cookies) partly visible.\n"
        f"7) White bottom tab bar: \"Home\", \"뉴스룸\" (red dot), \"박스구매\" (active, {t['tab']} pill), \"내보관함\", \"앱테크\".")


def detail(s, t):
    return (
        "LAYOUT, top to bottom:\n"
        "1) Full-width product hero photo (black-and-white photo of a Celine bag on an antique carved table) with a back arrow. "
        f"Keep the photo itself untouched; only a small seasonal accent ({s['motif']}) in its bottom-right corner.\n"
        f"2) Title: \"[품절]\" in {t['accent']} followed by \"[셀린느] 미디움 베사체 트리옹프 서플 내추럴 카프스킨 블랙\".\n"
        "3) Price, bold: \"₩ 2,850,000\".\n"
        "4) Two tabs: \"상품상세\" (active, dark underline) and \"상품 리뷰\".\n"
        "5) Light gray rounded notice box: \"- NOTICE -\" (bold) and \"위 상품의 가격은 판촉을 위한 마케팅 목적의 참고값으로, 실제 앱 내 "
        "구매 시 적용되는 가격이 아닙니다. 해당 가격은 손해배상 기준이나 상품 환급과는 관련이 없으니 참고해 주시기 바랍니다.\"\n"
        "6) Product detail image area (navy watch strap photo) partly visible.\n"
        f"7) Fixed bottom CTA bar, solid {t['cta']} with a subtle gloss, a small 3D {charm(s)} to the left of the white bold text "
        "\"CHOCOLATE BOX 뽑기\".")


def news(s, t):
    n = t['news']
    return (
        "LAYOUT, top to bottom:\n"
        f"1) White top bar with centered \"뉴스룸\"; a thin seasonal garland ({s['motif']}) below it.\n"
        "2) Tabs: \"구매내역\" (active, bold, dark underline), \"명예의전당\", \"리뷰(82)\", \"상품목록\" (small red dot).\n"
        f"3) Horizontal carousel of large rounded cards: the center card is solid {n[0]} with a white organic blob holding a blender "
        "product photo, and white text \"마마님 구매완료\", \"[브레빌] 블렌더프레시 엔 퓨이어스\" (bold), \"정가350,000원\"; neighbor cards "
        f"({n[1]}, {n[2]}) peek in from both sides; faint {s['motif']} on the card corners.\n"
        "4) Page dots, the first one a long dark pill.\n"
        "5) Heading \"실시간 구매 내역\".\n"
        f"6) Purchase rows: the first row filled {t['accent']} with white text: product thumbnail, \"마마님 구매완료\", \"[셀린느] 미디움 "
        "베사체 트리옹프 서플 내추럴 카프스킨 블랙\", \"₩5,850,000\", \"방금 전\"; the second row white with a light outline: same product, "
        "\"24,000\", \"방금 전\".\n"
        f"7) Below, partly visible: mission banner card ({t['mission']}) with a 3D {charm(s)} on the right, white bold "
        f"\"{t['copy']['mission']}\" and a white button \"미션 확인\".\n"
        f"8) White bottom tab bar, \"뉴스룸\" active ({t['tab']} pill).")


def buy(s, t):
    g = t['grid']
    return (
        f"LAYOUT, top to bottom (dark, game-like screen with a vertical gradient {g[0]} to {g[1]}):\n"
        "1) Top bar: white close X, centered \"2회차 구매하기\", right a dark-brown coin \"B\" + \"240\" (lavender text).\n"
        f"2) Seasonal garland ({s['motif']}) below the top bar.\n"
        f"3) Hero stage, about 200px tall: radiating light rays and a glowing elliptical floor spotlight ({t['glow']}); premium 3D props at "
        f"the far left and far right ({s['left']}; {s['right']}); centered big italic 3D title \"CHANCE\" / \"PREMIUM\" in glossy gold "
        "with a thick dark outline, a small white rounded badge \"UP\" between the two words; subtitle \"찬스업 프리미엄 박스\" (white, bold).\n"
        f"4) 5-column grid of rounded number tiles \"1\" to \"25\" (more rows continue below): available tiles {t['cell']} with a lighter top "
        f"gradient and white numbers; sold-out tiles 3, 4, 8, 12, 19, 20, 22 dimmed dark; tile 5 filled {t['taken']}.\n"
        f"5) White bottom sheet with rounded top corners: \"박스 선택하기\" (bold) + \"(1등 확률 4%)\" ({t['accent']}, small), right "
        f"\"8개 구매가능\" (gray); a row of slots \"5\", \"28\" (pale yellow), \"29\", \"30\" ({t['mine']}), then dashed empty slots with "
        "\"+\"; a full-width black pill button \"다음\" (white text).")


SCREENS = [('boxes', '박스구매 홈', boxes), ('shop', '포인트샵', shop), ('detail', '상품상세', detail),
           ('news', '뉴스룸', news), ('buy', '구매하기', buy)]

out = ['# Gemini 전체 페이지 프롬프트 — chocolatebox 시즌 테마', '',
       '시즌 7개 x 화면 5개 = 35개. 각 프롬프트 하나가 화면 한 장 전체(배치, 모든 한글 문구, 시즌 색, 장식)를 담고 있습니다.', '',
       '## 사용법', '',
       '0. 먼저 `chocolatebox-theme/DESIGN.md` 전체를 Gemini에 붙여넣고 "Read this DESIGN.md and follow it for every image in this chat."라고 보내세요. (Gemini의 Gem을 만들어 이 파일을 지침으로 넣어두면 매번 붙여넣을 필요가 없습니다.)',
       '1. 시즌마다 Gemini 대화를 하나 열고, **박스구매 홈을 먼저 2~3번 생성해 가장 좋은 1장을 고르세요.** 이 1장이 그 시즌의 기준 이미지(visual target)입니다.',
       '   나머지 화면(포인트샵 → 상세 → 뉴스룸 → 구매하기)은 기준 이미지를 같이 첨부하고 생성하세요. 색·질감·장식이 흔들리지 않습니다.',
       '2. 원본 스크린샷을 같이 첨부하면 배치가 원본과 똑같이 나옵니다. 첨부하지 않아도 프롬프트만으로 화면 전체가 생성됩니다.',
       '3. 두 번째 화면부터 프롬프트 맨 앞에 이 한 줄을 붙이면 톤이 맞춰집니다: `Use exactly the same style, palette and decoration as the previous image.`',
       '4. 한글이 깨진 곳은 "Fix the Korean text to match the prompt exactly, keep everything else." 로 한 번 더 요청하세요.', '']
for sk in ORDER:
    s, t = SEASONS[sk], TOK[sk]
    out += [f'## {s["ko"]}', '']
    for key, ko, fn in SCREENS:
        out += [f'### {s["ko"]} · {ko}', '', '```', common(s, t) + fn(s, t), '```', '']
open(os.path.join(HERE, 'page-prompts.md'), 'w').write('\n'.join(out))
print('page-prompts.md:', len(ORDER) * len(SCREENS), 'prompts')
