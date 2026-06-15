# 데일리 마켓 리포트 (마켓리포트 탭)

유가 · 달러 · 환율 · 금리 등 거시지표의 **연결관계**를 따라 간밤 나스닥 반응을
해석하고, 그에 따른 **국내증시 방향성 + 상승 예상 섹터/수혜 종목**을 매일 장 시작
전(오전 7시 이전)에 리포트로 제공한다.

## 구성

| 요소 | 경로 | 역할 |
| --- | --- | --- |
| 생성 스크립트 | `scripts/generate-market-report.mjs` | 지표 수집 → LLM 분석 → JSON 생성 |
| 스케줄러 | `.github/workflows/market-report.yml` | 매일 05:30 KST(20:30 UTC) 실행·커밋 |
| 데이터 | `public/market-report.json` | 프론트가 읽는 리포트 |
| 화면 | `src/MarketReportHelpers.jsx` | 요약 → 터치 시 상세, 연결고리, 섹터·종목, 카드뉴스 |

## 동작 흐름

1. GitHub Action 이 매일 **05:30 KST** 에 스크립트를 실행 (간밤 미국장 마감 반영).
2. 스크립트가 Stooq(키 불필요)에서 나스닥·S&P500·WTI·달러인덱스·원달러·미10년물을 수집.
3. Claude 로 연결관계 분석 → 요약/상세/섹터/수혜종목/카드뉴스 JSON 생성.
   - 종목명은 `data/stocks.json` 으로 종목코드를 자동 매핑.
4. `public/market-report.json` 을 커밋 → Vercel 재배포 → 앱 "마켓리포트" 탭에 노출.
5. 어떤 단계가 실패해도 **룰 기반 폴백**으로 리포트는 항상 생성된다.

## LLM 분석 활성화 (선택)

기본은 sector-api 프록시(`/api/analyze`)로 동작하지만, 더 높은 품질을 원하면
저장소 시크릿을 설정한다.

- **Settings → Secrets and variables → Actions**
  - Secret `ANTHROPIC_API_KEY` : Anthropic API 키 (설정 시 api.anthropic.com 직접 호출)
  - Variable `ANTHROPIC_MODEL` : 모델 ID (선택, 기본 `claude-sonnet-4-6`)

## 수동 실행 / 테스트

```bash
# 로컬에서 즉시 생성 (네트워크 필요)
node scripts/generate-market-report.mjs

# GitHub 에서 수동 실행: Actions → Daily Market Report → Run workflow
```

## 오후 리포트 (익일 상승 예측)

매일 **15:00 KST**(장 마감 직전)에 미 선물지수(NQ/ES/YM·VIX)와 금리·환율·유가,
당일 코스피/코스닥 흐름 + **거래대금 상위 ~500종목**의 당일 주가/거래량을 분석해
**익일 연속 상승 가능성이 높은 종목**을 정량 스코어링·선정한다.

| 요소 | 경로 |
| --- | --- |
| 생성 | `scripts/generate-afternoon-report.mjs` (워크플로 `afternoon-report.yml`, cron 06:00 UTC) |
| OOS 백필 | `scripts/backfill-afternoon-reports.mjs` (워크플로 `afternoon-backfill.yml`, 수동) |
| 공용 로직 | `scripts/lib/stock-core.mjs` (Yahoo OHLCV, 스코어링) |
| 데이터 | `public/afternoon-report.json`, `public/afternoon-history.json`, `public/afternoon/*.json` |
| 화면 | 마켓리포트 탭 → "익일예측" |

스코어: 종가 위치(고가권) + 거래량 급증 + 당일 등락 + 5·20일선 정배열 + 갭, 미 선물
방향 보정. OOS 백필은 각 거래일 선정 종목의 **실제 익일 등락**으로 적중률·초과수익(edge)을 검증한다.

## 카카오 '나에게 보내기' 발송 (08:00 KST)

매일 새벽 리포트가 생성되어 **앱에 자동 업데이트**된다. 추가로 **매일 08:00 KST**에
카카오톡으로 요약을 받으려면 시크릿만 설정하면 된다(미설정 시 발송은 건너뜀).

- 스크립트: `scripts/send-kakao.mjs` · 워크플로: `kakao-send.yml`(cron 23:00 UTC = 08:00 KST)
- 발송 내용: 날짜·센티먼트·요약·상승 예상 섹터 + 사이트 링크 버튼

### 설정 방법 (추후)
1. [카카오 개발자](https://developers.kakao.com) 앱 생성 → **REST API 키** 확보.
2. 카카오 로그인 동의항목에 **`talk_message`(카카오톡 메시지 전송)** 추가.
3. 본인 계정으로 OAuth 인가 → **refresh_token** 발급(나에게 보내기는 본인 토큰이면 충분).
4. 저장소 **Settings → Secrets and variables → Actions** 에 추가:
   - Secret `KAKAO_REST_API_KEY`
   - Secret `KAKAO_REFRESH_TOKEN`
   - Variable `SITE_URL` (선택, 리포트 링크 주소)
5. 설정 후 자동으로 매일 08:00 KST 발송. 즉시 테스트는 Actions → *Kakao Daily Send* → Run workflow.

### 다른 채널
이메일(Resend/SendGrid)·텔레그램·FCM도 동일하게 워크플로 마지막 단계에 추가 가능.
