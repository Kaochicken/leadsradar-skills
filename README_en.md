# LeadsRadar Agent

English | [中文](README.md)

![version](https://img.shields.io/badge/version-1.0.0-E63946) ![hosts](https://img.shields.io/badge/hosts-WorkBuddy%20%7C%20Doubao%20%7C%20Qwen%20Office%20%7C%20Trae%20%7C%20DeepSeek-3B82F6) ![platform](https://img.shields.io/badge/platform-Xiaohongshu%20%7C%20Douyin-8A8A8C)

> Turn your AI assistant into a remote pilot for the LeadsRadar lead-gen extension — **one sentence from your phone, the browser extension on your PC does the legwork.**

```
Your phone (Doubao / WorkBuddy app)
   │  ① "Any customer leads in this post's comments?"
   ▼
AI assistant on your PC (host, adapter from this repo)
   │  ② STDIO MCP calls LeadsRadar tools
   ▼
LeadsRadar Chrome extension (all data collected inside your own browser)
   │  ③ Results flow back → AI turns them into plain language
   ▼
Your phone (lead report / patrol digest / topic card)
```

> **Not standalone**: requires the [LeadsRadar browser extension](https://leadsradar.cn), plus a one-time pairing approval in the extension. Everything runs on your machine — collected data never leaves your browser.

## Try saying

- **"Check this post's comments for customer leads"** — paste a Xiaohongshu/Douyin link, get a four-tier lead report: 🟢 ready-to-buy, 🟠 interested, 🟡 in-need, ⚪ noise — including who to follow up first.
- **"Patrol my benchmark accounts — anyone gone viral?"** — get a digest: who updated, who blew up (and why), whose posting rhythm shifted.
- **"Extract the copy from this post and save it as a topic"** — get 3 title-hook variants + full script + a topic card.
- **"Is there still room in the 'home-renovation leads' niche?"** — get a niche brief: competition level, top-player patterns, 3 gap topics.

## Official Skills

Each skill is a `SKILL.md` you drop into your host's skill/instruction library:

| Skill | One-liner | Status |
|---|---|---|
| **[Quick Research](skills/leadsradar-research/)** | Send a link / keyword / screenshot, get customer leads & niche insights instantly | ✅ |
| **[Asset Butler](skills/leadsradar-assets/)** | Send a post link + one sentence — save topic, download media, extract copy | ✅ |
| **[Benchmark Patrol](skills/leadsradar-patrol/)** | Scan benchmark accounts — who updated, who went viral | ✅ |
| **[Data Q&A](skills/leadsradar-insights/)** | Just ask: topic library, posts, accounts, comments, research reports | ✅ |

## 3-minute setup

1. **Install the LeadsRadar extension** from [leadsradar.cn](https://leadsradar.cn) and sign in.
2. **Feed the adapter to your AI assistant**
   - **WorkBuddy / Doubao Work (recommended, fully automated)**: open the extension's *Settings → Agent takeover*, pick your host, click "one-click copy prompt", paste it to your AI. The only manual step: verify the device fingerprint in the extension and click *Approve*.
   - **Trae (one-click import)**: open the deep link below in your browser — Trae launches with the config pre-filled (uses [`leadsradar-agent`](https://www.npmjs.com/package/leadsradar-agent) from npm; mainland China builds use the `trae-cn://` prefix):
     ```
     trae://trae.ai-ide/mcp-import?type=stdio&name=leadsradar&config=eyJtY3BTZXJ2ZXJzIjp7ImxlYWRzcmFkYXIiOnsiY29tbWFuZCI6Im5weCIsImFyZ3MiOlsiLXkiLCJsZWFkc3JhZGFyLWFnZW50Il0sImVudiI6eyJMRUFEU1JBREFSX0FHRU5UX0hPU1QiOiJ0cmFlIn19fX0%3D
     ```
   - **DeepSeek (DSH plugin)**: `dsh plugin add leadsradar-dsh-plugin` — published on [npm](https://www.npmjs.com/package/leadsradar-dsh-plugin). Then say "check LeadsRadar connection" and approve the pairing in the extension.
   - **Qwen Office (STDIO connector)**: left sidebar → *Connectors → Add* → paste this JSON:
     ```json
     {
       "mcpServers": {
         "leadsradar": {
           "command": "npx",
           "args": ["-y", "leadsradar-agent"],
           "env": { "LEADSRADAR_AGENT_HOST": "qwen-office" }
         }
       }
     }
     ```
   - **Any other STDIO MCP host (manual)**: command `node`, args = absolute path to `leadsradar-agent.mjs` (or just `npx -y leadsradar-agent`), env `LEADSRADAR_AGENT_HOST` = your host id. Then say "check LeadsRadar connection" to your AI, and **verify the fingerprint + click Approve** in the extension's settings. Zero-dependency single file, no `npm install`.
3. **Install the skills** — add the `SKILL.md` files under `skills/` to your host's skill library. **Start with Quick Research** — usable the day you install it.

## Security & privacy

- **Fully local**: the only network hop is `127.0.0.1`; no cloud relay.
- **Pair-and-approve**: every AI device must be manually approved after fingerprint verification inside the extension.
- **Rate limits**: lists 300/batch & 600/30min, comments 500/post, details 20/batch & 100/30min — enforced automatically to protect your platform accounts.
- **No extension source**: this repo ships only the protocol adapter; the LeadsRadar extension core stays closed-source.
- Never paste cookies, tokens, or device private keys into issues or logs.

## Community skills

Beyond the official four, PR your own playbooks (Feishu sync, private-domain SOP, daily digest push…) as `SKILL.md` — merged ones get listed here with your name on them.

## Support

- Website: [leadsradar.cn](https://leadsradar.cn)
- Usage logs: extension Settings → *Execution details*
- Issues welcome for bugs & skill improvements
