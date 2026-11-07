"""Season x slot prompt data for Gemini image generation (chocolatebox).

Used by gen.py (API) and build_prompts.py (writes prompts.md for manual use in the Gemini app).
"""

STYLE = ('Premium 3D render, Cinema 4D / Octane style, soft studio lighting with gentle rim light, glossy clearcoat '
         'and satin materials, subtle depth of field, rich but tasteful colors, very high detail, polished commercial '
         'look for a Korean mobile shopping app. Not cluttered, no clip-art, no cartoon outlines.')
NO_TEXT = ('No text, no letters, no numbers, no logos, no watermark. Avoid: indigo/violet color drift, emoji, flat clip-art, '
           'generic abstract blobs or bokeh-only filler, muddy over-saturated gradients, props specific to no season.')

# name, palette, background, props (left/right), motif (small repeatable elements), frame (box-card border)
SEASONS = {
    'christmas': dict(
        ko='크리스마스', name='Christmas',
        palette='deep emerald green, cranberry red, warm gold, snow white',
        bg='Deep emerald-green night background with a soft warm spotlight and gentle golden bokeh, light snow particles',
        left='a stylized glossy Christmas tree with a gold star, a red-and-white candy cane, a metallic red ornament',
        right='a red gift box with a gold satin ribbon, a small white gift box with a green ribbon, metallic gold and blue ornaments',
        motif='tiny warm string lights, small metallic ornaments, snowflakes, pine sprigs',
        frame='thin brushed-gold foil border',
        charm='a single glossy metallic red Christmas ornament ball with a gold cap'),
    'newyear': dict(
        ko='신년', name='Korean Lunar New Year',
        palette='midnight navy, lucky red, antique gold, ivory',
        bg='Deep navy background with a golden radial glow and tiny gold sparkles',
        left='a red silk Korean lucky pouch (bokjumeoni) with gold cord and pleated top, antique gold Korean coins (round with a square hole)',
        right='a navy silk bokjumeoni with gold cord, more gold coins, small gold stars',
        motif='gold sparkles, small gold coins, tiny traditional Korean cloud patterns in gold line',
        frame='thin gold-leaf border',
        charm='a single red silk Korean lucky pouch (bokjumeoni) with gold cord'),
    'valentine': dict(
        ko='발렌타인', name="Valentine's Day (chocolate gift brand)",
        palette='deep plum, ruby red, blush pink, milk-chocolate brown, rose gold',
        bg='Deep plum / wine background with a soft pink spotlight',
        left='a large glossy red 3D heart, a small pink heart, a dark chocolate truffle',
        right='a glossy milk-chocolate heart, white and cocoa-dusted chocolate truffles, rose-gold sparkles',
        motif='small glossy hearts, chocolate drizzle, rose-gold sparkles',
        frame='thin rose-gold foil border',
        charm='a single glossy red 3D heart'),
    'spring': dict(
        ko='봄', name='Spring cherry blossom',
        palette='soft sakura pink, fresh spring green, cream white',
        bg='Soft rose-pink gradient background with a bright airy center',
        left='a cherry blossom branch entering from the top-left with clusters of 3D sakura flowers (translucent petals, yellow stamens)',
        right='a cherry blossom branch entering from the top-right with more sakura clusters',
        motif='falling sakura petals, small blossoms',
        frame='thin pearl-pink iridescent border',
        charm='a single pink cherry blossom flower with yellow stamens'),
    'family': dict(
        ko='가정의 달', name="Korean Family Month (May, Parents' Day)",
        palette='warm coral rose, carnation red, cream, soft gold',
        bg='Warm rose / coral background with a soft cream spotlight',
        left='a bouquet of red and pink carnations tied with a yellow satin ribbon, a small gold heart',
        right='a cream envelope sealed with a red heart, small glossy red and pink hearts',
        motif='small carnations, tiny hearts, ribbon curls',
        frame='thin coral-gold foil border',
        charm='a single red carnation flower head with a short green calyx'),
    'summer': dict(
        ko='여름', name='Summer',
        palette='ocean blue, aqua, coral pink, sunny yellow',
        bg='Bright ocean-blue gradient background with sunlight caustics',
        left='a glossy striped beach ball, a pastel blue-pink popsicle',
        right='a pink-and-white striped swim ring, a yellow popsicle, a watermelon slice',
        motif='water droplets, small bubbles, light caustics',
        frame='thin aqua holographic border',
        charm='a single glossy striped beach ball'),
    'autumn': dict(
        ko='가을', name='Autumn',
        palette='burnt orange, maple red, mustard yellow, warm brown',
        bg='Warm burnt-orange to brown background with a golden afternoon glow',
        left='a large red maple leaf, a yellow maple leaf, acorns',
        right='a glossy Korean persimmon with green calyx, an orange maple leaf, a small acorn',
        motif='falling maple leaves, small acorns',
        frame='thin copper foil border',
        charm='a single glossy red maple leaf'),
}

# slot key -> (Korean label, where it is used, aspect ratio, prompt builder)
SLOTS = {
    'screen': ('화면 전체 리디자인', '박스구매 홈 · 포인트샵 · 상품상세 · 뉴스룸 · 구매하기 (스크린샷 첨부)', '원본과 동일', lambda s: (
        f"Redesign the attached mobile app screenshot for the {s['name']} season. "
        'Keep the exact layout: every element stays in the same position and size. Keep all Korean text, numbers and prices '
        'exactly as they are (do not re-type, translate or invent text). Keep product photos and the 3D gift-box images inside '
        'the box cards unchanged. '
        f"Change only the visual style: recolor the whole screen to a cohesive palette of {s['palette']}; header bar in the deepest palette color; "
        f"replace the top banner / key visual with a premium 3D scene ({s['left']} on the left, {s['right']} on the right, title area kept clear); "
        f"add a delicate seasonal garland ({s['motif']}) along the bottom edge of the header; give each box card a {s['frame']} with a soft glow; "
        'very subtle seasonal texture on large background areas. '
        f"{STYLE} Output one phone screenshot with the same aspect ratio as the input.")),
    'banner': ('홈 메인 배너', '박스구매 홈 상단 배너 (타이틀·버튼은 제가 합성)', '2:1 (16:9로 생성 후 크롭)', lambda s: (
        f"{s['name']} key visual. {s['bg']}. Left: {s['left']}. Right: {s['right']}. "
        'Wide banner: props only on the LEFT and RIGHT edges (may be slightly cropped), the CENTER 55% kept clean and calm for a title. '
        f'{STYLE} {NO_TEXT}')),
    'stage': ('구매하기 상단 무대', '구매하기 화면 CHANCE UP PREMIUM 뒤 배경', '2:1 (16:9로 생성 후 크롭)', lambda s: (
        f"{s['name']} game-show stage backdrop. {s['bg']}. Radiating soft light rays from the center, a glowing elliptical spotlight on the floor, "
        f"small props at the far left and far right edges ({s['left']}; {s['right']}), center completely empty for a big title. "
        f'{STYLE} {NO_TEXT}')),
    'mission': ('뉴스룸 미션 배너', '뉴스룸 "초코미션빙고" 배너 배경', '21:9', lambda s: (
        f"{s['name']} wide promo strip. {s['bg']}. One small prop cluster on the right edge ({s['right']}), the left two-thirds kept clean for text. "
        f'{STYLE} {NO_TEXT}')),
    'infobar': ('포인트샵 안내 배경', '포인트샵 상단 안내 박스 배경 (어두운 글씨가 올라감)', '21:9', lambda s: (
        f"Very light, airy {s['name']} background pattern in pale tints of {s['palette']}, with a few tiny {s['motif']} only near the edges, "
        f'low contrast so dark text on top stays perfectly readable. {STYLE} {NO_TEXT}')),
    'cta': ('상세 하단 버튼 바', '상품상세 하단 "CHOCOLATE BOX 뽑기" 버튼 바 배경', '21:9 (가로 띠로 크롭)', lambda s: (
        f"Very wide horizontal strip in the deepest color of {s['palette']} with a subtle glossy gradient, a few small {s['motif']} at the far left and far right ends only, "
        f'center empty for white text. {STYLE} {NO_TEXT}')),
    'garland': ('헤더 장식 띠', '상단 헤더 바로 아래 가랜드 장식', '21:9 (흰 배경, 가로 띠로 크롭)', lambda s: (
        f"A single delicate horizontal garland of {s['motif']} hanging in a gentle wave across the full width, isolated on a pure flat white background. "
        f'{STYLE} {NO_TEXT}')),
    'charm': ('박스 모서리 장식', '박스 카드 모서리에 걸치는 작은 오브제', '1:1 (흰 배경)', lambda s: (
        f"{s['charm']}, centered, isolated on a pure flat white background, soft contact shadow only. {STYLE} {NO_TEXT}")),
    'popup': ('시즌 오픈 팝업', '앱 실행 시 시즌 이벤트 팝업 이미지 (타이틀은 제가 합성)', '4:5', lambda s: (
        f"{s['name']} event popup illustration. {s['bg']}. A hero arrangement of {s['left']} and {s['right']} in the lower 60%, "
        f'the upper 40% kept clean for a title. {STYLE} {NO_TEXT}')),
}

ASPECT = {'screen': '9:16', 'banner': '16:9', 'stage': '16:9', 'mission': '21:9', 'infobar': '21:9', 'cta': '21:9',
          'garland': '21:9', 'charm': '1:1', 'popup': '4:5'}


def prompt(season, slot):
    return SLOTS[slot][3](SEASONS[season])
