#!/usr/bin/env node
/**
 * ⭐R96g1ak 发版就绪守卫：npm publish 成功 ≠ 全球 CDN 可见。
 *
 * 实测（⭐2026-11-02）：npm publish 后 registry.npmjs.org 传播约 5 分钟、
 * data.jsdelivr 约 10 分钟才显示新版本。发版侧 registry 一确认就宣布「发版完成」，
 * 用户在传播真空窗内问「栗子在吗」，宿主查网拿到的是「当时真值」旧版，
 * up-to-date 结论被 30min 节流缓存锁死 → 「栗子在吗仍全最新」假象（用户实报）。
 *
 * 本脚本把「发版完成」的验收标准从 registry 确认升级为 CDN 就绪：
 * publish 后轮询 data.jsdelivr（宿主版本发现链第一源，国内秒回、分钟级新鲜），
 * 直到 tags.latest == 本包版本才退出 0；上限 10 分钟未就绪退出 1 并给人工核查链接。
 *
 * 用法：cd agent-deploy && npm publish && npm run publish-ready
 */
import { readFileSync } from "node:fs";

const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8"));
const target = pkg.version;
const DEADLINE_MS = 10 * 60 * 1000;
const POLL_MS = 10_000;
const t0 = Date.now();

async function fetchLatestTag() {
  const r = await fetch("https://data.jsdelivr.com/v1/packages/npm/leadsradar-agent", {
    headers: { "Cache-Control": "no-cache" },
    signal: AbortSignal.timeout(15_000),
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return (await r.json())?.tags?.latest ?? "";
}

while (Date.now() - t0 < DEADLINE_MS) {
  try {
    const latest = await fetchLatestTag();
    if (latest === target) {
      const s = Math.round((Date.now() - t0) / 1000);
      console.log(`✅ CDN 就绪：data.jsdelivr latest = ${target}（等待 ${s}s）——宿主侧「栗子在吗」即刻可拉到新版`);
      process.exit(0);
    }
    console.log(`… data.jsdelivr latest = ${latest || "(空)"}，${POLL_MS / 1000}s 后重查（目标 ${target}）`);
  } catch (e) {
    console.log(`… 查询失败（${String(e?.message || e).slice(0, 80)}），${POLL_MS / 1000}s 后重试`);
  }
  await new Promise((ok) => setTimeout(ok, POLL_MS));
}

console.error(`❌ ${DEADLINE_MS / 60000}min 未就绪（目标 ${target}）——人工核查：https://www.jsdelivr.com/package/npm/leadsradar-agent`);
process.exit(1);
