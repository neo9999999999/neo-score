#!/usr/bin/env node
/**
 * 카카오 '나에게 보내기'(메모 API)로 데일리 마켓리포트 요약 발송.
 *
 * 환경변수(저장소 Secrets):
 *   KAKAO_REST_API_KEY   카카오 개발자 앱 REST API 키
 *   KAKAO_REFRESH_TOKEN  사용자 리프레시 토큰(talk_message 동의 필요)
 *   SITE_URL             리포트 링크 (기본 https://neo-score.vercel.app)
 *
 * 토큰이 없으면 아무것도 하지 않고 정상 종료(워크플로를 깨지 않음).
 * access_token은 refresh_token으로 매 실행 시 갱신한다(만료 6시간).
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = process.env.SITE_URL || "https://neo-score.vercel.app";

async function main() {
  const restKey = process.env.KAKAO_REST_API_KEY;
  const refresh = process.env.KAKAO_REFRESH_TOKEN;
  if (!restKey || !refresh) {
    console.log("[kakao] KAKAO_REST_API_KEY/KAKAO_REFRESH_TOKEN 미설정 — 발송 건너뜀(앱 업데이트만 사용).");
    return;
  }

  let rep;
  try { rep = JSON.parse(await readFile(join(ROOT, "public", "market-report.json"), "utf8")); }
  catch { console.error("[kakao] market-report.json 없음"); return; }

  const sent = { bullish: "📈 강세 우호", neutral: "⚖️ 중립·혼조", bearish: "📉 약세 경계" }[rep.sentiment] || "";
  const topSectors = (rep.sectors || []).slice(0, 3).map(s => s.name).join(", ");
  let text = `📊 ${rep.date} 마켓리포트  ${sent}\n\n${rep.summary || ""}`;
  if (topSectors) text += `\n\n🎯 상승 예상 섹터: ${topSectors}`;
  if (text.length > 190) text = text.slice(0, 187) + "…"; // 카카오 텍스트 제한

  // 1) access_token 갱신
  const tokRes = await fetch("https://kauth.kakao.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
    body: new URLSearchParams({ grant_type: "refresh_token", client_id: restKey, refresh_token: refresh }),
  });
  const tok = await tokRes.json();
  if (!tok.access_token) { console.error("[kakao] 토큰 갱신 실패:", JSON.stringify(tok)); process.exit(1); }

  // 2) 나에게 보내기 (텍스트 템플릿)
  const template = { object_type: "text", text, link: { web_url: SITE, mobile_web_url: SITE }, button_title: "리포트 보기" };
  const sendRes = await fetch("https://kapi.kakao.com/v2/api/talk/memo/default/send", {
    method: "POST",
    headers: { Authorization: "Bearer " + tok.access_token, "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
    body: new URLSearchParams({ template_object: JSON.stringify(template) }),
  });
  const result = await sendRes.json();
  if (result.result_code === 0) console.log("[kakao] 발송 성공:", rep.date);
  else { console.error("[kakao] 발송 실패:", JSON.stringify(result)); process.exit(1); }
}

main().catch(e => { console.error("[kakao] 오류:", e); process.exit(1); });
