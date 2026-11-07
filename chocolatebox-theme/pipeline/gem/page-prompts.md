# Gemini 전체 페이지 프롬프트 — chocolatebox 시즌 테마

시즌 7개 x 화면 5개 = 35개. 각 프롬프트 하나가 화면 한 장 전체(배치, 모든 한글 문구, 시즌 색, 장식)를 담고 있습니다.

## 사용법

0. 먼저 `chocolatebox-theme/DESIGN.md` 전체를 Gemini에 붙여넣고 "Read this DESIGN.md and follow it for every image in this chat."라고 보내세요. (Gemini의 Gem을 만들어 이 파일을 지침으로 넣어두면 매번 붙여넣을 필요가 없습니다.)
1. 시즌마다 Gemini 대화를 하나 열고, **박스구매 홈을 먼저 2~3번 생성해 가장 좋은 1장을 고르세요.** 이 1장이 그 시즌의 기준 이미지(visual target)입니다.
   나머지 화면(포인트샵 → 상세 → 뉴스룸 → 구매하기)은 기준 이미지를 같이 첨부하고 생성하세요. 색·질감·장식이 흔들리지 않습니다.
2. 원본 스크린샷을 같이 첨부하면 배치가 원본과 똑같이 나옵니다. 첨부하지 않아도 프롬프트만으로 화면 전체가 생성됩니다.
3. 두 번째 화면부터 프롬프트 맨 앞에 이 한 줄을 붙이면 톤이 맞춰집니다: `Use exactly the same style, palette and decoration as the previous image.`
4. 한글이 깨진 곳은 "Fix the Korean text to match the prompt exactly, keep everything else." 로 한 번 더 요청하세요.

## 크리스마스

### 크리스마스 · 박스구매 홈

```
Follow the chocolatebox DESIGN.md given earlier in this chat (season: 크리스마스). Create a high-fidelity mobile app UI screen, 9:16 portrait (iPhone 390x844 layout), for "chocolatebox", a Korean gift-box shopping app, in its Christmas season theme. If a screenshot is attached, keep its exact layout, element sizes and all of its text, and restyle only.

THEME: palette deep emerald green, cranberry red, warm gold, snow white; header #C0262D, accent #C0262D, CTA #1F7A44. Mood: premium, clean and festive but restrained, like a top-tier Korean commerce app's seasonal event skin. Seasonal illustrations are premium 3D renders (Cinema 4D / Octane, glossy and satin materials, soft studio light). Decoration (tiny warm string lights, small metallic ornaments, snowflakes, pine sprigs) stays near edges and never overlaps text. White content areas stay clean.

TEXT: render every Korean string exactly as written inside quotes, crisp sans-serif (Pretendard / Apple SD Gothic Neo style). Do not add, translate or change any text. Keep the 3D gift-box images inside the box cards as they are (only the card border is themed). No watermark, no device frame.

AVOID (AI-slop tells): indigo/violet drift, emoji or emoji-like icons, decorative cards or boxes that the original screen does not have, decorative left accent stripes, a single word recolored or swapped to another font for flair, flat clip-art, generic abstract blobs, dark-mode drift (only the buy screen is dark), season color used outside its role (accent only for prices/active states, CTA color only for the bottom bar, foil only for box-card borders). Keep 60-80% of the screen neutral white/gray, season color concentrated in the header, key visual and CTA.

LAYOUT, top to bottom:
1) Header bar, solid #C0262D: white coin chip "P" + "5,000", dark-brown coin "B" + "30 >", white square "%" + "2개 >", right side "초코덕 >" (white text).
2) A delicate garland of tiny warm string lights, small metallic ornaments, snowflakes, pine sprigs hanging just below the header.
3) Main banner card (rounded corners, 16px side margins, about 190px tall): Deep emerald-green night background with a soft warm spotlight and gentle golden bokeh, light snow particles. Premium 3D props on the left (a stylized glossy Christmas tree with a gold star, a red-and-white candy cane, a metallic red ornament) and on the right (a red gift box with a gold satin ribbon, a small white gift box with a green ribbon, metallic gold and blue ornaments). Centered two-line 3D title "메리 크리스마스!" / "선물이 가득!!" in white, both lines the same color (hierarchy from size and weight only), with a white rounded button "포인트샵 바로가기" (#C0262D text) along the bottom of the card.
4) 2x2 grid of box cards (rounded corners) on a light gray page. Each card keeps its 3D gift-box image (pink cube, red gift, purple gift, yellow gift) and a white pill label: "보유수량 : 99개", "남은시간 01:45:15", "보유수량 : 19개", "보유수량 : 39개". Every card gets a thin brushed-gold foil border with a soft glow; a small 3D glossy metallic red Christmas ornament ball with a gold cap hangs on the top-left corner of the first card and the top-right corner of the last card. Under each card a colored label and a dark description: "초콜릿박스" / "12,000원 이상의 상품으로 구성됩니다.", "찬스업 14회" / "100박스 한정! 더 좋은 상품을 받으세요!", "찬스업 프리미엄" / "프리미엄 상품으로 구성된 찬스업 프리미엄", "푸드박스 14회" / "가볍게 즐기는 간식형 푸드박스".
5) White bottom tab bar: "Home", "뉴스룸" (small red dot), "박스구매" (active: #FDE2E3 rounded pill, #C0262D icon and text), "내보관함", "앱테크".
```

### 크리스마스 · 포인트샵

```
Follow the chocolatebox DESIGN.md given earlier in this chat (season: 크리스마스). Create a high-fidelity mobile app UI screen, 9:16 portrait (iPhone 390x844 layout), for "chocolatebox", a Korean gift-box shopping app, in its Christmas season theme. If a screenshot is attached, keep its exact layout, element sizes and all of its text, and restyle only.

THEME: palette deep emerald green, cranberry red, warm gold, snow white; header #C0262D, accent #C0262D, CTA #1F7A44. Mood: premium, clean and festive but restrained, like a top-tier Korean commerce app's seasonal event skin. Seasonal illustrations are premium 3D renders (Cinema 4D / Octane, glossy and satin materials, soft studio light). Decoration (tiny warm string lights, small metallic ornaments, snowflakes, pine sprigs) stays near edges and never overlaps text. White content areas stay clean.

TEXT: render every Korean string exactly as written inside quotes, crisp sans-serif (Pretendard / Apple SD Gothic Neo style). Do not add, translate or change any text. Keep the 3D gift-box images inside the box cards as they are (only the card border is themed). No watermark, no device frame.

AVOID (AI-slop tells): indigo/violet drift, emoji or emoji-like icons, decorative cards or boxes that the original screen does not have, decorative left accent stripes, a single word recolored or swapped to another font for flair, flat clip-art, generic abstract blobs, dark-mode drift (only the buy screen is dark), season color used outside its role (accent only for prices/active states, CTA color only for the bottom bar, foil only for box-card borders). Keep 60-80% of the screen neutral white/gray, season color concentrated in the header, key visual and CTA.

LAYOUT, top to bottom:
1) White top bar: back arrow, centered "포인트샵", right a black coin "P" + "1,289,050". A thin seasonal garland (tiny warm string lights, small metallic ornaments, snowflakes, pine sprigs) below it.
2) Rounded info box, #E7FEF0 background with #1F7A44 text and faint tiny warm string lights, small metallic ornaments, snowflakes, pine sprigs only at its edges: "보유 포인트로 원하는 상품을 선택하여 교환할 수 있습니다." and "(단, 상품권 및 기프티콘은 합산 1인 1일 최대 4개 교환 가능합니다.)"
3) Category row of round icons with labels: "전체" (selected, black circle), "리퍼상품", "기프티콘", "가전", "식품", "뷰티".
4) Rounded search field with a magnifier icon: "상품검색".
5) Sort row: "최신순 ▾" and "전체 1,124개" ("1,124" in #C0262D).
6) 2-column product grid, real product photos on light gray rounded tiles: "ThanksQR 적립금 100,000원권" / "재고수량 : 0" / "매진" (blue); "[르비에]대용량 텀블러 1.18L" / "재고수량 : 15" / "30,000 P" (#C0262D); the next row (a smartphone, a box of cookies) partly visible.
7) White bottom tab bar: "Home", "뉴스룸" (red dot), "박스구매" (active, #FDE2E3 pill), "내보관함", "앱테크".
```

### 크리스마스 · 상품상세

```
Follow the chocolatebox DESIGN.md given earlier in this chat (season: 크리스마스). Create a high-fidelity mobile app UI screen, 9:16 portrait (iPhone 390x844 layout), for "chocolatebox", a Korean gift-box shopping app, in its Christmas season theme. If a screenshot is attached, keep its exact layout, element sizes and all of its text, and restyle only.

THEME: palette deep emerald green, cranberry red, warm gold, snow white; header #C0262D, accent #C0262D, CTA #1F7A44. Mood: premium, clean and festive but restrained, like a top-tier Korean commerce app's seasonal event skin. Seasonal illustrations are premium 3D renders (Cinema 4D / Octane, glossy and satin materials, soft studio light). Decoration (tiny warm string lights, small metallic ornaments, snowflakes, pine sprigs) stays near edges and never overlaps text. White content areas stay clean.

TEXT: render every Korean string exactly as written inside quotes, crisp sans-serif (Pretendard / Apple SD Gothic Neo style). Do not add, translate or change any text. Keep the 3D gift-box images inside the box cards as they are (only the card border is themed). No watermark, no device frame.

AVOID (AI-slop tells): indigo/violet drift, emoji or emoji-like icons, decorative cards or boxes that the original screen does not have, decorative left accent stripes, a single word recolored or swapped to another font for flair, flat clip-art, generic abstract blobs, dark-mode drift (only the buy screen is dark), season color used outside its role (accent only for prices/active states, CTA color only for the bottom bar, foil only for box-card borders). Keep 60-80% of the screen neutral white/gray, season color concentrated in the header, key visual and CTA.

LAYOUT, top to bottom:
1) Full-width product hero photo (black-and-white photo of a Celine bag on an antique carved table) with a back arrow. Keep the photo itself untouched; only a small seasonal accent (tiny warm string lights, small metallic ornaments, snowflakes, pine sprigs) in its bottom-right corner.
2) Title: "[품절]" in #C0262D followed by "[셀린느] 미디움 베사체 트리옹프 서플 내추럴 카프스킨 블랙".
3) Price, bold: "₩ 2,850,000".
4) Two tabs: "상품상세" (active, dark underline) and "상품 리뷰".
5) Light gray rounded notice box: "- NOTICE -" (bold) and "위 상품의 가격은 판촉을 위한 마케팅 목적의 참고값으로, 실제 앱 내 구매 시 적용되는 가격이 아닙니다. 해당 가격은 손해배상 기준이나 상품 환급과는 관련이 없으니 참고해 주시기 바랍니다."
6) Product detail image area (navy watch strap photo) partly visible.
7) Fixed bottom CTA bar, solid #1F7A44 with a subtle gloss, a small 3D glossy metallic red Christmas ornament ball with a gold cap to the left of the white bold text "CHOCOLATE BOX 뽑기".
```

### 크리스마스 · 뉴스룸

```
Follow the chocolatebox DESIGN.md given earlier in this chat (season: 크리스마스). Create a high-fidelity mobile app UI screen, 9:16 portrait (iPhone 390x844 layout), for "chocolatebox", a Korean gift-box shopping app, in its Christmas season theme. If a screenshot is attached, keep its exact layout, element sizes and all of its text, and restyle only.

THEME: palette deep emerald green, cranberry red, warm gold, snow white; header #C0262D, accent #C0262D, CTA #1F7A44. Mood: premium, clean and festive but restrained, like a top-tier Korean commerce app's seasonal event skin. Seasonal illustrations are premium 3D renders (Cinema 4D / Octane, glossy and satin materials, soft studio light). Decoration (tiny warm string lights, small metallic ornaments, snowflakes, pine sprigs) stays near edges and never overlaps text. White content areas stay clean.

TEXT: render every Korean string exactly as written inside quotes, crisp sans-serif (Pretendard / Apple SD Gothic Neo style). Do not add, translate or change any text. Keep the 3D gift-box images inside the box cards as they are (only the card border is themed). No watermark, no device frame.

AVOID (AI-slop tells): indigo/violet drift, emoji or emoji-like icons, decorative cards or boxes that the original screen does not have, decorative left accent stripes, a single word recolored or swapped to another font for flair, flat clip-art, generic abstract blobs, dark-mode drift (only the buy screen is dark), season color used outside its role (accent only for prices/active states, CTA color only for the bottom bar, foil only for box-card borders). Keep 60-80% of the screen neutral white/gray, season color concentrated in the header, key visual and CTA.

LAYOUT, top to bottom:
1) White top bar with centered "뉴스룸"; a thin seasonal garland (tiny warm string lights, small metallic ornaments, snowflakes, pine sprigs) below it.
2) Tabs: "구매내역" (active, bold, dark underline), "명예의전당", "리뷰(82)", "상품목록" (small red dot).
3) Horizontal carousel of large rounded cards: the center card is solid #1F7A44 with a white organic blob holding a blender product photo, and white text "마마님 구매완료", "[브레빌] 블렌더프레시 엔 퓨이어스" (bold), "정가350,000원"; neighbor cards (#C0262D, #1F5FBF) peek in from both sides; faint tiny warm string lights, small metallic ornaments, snowflakes, pine sprigs on the card corners.
4) Page dots, the first one a long dark pill.
5) Heading "실시간 구매 내역".
6) Purchase rows: the first row filled #C0262D with white text: product thumbnail, "마마님 구매완료", "[셀린느] 미디움 베사체 트리옹프 서플 내추럴 카프스킨 블랙", "₩5,850,000", "방금 전"; the second row white with a light outline: same product, "24,000", "방금 전".
7) Below, partly visible: mission banner card (#C0262D) with a 3D glossy metallic red Christmas ornament ball with a gold cap on the right, white bold "크리스마스 초코미션빙고" and a white button "미션 확인".
8) White bottom tab bar, "뉴스룸" active (#FDE2E3 pill).
```

### 크리스마스 · 구매하기

```
Follow the chocolatebox DESIGN.md given earlier in this chat (season: 크리스마스). Create a high-fidelity mobile app UI screen, 9:16 portrait (iPhone 390x844 layout), for "chocolatebox", a Korean gift-box shopping app, in its Christmas season theme. If a screenshot is attached, keep its exact layout, element sizes and all of its text, and restyle only.

THEME: palette deep emerald green, cranberry red, warm gold, snow white; header #C0262D, accent #C0262D, CTA #1F7A44. Mood: premium, clean and festive but restrained, like a top-tier Korean commerce app's seasonal event skin. Seasonal illustrations are premium 3D renders (Cinema 4D / Octane, glossy and satin materials, soft studio light). Decoration (tiny warm string lights, small metallic ornaments, snowflakes, pine sprigs) stays near edges and never overlaps text. White content areas stay clean.

TEXT: render every Korean string exactly as written inside quotes, crisp sans-serif (Pretendard / Apple SD Gothic Neo style). Do not add, translate or change any text. Keep the 3D gift-box images inside the box cards as they are (only the card border is themed). No watermark, no device frame.

AVOID (AI-slop tells): indigo/violet drift, emoji or emoji-like icons, decorative cards or boxes that the original screen does not have, decorative left accent stripes, a single word recolored or swapped to another font for flair, flat clip-art, generic abstract blobs, dark-mode drift (only the buy screen is dark), season color used outside its role (accent only for prices/active states, CTA color only for the bottom bar, foil only for box-card borders). Keep 60-80% of the screen neutral white/gray, season color concentrated in the header, key visual and CTA.

LAYOUT, top to bottom (dark, game-like screen with a vertical gradient #0B1F3A to #16407A):
1) Top bar: white close X, centered "2회차 구매하기", right a dark-brown coin "B" + "240" (lavender text).
2) Seasonal garland (tiny warm string lights, small metallic ornaments, snowflakes, pine sprigs) below the top bar.
3) Hero stage, about 200px tall: radiating light rays and a glowing elliptical floor spotlight (#9CC8FF); premium 3D props at the far left and far right (a stylized glossy Christmas tree with a gold star, a red-and-white candy cane, a metallic red ornament; a red gift box with a gold satin ribbon, a small white gift box with a green ribbon, metallic gold and blue ornaments); centered big italic 3D title "CHANCE" / "PREMIUM" in glossy gold with a thick dark outline, a small white rounded badge "UP" between the two words; subtitle "찬스업 프리미엄 박스" (white, bold).
4) 5-column grid of rounded number tiles "1" to "25" (more rows continue below): available tiles #1F5FBF with a lighter top gradient and white numbers; sold-out tiles 3, 4, 8, 12, 19, 20, 22 dimmed dark; tile 5 filled #1E7A4F.
5) White bottom sheet with rounded top corners: "박스 선택하기" (bold) + "(1등 확률 4%)" (#C0262D, small), right "8개 구매가능" (gray); a row of slots "5", "28" (pale yellow), "29", "30" (#FFD84D), then dashed empty slots with "+"; a full-width black pill button "다음" (white text).
```

## 신년

### 신년 · 박스구매 홈

```
Follow the chocolatebox DESIGN.md given earlier in this chat (season: 신년). Create a high-fidelity mobile app UI screen, 9:16 portrait (iPhone 390x844 layout), for "chocolatebox", a Korean gift-box shopping app, in its Korean Lunar New Year season theme. If a screenshot is attached, keep its exact layout, element sizes and all of its text, and restyle only.

THEME: palette midnight navy, lucky red, antique gold, ivory; header #14233F, accent #9A6A12, CTA #8A5F10. Mood: premium, clean and festive but restrained, like a top-tier Korean commerce app's seasonal event skin. Seasonal illustrations are premium 3D renders (Cinema 4D / Octane, glossy and satin materials, soft studio light). Decoration (gold sparkles, small gold coins, tiny traditional Korean cloud patterns in gold line) stays near edges and never overlaps text. White content areas stay clean.

TEXT: render every Korean string exactly as written inside quotes, crisp sans-serif (Pretendard / Apple SD Gothic Neo style). Do not add, translate or change any text. Keep the 3D gift-box images inside the box cards as they are (only the card border is themed). No watermark, no device frame.

AVOID (AI-slop tells): indigo/violet drift, emoji or emoji-like icons, decorative cards or boxes that the original screen does not have, decorative left accent stripes, a single word recolored or swapped to another font for flair, flat clip-art, generic abstract blobs, dark-mode drift (only the buy screen is dark), season color used outside its role (accent only for prices/active states, CTA color only for the bottom bar, foil only for box-card borders). Keep 60-80% of the screen neutral white/gray, season color concentrated in the header, key visual and CTA.

LAYOUT, top to bottom:
1) Header bar, solid #14233F: white coin chip "P" + "5,000", dark-brown coin "B" + "30 >", white square "%" + "2개 >", right side "초코덕 >" (white text).
2) A delicate garland of gold sparkles, small gold coins, tiny traditional Korean cloud patterns in gold line hanging just below the header.
3) Main banner card (rounded corners, 16px side margins, about 190px tall): Deep navy background with a golden radial glow and tiny gold sparkles. Premium 3D props on the left (a red silk Korean lucky pouch (bokjumeoni) with gold cord and pleated top, antique gold Korean coins (round with a square hole)) and on the right (a navy silk bokjumeoni with gold cord, more gold coins, small gold stars). Centered two-line 3D title "새해 복" / "많이 받으세요!!" in white, both lines the same color (hierarchy from size and weight only), with a white rounded button "포인트샵 바로가기" (#9A6A12 text) along the bottom of the card.
4) 2x2 grid of box cards (rounded corners) on a light gray page. Each card keeps its 3D gift-box image (pink cube, red gift, purple gift, yellow gift) and a white pill label: "보유수량 : 99개", "남은시간 01:45:15", "보유수량 : 19개", "보유수량 : 39개". Every card gets a thin gold-leaf border with a soft glow; a small 3D red silk Korean lucky pouch (bokjumeoni) with gold cord hangs on the top-left corner of the first card and the top-right corner of the last card. Under each card a colored label and a dark description: "초콜릿박스" / "12,000원 이상의 상품으로 구성됩니다.", "찬스업 14회" / "100박스 한정! 더 좋은 상품을 받으세요!", "찬스업 프리미엄" / "프리미엄 상품으로 구성된 찬스업 프리미엄", "푸드박스 14회" / "가볍게 즐기는 간식형 푸드박스".
5) White bottom tab bar: "Home", "뉴스룸" (small red dot), "박스구매" (active: #FDF4E2 rounded pill, #9A6A12 icon and text), "내보관함", "앱테크".
```

### 신년 · 포인트샵

```
Follow the chocolatebox DESIGN.md given earlier in this chat (season: 신년). Create a high-fidelity mobile app UI screen, 9:16 portrait (iPhone 390x844 layout), for "chocolatebox", a Korean gift-box shopping app, in its Korean Lunar New Year season theme. If a screenshot is attached, keep its exact layout, element sizes and all of its text, and restyle only.

THEME: palette midnight navy, lucky red, antique gold, ivory; header #14233F, accent #9A6A12, CTA #8A5F10. Mood: premium, clean and festive but restrained, like a top-tier Korean commerce app's seasonal event skin. Seasonal illustrations are premium 3D renders (Cinema 4D / Octane, glossy and satin materials, soft studio light). Decoration (gold sparkles, small gold coins, tiny traditional Korean cloud patterns in gold line) stays near edges and never overlaps text. White content areas stay clean.

TEXT: render every Korean string exactly as written inside quotes, crisp sans-serif (Pretendard / Apple SD Gothic Neo style). Do not add, translate or change any text. Keep the 3D gift-box images inside the box cards as they are (only the card border is themed). No watermark, no device frame.

AVOID (AI-slop tells): indigo/violet drift, emoji or emoji-like icons, decorative cards or boxes that the original screen does not have, decorative left accent stripes, a single word recolored or swapped to another font for flair, flat clip-art, generic abstract blobs, dark-mode drift (only the buy screen is dark), season color used outside its role (accent only for prices/active states, CTA color only for the bottom bar, foil only for box-card borders). Keep 60-80% of the screen neutral white/gray, season color concentrated in the header, key visual and CTA.

LAYOUT, top to bottom:
1) White top bar: back arrow, centered "포인트샵", right a black coin "P" + "1,289,050". A thin seasonal garland (gold sparkles, small gold coins, tiny traditional Korean cloud patterns in gold line) below it.
2) Rounded info box, #E7EFFE background with #14233F text and faint gold sparkles, small gold coins, tiny traditional Korean cloud patterns in gold line only at its edges: "보유 포인트로 원하는 상품을 선택하여 교환할 수 있습니다." and "(단, 상품권 및 기프티콘은 합산 1인 1일 최대 4개 교환 가능합니다.)"
3) Category row of round icons with labels: "전체" (selected, black circle), "리퍼상품", "기프티콘", "가전", "식품", "뷰티".
4) Rounded search field with a magnifier icon: "상품검색".
5) Sort row: "최신순 ▾" and "전체 1,124개" ("1,124" in #9A6A12).
6) 2-column product grid, real product photos on light gray rounded tiles: "ThanksQR 적립금 100,000원권" / "재고수량 : 0" / "매진" (blue); "[르비에]대용량 텀블러 1.18L" / "재고수량 : 15" / "30,000 P" (#9A6A12); the next row (a smartphone, a box of cookies) partly visible.
7) White bottom tab bar: "Home", "뉴스룸" (red dot), "박스구매" (active, #FDF4E2 pill), "내보관함", "앱테크".
```

### 신년 · 상품상세

```
Follow the chocolatebox DESIGN.md given earlier in this chat (season: 신년). Create a high-fidelity mobile app UI screen, 9:16 portrait (iPhone 390x844 layout), for "chocolatebox", a Korean gift-box shopping app, in its Korean Lunar New Year season theme. If a screenshot is attached, keep its exact layout, element sizes and all of its text, and restyle only.

THEME: palette midnight navy, lucky red, antique gold, ivory; header #14233F, accent #9A6A12, CTA #8A5F10. Mood: premium, clean and festive but restrained, like a top-tier Korean commerce app's seasonal event skin. Seasonal illustrations are premium 3D renders (Cinema 4D / Octane, glossy and satin materials, soft studio light). Decoration (gold sparkles, small gold coins, tiny traditional Korean cloud patterns in gold line) stays near edges and never overlaps text. White content areas stay clean.

TEXT: render every Korean string exactly as written inside quotes, crisp sans-serif (Pretendard / Apple SD Gothic Neo style). Do not add, translate or change any text. Keep the 3D gift-box images inside the box cards as they are (only the card border is themed). No watermark, no device frame.

AVOID (AI-slop tells): indigo/violet drift, emoji or emoji-like icons, decorative cards or boxes that the original screen does not have, decorative left accent stripes, a single word recolored or swapped to another font for flair, flat clip-art, generic abstract blobs, dark-mode drift (only the buy screen is dark), season color used outside its role (accent only for prices/active states, CTA color only for the bottom bar, foil only for box-card borders). Keep 60-80% of the screen neutral white/gray, season color concentrated in the header, key visual and CTA.

LAYOUT, top to bottom:
1) Full-width product hero photo (black-and-white photo of a Celine bag on an antique carved table) with a back arrow. Keep the photo itself untouched; only a small seasonal accent (gold sparkles, small gold coins, tiny traditional Korean cloud patterns in gold line) in its bottom-right corner.
2) Title: "[품절]" in #9A6A12 followed by "[셀린느] 미디움 베사체 트리옹프 서플 내추럴 카프스킨 블랙".
3) Price, bold: "₩ 2,850,000".
4) Two tabs: "상품상세" (active, dark underline) and "상품 리뷰".
5) Light gray rounded notice box: "- NOTICE -" (bold) and "위 상품의 가격은 판촉을 위한 마케팅 목적의 참고값으로, 실제 앱 내 구매 시 적용되는 가격이 아닙니다. 해당 가격은 손해배상 기준이나 상품 환급과는 관련이 없으니 참고해 주시기 바랍니다."
6) Product detail image area (navy watch strap photo) partly visible.
7) Fixed bottom CTA bar, solid #8A5F10 with a subtle gloss, a small 3D red silk Korean lucky pouch (bokjumeoni) with gold cord to the left of the white bold text "CHOCOLATE BOX 뽑기".
```

### 신년 · 뉴스룸

```
Follow the chocolatebox DESIGN.md given earlier in this chat (season: 신년). Create a high-fidelity mobile app UI screen, 9:16 portrait (iPhone 390x844 layout), for "chocolatebox", a Korean gift-box shopping app, in its Korean Lunar New Year season theme. If a screenshot is attached, keep its exact layout, element sizes and all of its text, and restyle only.

THEME: palette midnight navy, lucky red, antique gold, ivory; header #14233F, accent #9A6A12, CTA #8A5F10. Mood: premium, clean and festive but restrained, like a top-tier Korean commerce app's seasonal event skin. Seasonal illustrations are premium 3D renders (Cinema 4D / Octane, glossy and satin materials, soft studio light). Decoration (gold sparkles, small gold coins, tiny traditional Korean cloud patterns in gold line) stays near edges and never overlaps text. White content areas stay clean.

TEXT: render every Korean string exactly as written inside quotes, crisp sans-serif (Pretendard / Apple SD Gothic Neo style). Do not add, translate or change any text. Keep the 3D gift-box images inside the box cards as they are (only the card border is themed). No watermark, no device frame.

AVOID (AI-slop tells): indigo/violet drift, emoji or emoji-like icons, decorative cards or boxes that the original screen does not have, decorative left accent stripes, a single word recolored or swapped to another font for flair, flat clip-art, generic abstract blobs, dark-mode drift (only the buy screen is dark), season color used outside its role (accent only for prices/active states, CTA color only for the bottom bar, foil only for box-card borders). Keep 60-80% of the screen neutral white/gray, season color concentrated in the header, key visual and CTA.

LAYOUT, top to bottom:
1) White top bar with centered "뉴스룸"; a thin seasonal garland (gold sparkles, small gold coins, tiny traditional Korean cloud patterns in gold line) below it.
2) Tabs: "구매내역" (active, bold, dark underline), "명예의전당", "리뷰(82)", "상품목록" (small red dot).
3) Horizontal carousel of large rounded cards: the center card is solid #1F2F66 with a white organic blob holding a blender product photo, and white text "마마님 구매완료", "[브레빌] 블렌더프레시 엔 퓨이어스" (bold), "정가350,000원"; neighbor cards (#8A5F10, #B0243A) peek in from both sides; faint gold sparkles, small gold coins, tiny traditional Korean cloud patterns in gold line on the card corners.
4) Page dots, the first one a long dark pill.
5) Heading "실시간 구매 내역".
6) Purchase rows: the first row filled #9A6A12 with white text: product thumbnail, "마마님 구매완료", "[셀린느] 미디움 베사체 트리옹프 서플 내추럴 카프스킨 블랙", "₩5,850,000", "방금 전"; the second row white with a light outline: same product, "24,000", "방금 전".
7) Below, partly visible: mission banner card (#9A6A12) with a 3D red silk Korean lucky pouch (bokjumeoni) with gold cord on the right, white bold "신년 초코미션빙고" and a white button "미션 확인".
8) White bottom tab bar, "뉴스룸" active (#FDF4E2 pill).
```

### 신년 · 구매하기

```
Follow the chocolatebox DESIGN.md given earlier in this chat (season: 신년). Create a high-fidelity mobile app UI screen, 9:16 portrait (iPhone 390x844 layout), for "chocolatebox", a Korean gift-box shopping app, in its Korean Lunar New Year season theme. If a screenshot is attached, keep its exact layout, element sizes and all of its text, and restyle only.

THEME: palette midnight navy, lucky red, antique gold, ivory; header #14233F, accent #9A6A12, CTA #8A5F10. Mood: premium, clean and festive but restrained, like a top-tier Korean commerce app's seasonal event skin. Seasonal illustrations are premium 3D renders (Cinema 4D / Octane, glossy and satin materials, soft studio light). Decoration (gold sparkles, small gold coins, tiny traditional Korean cloud patterns in gold line) stays near edges and never overlaps text. White content areas stay clean.

TEXT: render every Korean string exactly as written inside quotes, crisp sans-serif (Pretendard / Apple SD Gothic Neo style). Do not add, translate or change any text. Keep the 3D gift-box images inside the box cards as they are (only the card border is themed). No watermark, no device frame.

AVOID (AI-slop tells): indigo/violet drift, emoji or emoji-like icons, decorative cards or boxes that the original screen does not have, decorative left accent stripes, a single word recolored or swapped to another font for flair, flat clip-art, generic abstract blobs, dark-mode drift (only the buy screen is dark), season color used outside its role (accent only for prices/active states, CTA color only for the bottom bar, foil only for box-card borders). Keep 60-80% of the screen neutral white/gray, season color concentrated in the header, key visual and CTA.

LAYOUT, top to bottom (dark, game-like screen with a vertical gradient #0A1228 to #1F2F66):
1) Top bar: white close X, centered "2회차 구매하기", right a dark-brown coin "B" + "240" (lavender text).
2) Seasonal garland (gold sparkles, small gold coins, tiny traditional Korean cloud patterns in gold line) below the top bar.
3) Hero stage, about 200px tall: radiating light rays and a glowing elliptical floor spotlight (#E8C86A); premium 3D props at the far left and far right (a red silk Korean lucky pouch (bokjumeoni) with gold cord and pleated top, antique gold Korean coins (round with a square hole); a navy silk bokjumeoni with gold cord, more gold coins, small gold stars); centered big italic 3D title "CHANCE" / "PREMIUM" in glossy gold with a thick dark outline, a small white rounded badge "UP" between the two words; subtitle "찬스업 프리미엄 박스" (white, bold).
4) 5-column grid of rounded number tiles "1" to "25" (more rows continue below): available tiles #3347A8 with a lighter top gradient and white numbers; sold-out tiles 3, 4, 8, 12, 19, 20, 22 dimmed dark; tile 5 filled #0E5C73.
5) White bottom sheet with rounded top corners: "박스 선택하기" (bold) + "(1등 확률 4%)" (#9A6A12, small), right "8개 구매가능" (gray); a row of slots "5", "28" (pale yellow), "29", "30" (#FFD84D), then dashed empty slots with "+"; a full-width black pill button "다음" (white text).
```

## 발렌타인

### 발렌타인 · 박스구매 홈

```
Follow the chocolatebox DESIGN.md given earlier in this chat (season: 발렌타인). Create a high-fidelity mobile app UI screen, 9:16 portrait (iPhone 390x844 layout), for "chocolatebox", a Korean gift-box shopping app, in its Valentine's Day (chocolate gift brand) season theme. If a screenshot is attached, keep its exact layout, element sizes and all of its text, and restyle only.

THEME: palette deep plum, ruby red, blush pink, milk-chocolate brown, rose gold; header #C2284E, accent #C2284E, CTA #C2284E. Mood: premium, clean and festive but restrained, like a top-tier Korean commerce app's seasonal event skin. Seasonal illustrations are premium 3D renders (Cinema 4D / Octane, glossy and satin materials, soft studio light). Decoration (small glossy hearts, chocolate drizzle, rose-gold sparkles) stays near edges and never overlaps text. White content areas stay clean.

TEXT: render every Korean string exactly as written inside quotes, crisp sans-serif (Pretendard / Apple SD Gothic Neo style). Do not add, translate or change any text. Keep the 3D gift-box images inside the box cards as they are (only the card border is themed). No watermark, no device frame.

AVOID (AI-slop tells): indigo/violet drift, emoji or emoji-like icons, decorative cards or boxes that the original screen does not have, decorative left accent stripes, a single word recolored or swapped to another font for flair, flat clip-art, generic abstract blobs, dark-mode drift (only the buy screen is dark), season color used outside its role (accent only for prices/active states, CTA color only for the bottom bar, foil only for box-card borders). Keep 60-80% of the screen neutral white/gray, season color concentrated in the header, key visual and CTA.

LAYOUT, top to bottom:
1) Header bar, solid #C2284E: white coin chip "P" + "5,000", dark-brown coin "B" + "30 >", white square "%" + "2개 >", right side "초코덕 >" (white text).
2) A delicate garland of small glossy hearts, chocolate drizzle, rose-gold sparkles hanging just below the header.
3) Main banner card (rounded corners, 16px side margins, about 190px tall): Deep plum / wine background with a soft pink spotlight. Premium 3D props on the left (a large glossy red 3D heart, a small pink heart, a dark chocolate truffle) and on the right (a glossy milk-chocolate heart, white and cocoa-dusted chocolate truffles, rose-gold sparkles). Centered two-line 3D title "달콤한 마음을" / "전해요!!" in white, both lines the same color (hierarchy from size and weight only), with a white rounded button "포인트샵 바로가기" (#C2284E text) along the bottom of the card.
4) 2x2 grid of box cards (rounded corners) on a light gray page. Each card keeps its 3D gift-box image (pink cube, red gift, purple gift, yellow gift) and a white pill label: "보유수량 : 99개", "남은시간 01:45:15", "보유수량 : 19개", "보유수량 : 39개". Every card gets a thin rose-gold foil border with a soft glow; a small 3D glossy red 3D heart hangs on the top-left corner of the first card and the top-right corner of the last card. Under each card a colored label and a dark description: "초콜릿박스" / "12,000원 이상의 상품으로 구성됩니다.", "찬스업 14회" / "100박스 한정! 더 좋은 상품을 받으세요!", "찬스업 프리미엄" / "프리미엄 상품으로 구성된 찬스업 프리미엄", "푸드박스 14회" / "가볍게 즐기는 간식형 푸드박스".
5) White bottom tab bar: "Home", "뉴스룸" (small red dot), "박스구매" (active: #FDE2E9 rounded pill, #C2284E icon and text), "내보관함", "앱테크".
```

### 발렌타인 · 포인트샵

```
Follow the chocolatebox DESIGN.md given earlier in this chat (season: 발렌타인). Create a high-fidelity mobile app UI screen, 9:16 portrait (iPhone 390x844 layout), for "chocolatebox", a Korean gift-box shopping app, in its Valentine's Day (chocolate gift brand) season theme. If a screenshot is attached, keep its exact layout, element sizes and all of its text, and restyle only.

THEME: palette deep plum, ruby red, blush pink, milk-chocolate brown, rose gold; header #C2284E, accent #C2284E, CTA #C2284E. Mood: premium, clean and festive but restrained, like a top-tier Korean commerce app's seasonal event skin. Seasonal illustrations are premium 3D renders (Cinema 4D / Octane, glossy and satin materials, soft studio light). Decoration (small glossy hearts, chocolate drizzle, rose-gold sparkles) stays near edges and never overlaps text. White content areas stay clean.

TEXT: render every Korean string exactly as written inside quotes, crisp sans-serif (Pretendard / Apple SD Gothic Neo style). Do not add, translate or change any text. Keep the 3D gift-box images inside the box cards as they are (only the card border is themed). No watermark, no device frame.

AVOID (AI-slop tells): indigo/violet drift, emoji or emoji-like icons, decorative cards or boxes that the original screen does not have, decorative left accent stripes, a single word recolored or swapped to another font for flair, flat clip-art, generic abstract blobs, dark-mode drift (only the buy screen is dark), season color used outside its role (accent only for prices/active states, CTA color only for the bottom bar, foil only for box-card borders). Keep 60-80% of the screen neutral white/gray, season color concentrated in the header, key visual and CTA.

LAYOUT, top to bottom:
1) White top bar: back arrow, centered "포인트샵", right a black coin "P" + "1,289,050". A thin seasonal garland (small glossy hearts, chocolate drizzle, rose-gold sparkles) below it.
2) Rounded info box, #FEE7EC background with #C2284E text and faint small glossy hearts, chocolate drizzle, rose-gold sparkles only at its edges: "보유 포인트로 원하는 상품을 선택하여 교환할 수 있습니다." and "(단, 상품권 및 기프티콘은 합산 1인 1일 최대 4개 교환 가능합니다.)"
3) Category row of round icons with labels: "전체" (selected, black circle), "리퍼상품", "기프티콘", "가전", "식품", "뷰티".
4) Rounded search field with a magnifier icon: "상품검색".
5) Sort row: "최신순 ▾" and "전체 1,124개" ("1,124" in #C2284E).
6) 2-column product grid, real product photos on light gray rounded tiles: "ThanksQR 적립금 100,000원권" / "재고수량 : 0" / "매진" (blue); "[르비에]대용량 텀블러 1.18L" / "재고수량 : 15" / "30,000 P" (#C2284E); the next row (a smartphone, a box of cookies) partly visible.
7) White bottom tab bar: "Home", "뉴스룸" (red dot), "박스구매" (active, #FDE2E9 pill), "내보관함", "앱테크".
```

### 발렌타인 · 상품상세

```
Follow the chocolatebox DESIGN.md given earlier in this chat (season: 발렌타인). Create a high-fidelity mobile app UI screen, 9:16 portrait (iPhone 390x844 layout), for "chocolatebox", a Korean gift-box shopping app, in its Valentine's Day (chocolate gift brand) season theme. If a screenshot is attached, keep its exact layout, element sizes and all of its text, and restyle only.

THEME: palette deep plum, ruby red, blush pink, milk-chocolate brown, rose gold; header #C2284E, accent #C2284E, CTA #C2284E. Mood: premium, clean and festive but restrained, like a top-tier Korean commerce app's seasonal event skin. Seasonal illustrations are premium 3D renders (Cinema 4D / Octane, glossy and satin materials, soft studio light). Decoration (small glossy hearts, chocolate drizzle, rose-gold sparkles) stays near edges and never overlaps text. White content areas stay clean.

TEXT: render every Korean string exactly as written inside quotes, crisp sans-serif (Pretendard / Apple SD Gothic Neo style). Do not add, translate or change any text. Keep the 3D gift-box images inside the box cards as they are (only the card border is themed). No watermark, no device frame.

AVOID (AI-slop tells): indigo/violet drift, emoji or emoji-like icons, decorative cards or boxes that the original screen does not have, decorative left accent stripes, a single word recolored or swapped to another font for flair, flat clip-art, generic abstract blobs, dark-mode drift (only the buy screen is dark), season color used outside its role (accent only for prices/active states, CTA color only for the bottom bar, foil only for box-card borders). Keep 60-80% of the screen neutral white/gray, season color concentrated in the header, key visual and CTA.

LAYOUT, top to bottom:
1) Full-width product hero photo (black-and-white photo of a Celine bag on an antique carved table) with a back arrow. Keep the photo itself untouched; only a small seasonal accent (small glossy hearts, chocolate drizzle, rose-gold sparkles) in its bottom-right corner.
2) Title: "[품절]" in #C2284E followed by "[셀린느] 미디움 베사체 트리옹프 서플 내추럴 카프스킨 블랙".
3) Price, bold: "₩ 2,850,000".
4) Two tabs: "상품상세" (active, dark underline) and "상품 리뷰".
5) Light gray rounded notice box: "- NOTICE -" (bold) and "위 상품의 가격은 판촉을 위한 마케팅 목적의 참고값으로, 실제 앱 내 구매 시 적용되는 가격이 아닙니다. 해당 가격은 손해배상 기준이나 상품 환급과는 관련이 없으니 참고해 주시기 바랍니다."
6) Product detail image area (navy watch strap photo) partly visible.
7) Fixed bottom CTA bar, solid #C2284E with a subtle gloss, a small 3D glossy red 3D heart to the left of the white bold text "CHOCOLATE BOX 뽑기".
```

### 발렌타인 · 뉴스룸

```
Follow the chocolatebox DESIGN.md given earlier in this chat (season: 발렌타인). Create a high-fidelity mobile app UI screen, 9:16 portrait (iPhone 390x844 layout), for "chocolatebox", a Korean gift-box shopping app, in its Valentine's Day (chocolate gift brand) season theme. If a screenshot is attached, keep its exact layout, element sizes and all of its text, and restyle only.

THEME: palette deep plum, ruby red, blush pink, milk-chocolate brown, rose gold; header #C2284E, accent #C2284E, CTA #C2284E. Mood: premium, clean and festive but restrained, like a top-tier Korean commerce app's seasonal event skin. Seasonal illustrations are premium 3D renders (Cinema 4D / Octane, glossy and satin materials, soft studio light). Decoration (small glossy hearts, chocolate drizzle, rose-gold sparkles) stays near edges and never overlaps text. White content areas stay clean.

TEXT: render every Korean string exactly as written inside quotes, crisp sans-serif (Pretendard / Apple SD Gothic Neo style). Do not add, translate or change any text. Keep the 3D gift-box images inside the box cards as they are (only the card border is themed). No watermark, no device frame.

AVOID (AI-slop tells): indigo/violet drift, emoji or emoji-like icons, decorative cards or boxes that the original screen does not have, decorative left accent stripes, a single word recolored or swapped to another font for flair, flat clip-art, generic abstract blobs, dark-mode drift (only the buy screen is dark), season color used outside its role (accent only for prices/active states, CTA color only for the bottom bar, foil only for box-card borders). Keep 60-80% of the screen neutral white/gray, season color concentrated in the header, key visual and CTA.

LAYOUT, top to bottom:
1) White top bar with centered "뉴스룸"; a thin seasonal garland (small glossy hearts, chocolate drizzle, rose-gold sparkles) below it.
2) Tabs: "구매내역" (active, bold, dark underline), "명예의전당", "리뷰(82)", "상품목록" (small red dot).
3) Horizontal carousel of large rounded cards: the center card is solid #B5214D with a white organic blob holding a blender product photo, and white text "마마님 구매완료", "[브레빌] 블렌더프레시 엔 퓨이어스" (bold), "정가350,000원"; neighbor cards (#7A2E8E, #D6288E) peek in from both sides; faint small glossy hearts, chocolate drizzle, rose-gold sparkles on the card corners.
4) Page dots, the first one a long dark pill.
5) Heading "실시간 구매 내역".
6) Purchase rows: the first row filled #C2284E with white text: product thumbnail, "마마님 구매완료", "[셀린느] 미디움 베사체 트리옹프 서플 내추럴 카프스킨 블랙", "₩5,850,000", "방금 전"; the second row white with a light outline: same product, "24,000", "방금 전".
7) Below, partly visible: mission banner card (#B5214D) with a 3D glossy red 3D heart on the right, white bold "발렌타인 초코미션빙고" and a white button "미션 확인".
8) White bottom tab bar, "뉴스룸" active (#FDE2E9 pill).
```

### 발렌타인 · 구매하기

```
Follow the chocolatebox DESIGN.md given earlier in this chat (season: 발렌타인). Create a high-fidelity mobile app UI screen, 9:16 portrait (iPhone 390x844 layout), for "chocolatebox", a Korean gift-box shopping app, in its Valentine's Day (chocolate gift brand) season theme. If a screenshot is attached, keep its exact layout, element sizes and all of its text, and restyle only.

THEME: palette deep plum, ruby red, blush pink, milk-chocolate brown, rose gold; header #C2284E, accent #C2284E, CTA #C2284E. Mood: premium, clean and festive but restrained, like a top-tier Korean commerce app's seasonal event skin. Seasonal illustrations are premium 3D renders (Cinema 4D / Octane, glossy and satin materials, soft studio light). Decoration (small glossy hearts, chocolate drizzle, rose-gold sparkles) stays near edges and never overlaps text. White content areas stay clean.

TEXT: render every Korean string exactly as written inside quotes, crisp sans-serif (Pretendard / Apple SD Gothic Neo style). Do not add, translate or change any text. Keep the 3D gift-box images inside the box cards as they are (only the card border is themed). No watermark, no device frame.

AVOID (AI-slop tells): indigo/violet drift, emoji or emoji-like icons, decorative cards or boxes that the original screen does not have, decorative left accent stripes, a single word recolored or swapped to another font for flair, flat clip-art, generic abstract blobs, dark-mode drift (only the buy screen is dark), season color used outside its role (accent only for prices/active states, CTA color only for the bottom bar, foil only for box-card borders). Keep 60-80% of the screen neutral white/gray, season color concentrated in the header, key visual and CTA.

LAYOUT, top to bottom (dark, game-like screen with a vertical gradient #33082A to #7A1B55):
1) Top bar: white close X, centered "2회차 구매하기", right a dark-brown coin "B" + "240" (lavender text).
2) Seasonal garland (small glossy hearts, chocolate drizzle, rose-gold sparkles) below the top bar.
3) Hero stage, about 200px tall: radiating light rays and a glowing elliptical floor spotlight (#FF8FB1); premium 3D props at the far left and far right (a large glossy red 3D heart, a small pink heart, a dark chocolate truffle; a glossy milk-chocolate heart, white and cocoa-dusted chocolate truffles, rose-gold sparkles); centered big italic 3D title "CHANCE" / "PREMIUM" in glossy gold with a thick dark outline, a small white rounded badge "UP" between the two words; subtitle "찬스업 프리미엄 박스" (white, bold).
4) 5-column grid of rounded number tiles "1" to "25" (more rows continue below): available tiles #A02A78 with a lighter top gradient and white numbers; sold-out tiles 3, 4, 8, 12, 19, 20, 22 dimmed dark; tile 5 filled #5C2A7A.
5) White bottom sheet with rounded top corners: "박스 선택하기" (bold) + "(1등 확률 4%)" (#C2284E, small), right "8개 구매가능" (gray); a row of slots "5", "28" (pale yellow), "29", "30" (#FF9EC4), then dashed empty slots with "+"; a full-width black pill button "다음" (white text).
```

## 봄

### 봄 · 박스구매 홈

```
Follow the chocolatebox DESIGN.md given earlier in this chat (season: 봄). Create a high-fidelity mobile app UI screen, 9:16 portrait (iPhone 390x844 layout), for "chocolatebox", a Korean gift-box shopping app, in its Spring cherry blossom season theme. If a screenshot is attached, keep its exact layout, element sizes and all of its text, and restyle only.

THEME: palette soft sakura pink, fresh spring green, cream white; header #CA456E, accent #C23A6A, CTA #3A845C. Mood: premium, clean and festive but restrained, like a top-tier Korean commerce app's seasonal event skin. Seasonal illustrations are premium 3D renders (Cinema 4D / Octane, glossy and satin materials, soft studio light). Decoration (falling sakura petals, small blossoms) stays near edges and never overlaps text. White content areas stay clean.

TEXT: render every Korean string exactly as written inside quotes, crisp sans-serif (Pretendard / Apple SD Gothic Neo style). Do not add, translate or change any text. Keep the 3D gift-box images inside the box cards as they are (only the card border is themed). No watermark, no device frame.

AVOID (AI-slop tells): indigo/violet drift, emoji or emoji-like icons, decorative cards or boxes that the original screen does not have, decorative left accent stripes, a single word recolored or swapped to another font for flair, flat clip-art, generic abstract blobs, dark-mode drift (only the buy screen is dark), season color used outside its role (accent only for prices/active states, CTA color only for the bottom bar, foil only for box-card borders). Keep 60-80% of the screen neutral white/gray, season color concentrated in the header, key visual and CTA.

LAYOUT, top to bottom:
1) Header bar, solid #CA456E: white coin chip "P" + "5,000", dark-brown coin "B" + "30 >", white square "%" + "2개 >", right side "초코덕 >" (white text).
2) A delicate garland of falling sakura petals, small blossoms hanging just below the header.
3) Main banner card (rounded corners, 16px side margins, about 190px tall): Soft rose-pink gradient background with a bright airy center. Premium 3D props on the left (a cherry blossom branch entering from the top-left with clusters of 3D sakura flowers (translucent petals, yellow stamens)) and on the right (a cherry blossom branch entering from the top-right with more sakura clusters). Centered two-line 3D title "봄맞이 쇼핑의" / "즐거움이 가득!!" in white, both lines the same color (hierarchy from size and weight only), with a white rounded button "포인트샵 바로가기" (#C23A6A text) along the bottom of the card.
4) 2x2 grid of box cards (rounded corners) on a light gray page. Each card keeps its 3D gift-box image (pink cube, red gift, purple gift, yellow gift) and a white pill label: "보유수량 : 99개", "남은시간 01:45:15", "보유수량 : 19개", "보유수량 : 39개". Every card gets a thin pearl-pink iridescent border with a soft glow; a small 3D pink cherry blossom flower with yellow stamens hangs on the top-left corner of the first card and the top-right corner of the last card. Under each card a colored label and a dark description: "초콜릿박스" / "12,000원 이상의 상품으로 구성됩니다.", "찬스업 14회" / "100박스 한정! 더 좋은 상품을 받으세요!", "찬스업 프리미엄" / "프리미엄 상품으로 구성된 찬스업 프리미엄", "푸드박스 14회" / "가볍게 즐기는 간식형 푸드박스".
5) White bottom tab bar: "Home", "뉴스룸" (small red dot), "박스구매" (active: #FDE2EC rounded pill, #C23A6A icon and text), "내보관함", "앱테크".
```

### 봄 · 포인트샵

```
Follow the chocolatebox DESIGN.md given earlier in this chat (season: 봄). Create a high-fidelity mobile app UI screen, 9:16 portrait (iPhone 390x844 layout), for "chocolatebox", a Korean gift-box shopping app, in its Spring cherry blossom season theme. If a screenshot is attached, keep its exact layout, element sizes and all of its text, and restyle only.

THEME: palette soft sakura pink, fresh spring green, cream white; header #CA456E, accent #C23A6A, CTA #3A845C. Mood: premium, clean and festive but restrained, like a top-tier Korean commerce app's seasonal event skin. Seasonal illustrations are premium 3D renders (Cinema 4D / Octane, glossy and satin materials, soft studio light). Decoration (falling sakura petals, small blossoms) stays near edges and never overlaps text. White content areas stay clean.

TEXT: render every Korean string exactly as written inside quotes, crisp sans-serif (Pretendard / Apple SD Gothic Neo style). Do not add, translate or change any text. Keep the 3D gift-box images inside the box cards as they are (only the card border is themed). No watermark, no device frame.

AVOID (AI-slop tells): indigo/violet drift, emoji or emoji-like icons, decorative cards or boxes that the original screen does not have, decorative left accent stripes, a single word recolored or swapped to another font for flair, flat clip-art, generic abstract blobs, dark-mode drift (only the buy screen is dark), season color used outside its role (accent only for prices/active states, CTA color only for the bottom bar, foil only for box-card borders). Keep 60-80% of the screen neutral white/gray, season color concentrated in the header, key visual and CTA.

LAYOUT, top to bottom:
1) White top bar: back arrow, centered "포인트샵", right a black coin "P" + "1,289,050". A thin seasonal garland (falling sakura petals, small blossoms) below it.
2) Rounded info box, #E7FEF1 background with #387F58 text and faint falling sakura petals, small blossoms only at its edges: "보유 포인트로 원하는 상품을 선택하여 교환할 수 있습니다." and "(단, 상품권 및 기프티콘은 합산 1인 1일 최대 4개 교환 가능합니다.)"
3) Category row of round icons with labels: "전체" (selected, black circle), "리퍼상품", "기프티콘", "가전", "식품", "뷰티".
4) Rounded search field with a magnifier icon: "상품검색".
5) Sort row: "최신순 ▾" and "전체 1,124개" ("1,124" in #C23A6A).
6) 2-column product grid, real product photos on light gray rounded tiles: "ThanksQR 적립금 100,000원권" / "재고수량 : 0" / "매진" (blue); "[르비에]대용량 텀블러 1.18L" / "재고수량 : 15" / "30,000 P" (#C23A6A); the next row (a smartphone, a box of cookies) partly visible.
7) White bottom tab bar: "Home", "뉴스룸" (red dot), "박스구매" (active, #FDE2EC pill), "내보관함", "앱테크".
```

### 봄 · 상품상세

```
Follow the chocolatebox DESIGN.md given earlier in this chat (season: 봄). Create a high-fidelity mobile app UI screen, 9:16 portrait (iPhone 390x844 layout), for "chocolatebox", a Korean gift-box shopping app, in its Spring cherry blossom season theme. If a screenshot is attached, keep its exact layout, element sizes and all of its text, and restyle only.

THEME: palette soft sakura pink, fresh spring green, cream white; header #CA456E, accent #C23A6A, CTA #3A845C. Mood: premium, clean and festive but restrained, like a top-tier Korean commerce app's seasonal event skin. Seasonal illustrations are premium 3D renders (Cinema 4D / Octane, glossy and satin materials, soft studio light). Decoration (falling sakura petals, small blossoms) stays near edges and never overlaps text. White content areas stay clean.

TEXT: render every Korean string exactly as written inside quotes, crisp sans-serif (Pretendard / Apple SD Gothic Neo style). Do not add, translate or change any text. Keep the 3D gift-box images inside the box cards as they are (only the card border is themed). No watermark, no device frame.

AVOID (AI-slop tells): indigo/violet drift, emoji or emoji-like icons, decorative cards or boxes that the original screen does not have, decorative left accent stripes, a single word recolored or swapped to another font for flair, flat clip-art, generic abstract blobs, dark-mode drift (only the buy screen is dark), season color used outside its role (accent only for prices/active states, CTA color only for the bottom bar, foil only for box-card borders). Keep 60-80% of the screen neutral white/gray, season color concentrated in the header, key visual and CTA.

LAYOUT, top to bottom:
1) Full-width product hero photo (black-and-white photo of a Celine bag on an antique carved table) with a back arrow. Keep the photo itself untouched; only a small seasonal accent (falling sakura petals, small blossoms) in its bottom-right corner.
2) Title: "[품절]" in #C23A6A followed by "[셀린느] 미디움 베사체 트리옹프 서플 내추럴 카프스킨 블랙".
3) Price, bold: "₩ 2,850,000".
4) Two tabs: "상품상세" (active, dark underline) and "상품 리뷰".
5) Light gray rounded notice box: "- NOTICE -" (bold) and "위 상품의 가격은 판촉을 위한 마케팅 목적의 참고값으로, 실제 앱 내 구매 시 적용되는 가격이 아닙니다. 해당 가격은 손해배상 기준이나 상품 환급과는 관련이 없으니 참고해 주시기 바랍니다."
6) Product detail image area (navy watch strap photo) partly visible.
7) Fixed bottom CTA bar, solid #3A845C with a subtle gloss, a small 3D pink cherry blossom flower with yellow stamens to the left of the white bold text "CHOCOLATE BOX 뽑기".
```

### 봄 · 뉴스룸

```
Follow the chocolatebox DESIGN.md given earlier in this chat (season: 봄). Create a high-fidelity mobile app UI screen, 9:16 portrait (iPhone 390x844 layout), for "chocolatebox", a Korean gift-box shopping app, in its Spring cherry blossom season theme. If a screenshot is attached, keep its exact layout, element sizes and all of its text, and restyle only.

THEME: palette soft sakura pink, fresh spring green, cream white; header #CA456E, accent #C23A6A, CTA #3A845C. Mood: premium, clean and festive but restrained, like a top-tier Korean commerce app's seasonal event skin. Seasonal illustrations are premium 3D renders (Cinema 4D / Octane, glossy and satin materials, soft studio light). Decoration (falling sakura petals, small blossoms) stays near edges and never overlaps text. White content areas stay clean.

TEXT: render every Korean string exactly as written inside quotes, crisp sans-serif (Pretendard / Apple SD Gothic Neo style). Do not add, translate or change any text. Keep the 3D gift-box images inside the box cards as they are (only the card border is themed). No watermark, no device frame.

AVOID (AI-slop tells): indigo/violet drift, emoji or emoji-like icons, decorative cards or boxes that the original screen does not have, decorative left accent stripes, a single word recolored or swapped to another font for flair, flat clip-art, generic abstract blobs, dark-mode drift (only the buy screen is dark), season color used outside its role (accent only for prices/active states, CTA color only for the bottom bar, foil only for box-card borders). Keep 60-80% of the screen neutral white/gray, season color concentrated in the header, key visual and CTA.

LAYOUT, top to bottom:
1) White top bar with centered "뉴스룸"; a thin seasonal garland (falling sakura petals, small blossoms) below it.
2) Tabs: "구매내역" (active, bold, dark underline), "명예의전당", "리뷰(82)", "상품목록" (small red dot).
3) Horizontal carousel of large rounded cards: the center card is solid #3F8F63 with a white organic blob holding a blender product photo, and white text "마마님 구매완료", "[브레빌] 블렌더프레시 엔 퓨이어스" (bold), "정가350,000원"; neighbor cards (#CC4B73, #7A5BC0) peek in from both sides; faint falling sakura petals, small blossoms on the card corners.
4) Page dots, the first one a long dark pill.
5) Heading "실시간 구매 내역".
6) Purchase rows: the first row filled #C23A6A with white text: product thumbnail, "마마님 구매완료", "[셀린느] 미디움 베사체 트리옹프 서플 내추럴 카프스킨 블랙", "₩5,850,000", "방금 전"; the second row white with a light outline: same product, "24,000", "방금 전".
7) Below, partly visible: mission banner card (#3A845C) with a 3D pink cherry blossom flower with yellow stamens on the right, white bold "봄맞이 초코미션빙고" and a white button "미션 확인".
8) White bottom tab bar, "뉴스룸" active (#FDE2EC pill).
```

### 봄 · 구매하기

```
Follow the chocolatebox DESIGN.md given earlier in this chat (season: 봄). Create a high-fidelity mobile app UI screen, 9:16 portrait (iPhone 390x844 layout), for "chocolatebox", a Korean gift-box shopping app, in its Spring cherry blossom season theme. If a screenshot is attached, keep its exact layout, element sizes and all of its text, and restyle only.

THEME: palette soft sakura pink, fresh spring green, cream white; header #CA456E, accent #C23A6A, CTA #3A845C. Mood: premium, clean and festive but restrained, like a top-tier Korean commerce app's seasonal event skin. Seasonal illustrations are premium 3D renders (Cinema 4D / Octane, glossy and satin materials, soft studio light). Decoration (falling sakura petals, small blossoms) stays near edges and never overlaps text. White content areas stay clean.

TEXT: render every Korean string exactly as written inside quotes, crisp sans-serif (Pretendard / Apple SD Gothic Neo style). Do not add, translate or change any text. Keep the 3D gift-box images inside the box cards as they are (only the card border is themed). No watermark, no device frame.

AVOID (AI-slop tells): indigo/violet drift, emoji or emoji-like icons, decorative cards or boxes that the original screen does not have, decorative left accent stripes, a single word recolored or swapped to another font for flair, flat clip-art, generic abstract blobs, dark-mode drift (only the buy screen is dark), season color used outside its role (accent only for prices/active states, CTA color only for the bottom bar, foil only for box-card borders). Keep 60-80% of the screen neutral white/gray, season color concentrated in the header, key visual and CTA.

LAYOUT, top to bottom (dark, game-like screen with a vertical gradient #10301F to #20603F):
1) Top bar: white close X, centered "2회차 구매하기", right a dark-brown coin "B" + "240" (lavender text).
2) Seasonal garland (falling sakura petals, small blossoms) below the top bar.
3) Hero stage, about 200px tall: radiating light rays and a glowing elliptical floor spotlight (#9BE0B5); premium 3D props at the far left and far right (a cherry blossom branch entering from the top-left with clusters of 3D sakura flowers (translucent petals, yellow stamens); a cherry blossom branch entering from the top-right with more sakura clusters); centered big italic 3D title "CHANCE" / "PREMIUM" in glossy gold with a thick dark outline, a small white rounded badge "UP" between the two words; subtitle "찬스업 프리미엄 박스" (white, bold).
4) 5-column grid of rounded number tiles "1" to "25" (more rows continue below): available tiles #2F8F5F with a lighter top gradient and white numbers; sold-out tiles 3, 4, 8, 12, 19, 20, 22 dimmed dark; tile 5 filled #7A3A5C.
5) White bottom sheet with rounded top corners: "박스 선택하기" (bold) + "(1등 확률 4%)" (#C23A6A, small), right "8개 구매가능" (gray); a row of slots "5", "28" (pale yellow), "29", "30" (#FFB6D0), then dashed empty slots with "+"; a full-width black pill button "다음" (white text).
```

## 가정의 달

### 가정의 달 · 박스구매 홈

```
Follow the chocolatebox DESIGN.md given earlier in this chat (season: 가정의 달). Create a high-fidelity mobile app UI screen, 9:16 portrait (iPhone 390x844 layout), for "chocolatebox", a Korean gift-box shopping app, in its Korean Family Month (May, Parents' Day) season theme. If a screenshot is attached, keep its exact layout, element sizes and all of its text, and restyle only.

THEME: palette warm coral rose, carnation red, cream, soft gold; header #C0344F, accent #B8334F, CTA #2E7D52. Mood: premium, clean and festive but restrained, like a top-tier Korean commerce app's seasonal event skin. Seasonal illustrations are premium 3D renders (Cinema 4D / Octane, glossy and satin materials, soft studio light). Decoration (small carnations, tiny hearts, ribbon curls) stays near edges and never overlaps text. White content areas stay clean.

TEXT: render every Korean string exactly as written inside quotes, crisp sans-serif (Pretendard / Apple SD Gothic Neo style). Do not add, translate or change any text. Keep the 3D gift-box images inside the box cards as they are (only the card border is themed). No watermark, no device frame.

AVOID (AI-slop tells): indigo/violet drift, emoji or emoji-like icons, decorative cards or boxes that the original screen does not have, decorative left accent stripes, a single word recolored or swapped to another font for flair, flat clip-art, generic abstract blobs, dark-mode drift (only the buy screen is dark), season color used outside its role (accent only for prices/active states, CTA color only for the bottom bar, foil only for box-card borders). Keep 60-80% of the screen neutral white/gray, season color concentrated in the header, key visual and CTA.

LAYOUT, top to bottom:
1) Header bar, solid #C0344F: white coin chip "P" + "5,000", dark-brown coin "B" + "30 >", white square "%" + "2개 >", right side "초코덕 >" (white text).
2) A delicate garland of small carnations, tiny hearts, ribbon curls hanging just below the header.
3) Main banner card (rounded corners, 16px side margins, about 190px tall): Warm rose / coral background with a soft cream spotlight. Premium 3D props on the left (a bouquet of red and pink carnations tied with a yellow satin ribbon, a small gold heart) and on the right (a cream envelope sealed with a red heart, small glossy red and pink hearts). Centered two-line 3D title "가정의 달," / "감사를 전해요!!" in white, both lines the same color (hierarchy from size and weight only), with a white rounded button "포인트샵 바로가기" (#B8334F text) along the bottom of the card.
4) 2x2 grid of box cards (rounded corners) on a light gray page. Each card keeps its 3D gift-box image (pink cube, red gift, purple gift, yellow gift) and a white pill label: "보유수량 : 99개", "남은시간 01:45:15", "보유수량 : 19개", "보유수량 : 39개". Every card gets a thin coral-gold foil border with a soft glow; a small 3D red carnation flower head with a short green calyx hangs on the top-left corner of the first card and the top-right corner of the last card. Under each card a colored label and a dark description: "초콜릿박스" / "12,000원 이상의 상품으로 구성됩니다.", "찬스업 14회" / "100박스 한정! 더 좋은 상품을 받으세요!", "찬스업 프리미엄" / "프리미엄 상품으로 구성된 찬스업 프리미엄", "푸드박스 14회" / "가볍게 즐기는 간식형 푸드박스".
5) White bottom tab bar: "Home", "뉴스룸" (small red dot), "박스구매" (active: #FDE2E8 rounded pill, #B8334F icon and text), "내보관함", "앱테크".
```

### 가정의 달 · 포인트샵

```
Follow the chocolatebox DESIGN.md given earlier in this chat (season: 가정의 달). Create a high-fidelity mobile app UI screen, 9:16 portrait (iPhone 390x844 layout), for "chocolatebox", a Korean gift-box shopping app, in its Korean Family Month (May, Parents' Day) season theme. If a screenshot is attached, keep its exact layout, element sizes and all of its text, and restyle only.

THEME: palette warm coral rose, carnation red, cream, soft gold; header #C0344F, accent #B8334F, CTA #2E7D52. Mood: premium, clean and festive but restrained, like a top-tier Korean commerce app's seasonal event skin. Seasonal illustrations are premium 3D renders (Cinema 4D / Octane, glossy and satin materials, soft studio light). Decoration (small carnations, tiny hearts, ribbon curls) stays near edges and never overlaps text. White content areas stay clean.

TEXT: render every Korean string exactly as written inside quotes, crisp sans-serif (Pretendard / Apple SD Gothic Neo style). Do not add, translate or change any text. Keep the 3D gift-box images inside the box cards as they are (only the card border is themed). No watermark, no device frame.

AVOID (AI-slop tells): indigo/violet drift, emoji or emoji-like icons, decorative cards or boxes that the original screen does not have, decorative left accent stripes, a single word recolored or swapped to another font for flair, flat clip-art, generic abstract blobs, dark-mode drift (only the buy screen is dark), season color used outside its role (accent only for prices/active states, CTA color only for the bottom bar, foil only for box-card borders). Keep 60-80% of the screen neutral white/gray, season color concentrated in the header, key visual and CTA.

LAYOUT, top to bottom:
1) White top bar: back arrow, centered "포인트샵", right a black coin "P" + "1,289,050". A thin seasonal garland (small carnations, tiny hearts, ribbon curls) below it.
2) Rounded info box, #E7FEF1 background with #2E7D52 text and faint small carnations, tiny hearts, ribbon curls only at its edges: "보유 포인트로 원하는 상품을 선택하여 교환할 수 있습니다." and "(단, 상품권 및 기프티콘은 합산 1인 1일 최대 4개 교환 가능합니다.)"
3) Category row of round icons with labels: "전체" (selected, black circle), "리퍼상품", "기프티콘", "가전", "식품", "뷰티".
4) Rounded search field with a magnifier icon: "상품검색".
5) Sort row: "최신순 ▾" and "전체 1,124개" ("1,124" in #B8334F).
6) 2-column product grid, real product photos on light gray rounded tiles: "ThanksQR 적립금 100,000원권" / "재고수량 : 0" / "매진" (blue); "[르비에]대용량 텀블러 1.18L" / "재고수량 : 15" / "30,000 P" (#B8334F); the next row (a smartphone, a box of cookies) partly visible.
7) White bottom tab bar: "Home", "뉴스룸" (red dot), "박스구매" (active, #FDE2E8 pill), "내보관함", "앱테크".
```

### 가정의 달 · 상품상세

```
Follow the chocolatebox DESIGN.md given earlier in this chat (season: 가정의 달). Create a high-fidelity mobile app UI screen, 9:16 portrait (iPhone 390x844 layout), for "chocolatebox", a Korean gift-box shopping app, in its Korean Family Month (May, Parents' Day) season theme. If a screenshot is attached, keep its exact layout, element sizes and all of its text, and restyle only.

THEME: palette warm coral rose, carnation red, cream, soft gold; header #C0344F, accent #B8334F, CTA #2E7D52. Mood: premium, clean and festive but restrained, like a top-tier Korean commerce app's seasonal event skin. Seasonal illustrations are premium 3D renders (Cinema 4D / Octane, glossy and satin materials, soft studio light). Decoration (small carnations, tiny hearts, ribbon curls) stays near edges and never overlaps text. White content areas stay clean.

TEXT: render every Korean string exactly as written inside quotes, crisp sans-serif (Pretendard / Apple SD Gothic Neo style). Do not add, translate or change any text. Keep the 3D gift-box images inside the box cards as they are (only the card border is themed). No watermark, no device frame.

AVOID (AI-slop tells): indigo/violet drift, emoji or emoji-like icons, decorative cards or boxes that the original screen does not have, decorative left accent stripes, a single word recolored or swapped to another font for flair, flat clip-art, generic abstract blobs, dark-mode drift (only the buy screen is dark), season color used outside its role (accent only for prices/active states, CTA color only for the bottom bar, foil only for box-card borders). Keep 60-80% of the screen neutral white/gray, season color concentrated in the header, key visual and CTA.

LAYOUT, top to bottom:
1) Full-width product hero photo (black-and-white photo of a Celine bag on an antique carved table) with a back arrow. Keep the photo itself untouched; only a small seasonal accent (small carnations, tiny hearts, ribbon curls) in its bottom-right corner.
2) Title: "[품절]" in #B8334F followed by "[셀린느] 미디움 베사체 트리옹프 서플 내추럴 카프스킨 블랙".
3) Price, bold: "₩ 2,850,000".
4) Two tabs: "상품상세" (active, dark underline) and "상품 리뷰".
5) Light gray rounded notice box: "- NOTICE -" (bold) and "위 상품의 가격은 판촉을 위한 마케팅 목적의 참고값으로, 실제 앱 내 구매 시 적용되는 가격이 아닙니다. 해당 가격은 손해배상 기준이나 상품 환급과는 관련이 없으니 참고해 주시기 바랍니다."
6) Product detail image area (navy watch strap photo) partly visible.
7) Fixed bottom CTA bar, solid #2E7D52 with a subtle gloss, a small 3D red carnation flower head with a short green calyx to the left of the white bold text "CHOCOLATE BOX 뽑기".
```

### 가정의 달 · 뉴스룸

```
Follow the chocolatebox DESIGN.md given earlier in this chat (season: 가정의 달). Create a high-fidelity mobile app UI screen, 9:16 portrait (iPhone 390x844 layout), for "chocolatebox", a Korean gift-box shopping app, in its Korean Family Month (May, Parents' Day) season theme. If a screenshot is attached, keep its exact layout, element sizes and all of its text, and restyle only.

THEME: palette warm coral rose, carnation red, cream, soft gold; header #C0344F, accent #B8334F, CTA #2E7D52. Mood: premium, clean and festive but restrained, like a top-tier Korean commerce app's seasonal event skin. Seasonal illustrations are premium 3D renders (Cinema 4D / Octane, glossy and satin materials, soft studio light). Decoration (small carnations, tiny hearts, ribbon curls) stays near edges and never overlaps text. White content areas stay clean.

TEXT: render every Korean string exactly as written inside quotes, crisp sans-serif (Pretendard / Apple SD Gothic Neo style). Do not add, translate or change any text. Keep the 3D gift-box images inside the box cards as they are (only the card border is themed). No watermark, no device frame.

AVOID (AI-slop tells): indigo/violet drift, emoji or emoji-like icons, decorative cards or boxes that the original screen does not have, decorative left accent stripes, a single word recolored or swapped to another font for flair, flat clip-art, generic abstract blobs, dark-mode drift (only the buy screen is dark), season color used outside its role (accent only for prices/active states, CTA color only for the bottom bar, foil only for box-card borders). Keep 60-80% of the screen neutral white/gray, season color concentrated in the header, key visual and CTA.

LAYOUT, top to bottom:
1) White top bar with centered "뉴스룸"; a thin seasonal garland (small carnations, tiny hearts, ribbon curls) below it.
2) Tabs: "구매내역" (active, bold, dark underline), "명예의전당", "리뷰(82)", "상품목록" (small red dot).
3) Horizontal carousel of large rounded cards: the center card is solid #B8334F with a white organic blob holding a blender product photo, and white text "마마님 구매완료", "[브레빌] 블렌더프레시 엔 퓨이어스" (bold), "정가350,000원"; neighbor cards (#2E7D52, #B8691F) peek in from both sides; faint small carnations, tiny hearts, ribbon curls on the card corners.
4) Page dots, the first one a long dark pill.
5) Heading "실시간 구매 내역".
6) Purchase rows: the first row filled #B8334F with white text: product thumbnail, "마마님 구매완료", "[셀린느] 미디움 베사체 트리옹프 서플 내추럴 카프스킨 블랙", "₩5,850,000", "방금 전"; the second row white with a light outline: same product, "24,000", "방금 전".
7) Below, partly visible: mission banner card (#2E7D52) with a 3D red carnation flower head with a short green calyx on the right, white bold "가정의 달 초코미션빙고" and a white button "미션 확인".
8) White bottom tab bar, "뉴스룸" active (#FDE2E8 pill).
```

### 가정의 달 · 구매하기

```
Follow the chocolatebox DESIGN.md given earlier in this chat (season: 가정의 달). Create a high-fidelity mobile app UI screen, 9:16 portrait (iPhone 390x844 layout), for "chocolatebox", a Korean gift-box shopping app, in its Korean Family Month (May, Parents' Day) season theme. If a screenshot is attached, keep its exact layout, element sizes and all of its text, and restyle only.

THEME: palette warm coral rose, carnation red, cream, soft gold; header #C0344F, accent #B8334F, CTA #2E7D52. Mood: premium, clean and festive but restrained, like a top-tier Korean commerce app's seasonal event skin. Seasonal illustrations are premium 3D renders (Cinema 4D / Octane, glossy and satin materials, soft studio light). Decoration (small carnations, tiny hearts, ribbon curls) stays near edges and never overlaps text. White content areas stay clean.

TEXT: render every Korean string exactly as written inside quotes, crisp sans-serif (Pretendard / Apple SD Gothic Neo style). Do not add, translate or change any text. Keep the 3D gift-box images inside the box cards as they are (only the card border is themed). No watermark, no device frame.

AVOID (AI-slop tells): indigo/violet drift, emoji or emoji-like icons, decorative cards or boxes that the original screen does not have, decorative left accent stripes, a single word recolored or swapped to another font for flair, flat clip-art, generic abstract blobs, dark-mode drift (only the buy screen is dark), season color used outside its role (accent only for prices/active states, CTA color only for the bottom bar, foil only for box-card borders). Keep 60-80% of the screen neutral white/gray, season color concentrated in the header, key visual and CTA.

LAYOUT, top to bottom (dark, game-like screen with a vertical gradient #2A0F24 to #6A2350):
1) Top bar: white close X, centered "2회차 구매하기", right a dark-brown coin "B" + "240" (lavender text).
2) Seasonal garland (small carnations, tiny hearts, ribbon curls) below the top bar.
3) Hero stage, about 200px tall: radiating light rays and a glowing elliptical floor spotlight (#FF9FB5); premium 3D props at the far left and far right (a bouquet of red and pink carnations tied with a yellow satin ribbon, a small gold heart; a cream envelope sealed with a red heart, small glossy red and pink hearts); centered big italic 3D title "CHANCE" / "PREMIUM" in glossy gold with a thick dark outline, a small white rounded badge "UP" between the two words; subtitle "찬스업 프리미엄 박스" (white, bold).
4) 5-column grid of rounded number tiles "1" to "25" (more rows continue below): available tiles #9B3070 with a lighter top gradient and white numbers; sold-out tiles 3, 4, 8, 12, 19, 20, 22 dimmed dark; tile 5 filled #2E6B5C.
5) White bottom sheet with rounded top corners: "박스 선택하기" (bold) + "(1등 확률 4%)" (#B8334F, small), right "8개 구매가능" (gray); a row of slots "5", "28" (pale yellow), "29", "30" (#FFE08A), then dashed empty slots with "+"; a full-width black pill button "다음" (white text).
```

## 여름

### 여름 · 박스구매 홈

```
Follow the chocolatebox DESIGN.md given earlier in this chat (season: 여름). Create a high-fidelity mobile app UI screen, 9:16 portrait (iPhone 390x844 layout), for "chocolatebox", a Korean gift-box shopping app, in its Summer season theme. If a screenshot is attached, keep its exact layout, element sizes and all of its text, and restyle only.

THEME: palette ocean blue, aqua, coral pink, sunny yellow; header #0D7AAE, accent #0E6FA5, CTA #D1441B. Mood: premium, clean and festive but restrained, like a top-tier Korean commerce app's seasonal event skin. Seasonal illustrations are premium 3D renders (Cinema 4D / Octane, glossy and satin materials, soft studio light). Decoration (water droplets, small bubbles, light caustics) stays near edges and never overlaps text. White content areas stay clean.

TEXT: render every Korean string exactly as written inside quotes, crisp sans-serif (Pretendard / Apple SD Gothic Neo style). Do not add, translate or change any text. Keep the 3D gift-box images inside the box cards as they are (only the card border is themed). No watermark, no device frame.

AVOID (AI-slop tells): indigo/violet drift, emoji or emoji-like icons, decorative cards or boxes that the original screen does not have, decorative left accent stripes, a single word recolored or swapped to another font for flair, flat clip-art, generic abstract blobs, dark-mode drift (only the buy screen is dark), season color used outside its role (accent only for prices/active states, CTA color only for the bottom bar, foil only for box-card borders). Keep 60-80% of the screen neutral white/gray, season color concentrated in the header, key visual and CTA.

LAYOUT, top to bottom:
1) Header bar, solid #0D7AAE: white coin chip "P" + "5,000", dark-brown coin "B" + "30 >", white square "%" + "2개 >", right side "초코덕 >" (white text).
2) A delicate garland of water droplets, small bubbles, light caustics hanging just below the header.
3) Main banner card (rounded corners, 16px side margins, about 190px tall): Bright ocean-blue gradient background with sunlight caustics. Premium 3D props on the left (a glossy striped beach ball, a pastel blue-pink popsicle) and on the right (a pink-and-white striped swim ring, a yellow popsicle, a watermelon slice). Centered two-line 3D title "시원한 여름," / "쇼핑의 즐거움!!" in white, both lines the same color (hierarchy from size and weight only), with a white rounded button "포인트샵 바로가기" (#0E6FA5 text) along the bottom of the card.
4) 2x2 grid of box cards (rounded corners) on a light gray page. Each card keeps its 3D gift-box image (pink cube, red gift, purple gift, yellow gift) and a white pill label: "보유수량 : 99개", "남은시간 01:45:15", "보유수량 : 19개", "보유수량 : 39개". Every card gets a thin aqua holographic border with a soft glow; a small 3D glossy striped beach ball hangs on the top-left corner of the first card and the top-right corner of the last card. Under each card a colored label and a dark description: "초콜릿박스" / "12,000원 이상의 상품으로 구성됩니다.", "찬스업 14회" / "100박스 한정! 더 좋은 상품을 받으세요!", "찬스업 프리미엄" / "프리미엄 상품으로 구성된 찬스업 프리미엄", "푸드박스 14회" / "가볍게 즐기는 간식형 푸드박스".
5) White bottom tab bar: "Home", "뉴스룸" (small red dot), "박스구매" (active: #E2F4FD rounded pill, #0E6FA5 icon and text), "내보관함", "앱테크".
```

### 여름 · 포인트샵

```
Follow the chocolatebox DESIGN.md given earlier in this chat (season: 여름). Create a high-fidelity mobile app UI screen, 9:16 portrait (iPhone 390x844 layout), for "chocolatebox", a Korean gift-box shopping app, in its Summer season theme. If a screenshot is attached, keep its exact layout, element sizes and all of its text, and restyle only.

THEME: palette ocean blue, aqua, coral pink, sunny yellow; header #0D7AAE, accent #0E6FA5, CTA #D1441B. Mood: premium, clean and festive but restrained, like a top-tier Korean commerce app's seasonal event skin. Seasonal illustrations are premium 3D renders (Cinema 4D / Octane, glossy and satin materials, soft studio light). Decoration (water droplets, small bubbles, light caustics) stays near edges and never overlaps text. White content areas stay clean.

TEXT: render every Korean string exactly as written inside quotes, crisp sans-serif (Pretendard / Apple SD Gothic Neo style). Do not add, translate or change any text. Keep the 3D gift-box images inside the box cards as they are (only the card border is themed). No watermark, no device frame.

AVOID (AI-slop tells): indigo/violet drift, emoji or emoji-like icons, decorative cards or boxes that the original screen does not have, decorative left accent stripes, a single word recolored or swapped to another font for flair, flat clip-art, generic abstract blobs, dark-mode drift (only the buy screen is dark), season color used outside its role (accent only for prices/active states, CTA color only for the bottom bar, foil only for box-card borders). Keep 60-80% of the screen neutral white/gray, season color concentrated in the header, key visual and CTA.

LAYOUT, top to bottom:
1) White top bar: back arrow, centered "포인트샵", right a black coin "P" + "1,289,050". A thin seasonal garland (water droplets, small bubbles, light caustics) below it.
2) Rounded info box, #E7F6FE background with #0D75A7 text and faint water droplets, small bubbles, light caustics only at its edges: "보유 포인트로 원하는 상품을 선택하여 교환할 수 있습니다." and "(단, 상품권 및 기프티콘은 합산 1인 1일 최대 4개 교환 가능합니다.)"
3) Category row of round icons with labels: "전체" (selected, black circle), "리퍼상품", "기프티콘", "가전", "식품", "뷰티".
4) Rounded search field with a magnifier icon: "상품검색".
5) Sort row: "최신순 ▾" and "전체 1,124개" ("1,124" in #0E6FA5).
6) 2-column product grid, real product photos on light gray rounded tiles: "ThanksQR 적립금 100,000원권" / "재고수량 : 0" / "매진" (blue); "[르비에]대용량 텀블러 1.18L" / "재고수량 : 15" / "30,000 P" (#0E6FA5); the next row (a smartphone, a box of cookies) partly visible.
7) White bottom tab bar: "Home", "뉴스룸" (red dot), "박스구매" (active, #E2F4FD pill), "내보관함", "앱테크".
```

### 여름 · 상품상세

```
Follow the chocolatebox DESIGN.md given earlier in this chat (season: 여름). Create a high-fidelity mobile app UI screen, 9:16 portrait (iPhone 390x844 layout), for "chocolatebox", a Korean gift-box shopping app, in its Summer season theme. If a screenshot is attached, keep its exact layout, element sizes and all of its text, and restyle only.

THEME: palette ocean blue, aqua, coral pink, sunny yellow; header #0D7AAE, accent #0E6FA5, CTA #D1441B. Mood: premium, clean and festive but restrained, like a top-tier Korean commerce app's seasonal event skin. Seasonal illustrations are premium 3D renders (Cinema 4D / Octane, glossy and satin materials, soft studio light). Decoration (water droplets, small bubbles, light caustics) stays near edges and never overlaps text. White content areas stay clean.

TEXT: render every Korean string exactly as written inside quotes, crisp sans-serif (Pretendard / Apple SD Gothic Neo style). Do not add, translate or change any text. Keep the 3D gift-box images inside the box cards as they are (only the card border is themed). No watermark, no device frame.

AVOID (AI-slop tells): indigo/violet drift, emoji or emoji-like icons, decorative cards or boxes that the original screen does not have, decorative left accent stripes, a single word recolored or swapped to another font for flair, flat clip-art, generic abstract blobs, dark-mode drift (only the buy screen is dark), season color used outside its role (accent only for prices/active states, CTA color only for the bottom bar, foil only for box-card borders). Keep 60-80% of the screen neutral white/gray, season color concentrated in the header, key visual and CTA.

LAYOUT, top to bottom:
1) Full-width product hero photo (black-and-white photo of a Celine bag on an antique carved table) with a back arrow. Keep the photo itself untouched; only a small seasonal accent (water droplets, small bubbles, light caustics) in its bottom-right corner.
2) Title: "[품절]" in #0E6FA5 followed by "[셀린느] 미디움 베사체 트리옹프 서플 내추럴 카프스킨 블랙".
3) Price, bold: "₩ 2,850,000".
4) Two tabs: "상품상세" (active, dark underline) and "상품 리뷰".
5) Light gray rounded notice box: "- NOTICE -" (bold) and "위 상품의 가격은 판촉을 위한 마케팅 목적의 참고값으로, 실제 앱 내 구매 시 적용되는 가격이 아닙니다. 해당 가격은 손해배상 기준이나 상품 환급과는 관련이 없으니 참고해 주시기 바랍니다."
6) Product detail image area (navy watch strap photo) partly visible.
7) Fixed bottom CTA bar, solid #D1441B with a subtle gloss, a small 3D glossy striped beach ball to the left of the white bold text "CHOCOLATE BOX 뽑기".
```

### 여름 · 뉴스룸

```
Follow the chocolatebox DESIGN.md given earlier in this chat (season: 여름). Create a high-fidelity mobile app UI screen, 9:16 portrait (iPhone 390x844 layout), for "chocolatebox", a Korean gift-box shopping app, in its Summer season theme. If a screenshot is attached, keep its exact layout, element sizes and all of its text, and restyle only.

THEME: palette ocean blue, aqua, coral pink, sunny yellow; header #0D7AAE, accent #0E6FA5, CTA #D1441B. Mood: premium, clean and festive but restrained, like a top-tier Korean commerce app's seasonal event skin. Seasonal illustrations are premium 3D renders (Cinema 4D / Octane, glossy and satin materials, soft studio light). Decoration (water droplets, small bubbles, light caustics) stays near edges and never overlaps text. White content areas stay clean.

TEXT: render every Korean string exactly as written inside quotes, crisp sans-serif (Pretendard / Apple SD Gothic Neo style). Do not add, translate or change any text. Keep the 3D gift-box images inside the box cards as they are (only the card border is themed). No watermark, no device frame.

AVOID (AI-slop tells): indigo/violet drift, emoji or emoji-like icons, decorative cards or boxes that the original screen does not have, decorative left accent stripes, a single word recolored or swapped to another font for flair, flat clip-art, generic abstract blobs, dark-mode drift (only the buy screen is dark), season color used outside its role (accent only for prices/active states, CTA color only for the bottom bar, foil only for box-card borders). Keep 60-80% of the screen neutral white/gray, season color concentrated in the header, key visual and CTA.

LAYOUT, top to bottom:
1) White top bar with centered "뉴스룸"; a thin seasonal garland (water droplets, small bubbles, light caustics) below it.
2) Tabs: "구매내역" (active, bold, dark underline), "명예의전당", "리뷰(82)", "상품목록" (small red dot).
3) Horizontal carousel of large rounded cards: the center card is solid #0E7FB5 with a white organic blob holding a blender product photo, and white text "마마님 구매완료", "[브레빌] 블렌더프레시 엔 퓨이어스" (bold), "정가350,000원"; neighbor cards (#E4572E, #1FA37A) peek in from both sides; faint water droplets, small bubbles, light caustics on the card corners.
4) Page dots, the first one a long dark pill.
5) Heading "실시간 구매 내역".
6) Purchase rows: the first row filled #0E6FA5 with white text: product thumbnail, "마마님 구매완료", "[셀린느] 미디움 베사체 트리옹프 서플 내추럴 카프스킨 블랙", "₩5,850,000", "방금 전"; the second row white with a light outline: same product, "24,000", "방금 전".
7) Below, partly visible: mission banner card (#D1441B) with a 3D glossy striped beach ball on the right, white bold "서머 초코미션빙고" and a white button "미션 확인".
8) White bottom tab bar, "뉴스룸" active (#E2F4FD pill).
```

### 여름 · 구매하기

```
Follow the chocolatebox DESIGN.md given earlier in this chat (season: 여름). Create a high-fidelity mobile app UI screen, 9:16 portrait (iPhone 390x844 layout), for "chocolatebox", a Korean gift-box shopping app, in its Summer season theme. If a screenshot is attached, keep its exact layout, element sizes and all of its text, and restyle only.

THEME: palette ocean blue, aqua, coral pink, sunny yellow; header #0D7AAE, accent #0E6FA5, CTA #D1441B. Mood: premium, clean and festive but restrained, like a top-tier Korean commerce app's seasonal event skin. Seasonal illustrations are premium 3D renders (Cinema 4D / Octane, glossy and satin materials, soft studio light). Decoration (water droplets, small bubbles, light caustics) stays near edges and never overlaps text. White content areas stay clean.

TEXT: render every Korean string exactly as written inside quotes, crisp sans-serif (Pretendard / Apple SD Gothic Neo style). Do not add, translate or change any text. Keep the 3D gift-box images inside the box cards as they are (only the card border is themed). No watermark, no device frame.

AVOID (AI-slop tells): indigo/violet drift, emoji or emoji-like icons, decorative cards or boxes that the original screen does not have, decorative left accent stripes, a single word recolored or swapped to another font for flair, flat clip-art, generic abstract blobs, dark-mode drift (only the buy screen is dark), season color used outside its role (accent only for prices/active states, CTA color only for the bottom bar, foil only for box-card borders). Keep 60-80% of the screen neutral white/gray, season color concentrated in the header, key visual and CTA.

LAYOUT, top to bottom (dark, game-like screen with a vertical gradient #06284A to #0E5A8C):
1) Top bar: white close X, centered "2회차 구매하기", right a dark-brown coin "B" + "240" (lavender text).
2) Seasonal garland (water droplets, small bubbles, light caustics) below the top bar.
3) Hero stage, about 200px tall: radiating light rays and a glowing elliptical floor spotlight (#7AD8F0); premium 3D props at the far left and far right (a glossy striped beach ball, a pastel blue-pink popsicle; a pink-and-white striped swim ring, a yellow popsicle, a watermelon slice); centered big italic 3D title "CHANCE" / "PREMIUM" in glossy gold with a thick dark outline, a small white rounded badge "UP" between the two words; subtitle "찬스업 프리미엄 박스" (white, bold).
4) 5-column grid of rounded number tiles "1" to "25" (more rows continue below): available tiles #1A78B8 with a lighter top gradient and white numbers; sold-out tiles 3, 4, 8, 12, 19, 20, 22 dimmed dark; tile 5 filled #0E7A6A.
5) White bottom sheet with rounded top corners: "박스 선택하기" (bold) + "(1등 확률 4%)" (#0E6FA5, small), right "8개 구매가능" (gray); a row of slots "5", "28" (pale yellow), "29", "30" (#FFE45C), then dashed empty slots with "+"; a full-width black pill button "다음" (white text).
```

## 가을

### 가을 · 박스구매 홈

```
Follow the chocolatebox DESIGN.md given earlier in this chat (season: 가을). Create a high-fidelity mobile app UI screen, 9:16 portrait (iPhone 390x844 layout), for "chocolatebox", a Korean gift-box shopping app, in its Autumn season theme. If a screenshot is attached, keep its exact layout, element sizes and all of its text, and restyle only.

THEME: palette burnt orange, maple red, mustard yellow, warm brown; header #B5561F, accent #B5481A, CTA #7A3E16. Mood: premium, clean and festive but restrained, like a top-tier Korean commerce app's seasonal event skin. Seasonal illustrations are premium 3D renders (Cinema 4D / Octane, glossy and satin materials, soft studio light). Decoration (falling maple leaves, small acorns) stays near edges and never overlaps text. White content areas stay clean.

TEXT: render every Korean string exactly as written inside quotes, crisp sans-serif (Pretendard / Apple SD Gothic Neo style). Do not add, translate or change any text. Keep the 3D gift-box images inside the box cards as they are (only the card border is themed). No watermark, no device frame.

AVOID (AI-slop tells): indigo/violet drift, emoji or emoji-like icons, decorative cards or boxes that the original screen does not have, decorative left accent stripes, a single word recolored or swapped to another font for flair, flat clip-art, generic abstract blobs, dark-mode drift (only the buy screen is dark), season color used outside its role (accent only for prices/active states, CTA color only for the bottom bar, foil only for box-card borders). Keep 60-80% of the screen neutral white/gray, season color concentrated in the header, key visual and CTA.

LAYOUT, top to bottom:
1) Header bar, solid #B5561F: white coin chip "P" + "5,000", dark-brown coin "B" + "30 >", white square "%" + "2개 >", right side "초코덕 >" (white text).
2) A delicate garland of falling maple leaves, small acorns hanging just below the header.
3) Main banner card (rounded corners, 16px side margins, about 190px tall): Warm burnt-orange to brown background with a golden afternoon glow. Premium 3D props on the left (a large red maple leaf, a yellow maple leaf, acorns) and on the right (a glossy Korean persimmon with green calyx, an orange maple leaf, a small acorn). Centered two-line 3D title "가을 맞이" / "쇼핑의 즐거움!!" in white, both lines the same color (hierarchy from size and weight only), with a white rounded button "포인트샵 바로가기" (#B5481A text) along the bottom of the card.
4) 2x2 grid of box cards (rounded corners) on a light gray page. Each card keeps its 3D gift-box image (pink cube, red gift, purple gift, yellow gift) and a white pill label: "보유수량 : 99개", "남은시간 01:45:15", "보유수량 : 19개", "보유수량 : 39개". Every card gets a thin copper foil border with a soft glow; a small 3D glossy red maple leaf hangs on the top-left corner of the first card and the top-right corner of the last card. Under each card a colored label and a dark description: "초콜릿박스" / "12,000원 이상의 상품으로 구성됩니다.", "찬스업 14회" / "100박스 한정! 더 좋은 상품을 받으세요!", "찬스업 프리미엄" / "프리미엄 상품으로 구성된 찬스업 프리미엄", "푸드박스 14회" / "가볍게 즐기는 간식형 푸드박스".
5) White bottom tab bar: "Home", "뉴스룸" (small red dot), "박스구매" (active: #FDEAE2 rounded pill, #B5481A icon and text), "내보관함", "앱테크".
```

### 가을 · 포인트샵

```
Follow the chocolatebox DESIGN.md given earlier in this chat (season: 가을). Create a high-fidelity mobile app UI screen, 9:16 portrait (iPhone 390x844 layout), for "chocolatebox", a Korean gift-box shopping app, in its Autumn season theme. If a screenshot is attached, keep its exact layout, element sizes and all of its text, and restyle only.

THEME: palette burnt orange, maple red, mustard yellow, warm brown; header #B5561F, accent #B5481A, CTA #7A3E16. Mood: premium, clean and festive but restrained, like a top-tier Korean commerce app's seasonal event skin. Seasonal illustrations are premium 3D renders (Cinema 4D / Octane, glossy and satin materials, soft studio light). Decoration (falling maple leaves, small acorns) stays near edges and never overlaps text. White content areas stay clean.

TEXT: render every Korean string exactly as written inside quotes, crisp sans-serif (Pretendard / Apple SD Gothic Neo style). Do not add, translate or change any text. Keep the 3D gift-box images inside the box cards as they are (only the card border is themed). No watermark, no device frame.

AVOID (AI-slop tells): indigo/violet drift, emoji or emoji-like icons, decorative cards or boxes that the original screen does not have, decorative left accent stripes, a single word recolored or swapped to another font for flair, flat clip-art, generic abstract blobs, dark-mode drift (only the buy screen is dark), season color used outside its role (accent only for prices/active states, CTA color only for the bottom bar, foil only for box-card borders). Keep 60-80% of the screen neutral white/gray, season color concentrated in the header, key visual and CTA.

LAYOUT, top to bottom:
1) White top bar: back arrow, centered "포인트샵", right a black coin "P" + "1,289,050". A thin seasonal garland (falling maple leaves, small acorns) below it.
2) Rounded info box, #FEEFE7 background with #AE531E text and faint falling maple leaves, small acorns only at its edges: "보유 포인트로 원하는 상품을 선택하여 교환할 수 있습니다." and "(단, 상품권 및 기프티콘은 합산 1인 1일 최대 4개 교환 가능합니다.)"
3) Category row of round icons with labels: "전체" (selected, black circle), "리퍼상품", "기프티콘", "가전", "식품", "뷰티".
4) Rounded search field with a magnifier icon: "상품검색".
5) Sort row: "최신순 ▾" and "전체 1,124개" ("1,124" in #B5481A).
6) 2-column product grid, real product photos on light gray rounded tiles: "ThanksQR 적립금 100,000원권" / "재고수량 : 0" / "매진" (blue); "[르비에]대용량 텀블러 1.18L" / "재고수량 : 15" / "30,000 P" (#B5481A); the next row (a smartphone, a box of cookies) partly visible.
7) White bottom tab bar: "Home", "뉴스룸" (red dot), "박스구매" (active, #FDEAE2 pill), "내보관함", "앱테크".
```

### 가을 · 상품상세

```
Follow the chocolatebox DESIGN.md given earlier in this chat (season: 가을). Create a high-fidelity mobile app UI screen, 9:16 portrait (iPhone 390x844 layout), for "chocolatebox", a Korean gift-box shopping app, in its Autumn season theme. If a screenshot is attached, keep its exact layout, element sizes and all of its text, and restyle only.

THEME: palette burnt orange, maple red, mustard yellow, warm brown; header #B5561F, accent #B5481A, CTA #7A3E16. Mood: premium, clean and festive but restrained, like a top-tier Korean commerce app's seasonal event skin. Seasonal illustrations are premium 3D renders (Cinema 4D / Octane, glossy and satin materials, soft studio light). Decoration (falling maple leaves, small acorns) stays near edges and never overlaps text. White content areas stay clean.

TEXT: render every Korean string exactly as written inside quotes, crisp sans-serif (Pretendard / Apple SD Gothic Neo style). Do not add, translate or change any text. Keep the 3D gift-box images inside the box cards as they are (only the card border is themed). No watermark, no device frame.

AVOID (AI-slop tells): indigo/violet drift, emoji or emoji-like icons, decorative cards or boxes that the original screen does not have, decorative left accent stripes, a single word recolored or swapped to another font for flair, flat clip-art, generic abstract blobs, dark-mode drift (only the buy screen is dark), season color used outside its role (accent only for prices/active states, CTA color only for the bottom bar, foil only for box-card borders). Keep 60-80% of the screen neutral white/gray, season color concentrated in the header, key visual and CTA.

LAYOUT, top to bottom:
1) Full-width product hero photo (black-and-white photo of a Celine bag on an antique carved table) with a back arrow. Keep the photo itself untouched; only a small seasonal accent (falling maple leaves, small acorns) in its bottom-right corner.
2) Title: "[품절]" in #B5481A followed by "[셀린느] 미디움 베사체 트리옹프 서플 내추럴 카프스킨 블랙".
3) Price, bold: "₩ 2,850,000".
4) Two tabs: "상품상세" (active, dark underline) and "상품 리뷰".
5) Light gray rounded notice box: "- NOTICE -" (bold) and "위 상품의 가격은 판촉을 위한 마케팅 목적의 참고값으로, 실제 앱 내 구매 시 적용되는 가격이 아닙니다. 해당 가격은 손해배상 기준이나 상품 환급과는 관련이 없으니 참고해 주시기 바랍니다."
6) Product detail image area (navy watch strap photo) partly visible.
7) Fixed bottom CTA bar, solid #7A3E16 with a subtle gloss, a small 3D glossy red maple leaf to the left of the white bold text "CHOCOLATE BOX 뽑기".
```

### 가을 · 뉴스룸

```
Follow the chocolatebox DESIGN.md given earlier in this chat (season: 가을). Create a high-fidelity mobile app UI screen, 9:16 portrait (iPhone 390x844 layout), for "chocolatebox", a Korean gift-box shopping app, in its Autumn season theme. If a screenshot is attached, keep its exact layout, element sizes and all of its text, and restyle only.

THEME: palette burnt orange, maple red, mustard yellow, warm brown; header #B5561F, accent #B5481A, CTA #7A3E16. Mood: premium, clean and festive but restrained, like a top-tier Korean commerce app's seasonal event skin. Seasonal illustrations are premium 3D renders (Cinema 4D / Octane, glossy and satin materials, soft studio light). Decoration (falling maple leaves, small acorns) stays near edges and never overlaps text. White content areas stay clean.

TEXT: render every Korean string exactly as written inside quotes, crisp sans-serif (Pretendard / Apple SD Gothic Neo style). Do not add, translate or change any text. Keep the 3D gift-box images inside the box cards as they are (only the card border is themed). No watermark, no device frame.

AVOID (AI-slop tells): indigo/violet drift, emoji or emoji-like icons, decorative cards or boxes that the original screen does not have, decorative left accent stripes, a single word recolored or swapped to another font for flair, flat clip-art, generic abstract blobs, dark-mode drift (only the buy screen is dark), season color used outside its role (accent only for prices/active states, CTA color only for the bottom bar, foil only for box-card borders). Keep 60-80% of the screen neutral white/gray, season color concentrated in the header, key visual and CTA.

LAYOUT, top to bottom:
1) White top bar with centered "뉴스룸"; a thin seasonal garland (falling maple leaves, small acorns) below it.
2) Tabs: "구매내역" (active, bold, dark underline), "명예의전당", "리뷰(82)", "상품목록" (small red dot).
3) Horizontal carousel of large rounded cards: the center card is solid #B5561F with a white organic blob holding a blender product photo, and white text "마마님 구매완료", "[브레빌] 블렌더프레시 엔 퓨이어스" (bold), "정가350,000원"; neighbor cards (#7A5A12, #A6361E) peek in from both sides; faint falling maple leaves, small acorns on the card corners.
4) Page dots, the first one a long dark pill.
5) Heading "실시간 구매 내역".
6) Purchase rows: the first row filled #B5481A with white text: product thumbnail, "마마님 구매완료", "[셀린느] 미디움 베사체 트리옹프 서플 내추럴 카프스킨 블랙", "₩5,850,000", "방금 전"; the second row white with a light outline: same product, "24,000", "방금 전".
7) Below, partly visible: mission banner card (#A6361E) with a 3D glossy red maple leaf on the right, white bold "가을 초코미션빙고" and a white button "미션 확인".
8) White bottom tab bar, "뉴스룸" active (#FDEAE2 pill).
```

### 가을 · 구매하기

```
Follow the chocolatebox DESIGN.md given earlier in this chat (season: 가을). Create a high-fidelity mobile app UI screen, 9:16 portrait (iPhone 390x844 layout), for "chocolatebox", a Korean gift-box shopping app, in its Autumn season theme. If a screenshot is attached, keep its exact layout, element sizes and all of its text, and restyle only.

THEME: palette burnt orange, maple red, mustard yellow, warm brown; header #B5561F, accent #B5481A, CTA #7A3E16. Mood: premium, clean and festive but restrained, like a top-tier Korean commerce app's seasonal event skin. Seasonal illustrations are premium 3D renders (Cinema 4D / Octane, glossy and satin materials, soft studio light). Decoration (falling maple leaves, small acorns) stays near edges and never overlaps text. White content areas stay clean.

TEXT: render every Korean string exactly as written inside quotes, crisp sans-serif (Pretendard / Apple SD Gothic Neo style). Do not add, translate or change any text. Keep the 3D gift-box images inside the box cards as they are (only the card border is themed). No watermark, no device frame.

AVOID (AI-slop tells): indigo/violet drift, emoji or emoji-like icons, decorative cards or boxes that the original screen does not have, decorative left accent stripes, a single word recolored or swapped to another font for flair, flat clip-art, generic abstract blobs, dark-mode drift (only the buy screen is dark), season color used outside its role (accent only for prices/active states, CTA color only for the bottom bar, foil only for box-card borders). Keep 60-80% of the screen neutral white/gray, season color concentrated in the header, key visual and CTA.

LAYOUT, top to bottom (dark, game-like screen with a vertical gradient #2A1208 to #6B2E14):
1) Top bar: white close X, centered "2회차 구매하기", right a dark-brown coin "B" + "240" (lavender text).
2) Seasonal garland (falling maple leaves, small acorns) below the top bar.
3) Hero stage, about 200px tall: radiating light rays and a glowing elliptical floor spotlight (#F2A65A); premium 3D props at the far left and far right (a large red maple leaf, a yellow maple leaf, acorns; a glossy Korean persimmon with green calyx, an orange maple leaf, a small acorn); centered big italic 3D title "CHANCE" / "PREMIUM" in glossy gold with a thick dark outline, a small white rounded badge "UP" between the two words; subtitle "찬스업 프리미엄 박스" (white, bold).
4) 5-column grid of rounded number tiles "1" to "25" (more rows continue below): available tiles #9A4A22 with a lighter top gradient and white numbers; sold-out tiles 3, 4, 8, 12, 19, 20, 22 dimmed dark; tile 5 filled #5C5A1E.
5) White bottom sheet with rounded top corners: "박스 선택하기" (bold) + "(1등 확률 4%)" (#B5481A, small), right "8개 구매가능" (gray); a row of slots "5", "28" (pale yellow), "29", "30" (#FFC247), then dashed empty slots with "+"; a full-width black pill button "다음" (white text).
```
