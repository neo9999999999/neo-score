"""Writes prompts.md (copy-paste prompts for the Gemini app) from prompts_data.py."""
import os
from prompts_data import SEASONS, SLOTS, prompt

HERE = os.path.dirname(os.path.abspath(__file__))
out = ['# Gemini 프롬프트 — chocolatebox 시즌 이미지 전체', '',
       '배너뿐 아니라 서비스 화면 전체와 화면 안의 이미지 자리 9곳을 시즌별로 만드는 프롬프트입니다.', '',
       '## 사용법', '',
       '1. **화면 전체 리디자인**: Gemini에 원본 화면 스크린샷 1장을 첨부하고, 아래 해당 시즌의 「화면 전체 리디자인」 프롬프트를 붙여넣습니다. '
       '화면 5개(박스구매 홈, 포인트샵, 상품상세, 뉴스룸, 구매하기)에 같은 프롬프트를 각각 씁니다. 한글 글자가 깨지면 그 부분은 제가 원본 글자로 다시 얹습니다.',
       '2. **이미지 자리별 소재**: 첨부 없이 프롬프트만 붙여넣습니다. 글자 없이 생성되며 타이틀과 버튼은 제가 합성합니다.',
       '3. 결과 이미지는 이 대화에 올리거나 Google Drive 폴더에 넣고 폴더 이름을 알려주세요.', '',
       '| 자리 | 쓰이는 곳 | 비율 |', '| --- | --- | --- |']
out += [f'| {v[0]} | {v[1]} | {v[2]} |' for v in SLOTS.values()]
out.append('')
for sk, s in SEASONS.items():
    out += [f'## {s["ko"]}', '']
    for k, v in SLOTS.items():
        out += [f'### {v[0]} · {v[2]}', '', '```', prompt(sk, k), '```', '']
open(os.path.join(HERE, 'prompts.md'), 'w').write('\n'.join(out))
print('prompts.md', sum(1 for _ in SEASONS) * len(SLOTS), 'prompts')
