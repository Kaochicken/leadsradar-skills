# LeadsRadar Agent

English | [中文](README.md)

![version](https://img.shields.io/badge/version-1.0.0-E63946) ![hosts](https://img.shields.io/badge/hosts-WorkBuddy%20%7C%20Doubao%20%7C%20DeepSeek-3B82F6) ![platform](https://img.shields.io/badge/platform-Xiaohongshu%20%7C%20Douyin-8A8A8C)

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
   - **Coding agents (Claude Code / Codex CLI / Cursor / Gemini CLI — any STDIO MCP host, manual)**:
     Get `leadsradar-agent.mjs` first (clone this repo, or click "one-click copy" for any host in the extension's *Settings → Agent takeover* — it auto-downloads to your Downloads folder), then configure:

     Claude Code (one command):
     ```bash
     claude mcp add leadsradar -e LEADSRADAR_AGENT_HOST=claude -- node /absolute/path/to/leadsradar-agent.mjs
     ```

     Cursor / generic (`mcp.json`):
     ```json
     {
       "mcpServers": {
         "leadsradar": {
           "command": "node",
           "args": ["/absolute/path/to/leadsradar-agent.mjs"],
           "env": { "LEADSRADAR_AGENT_HOST": "claude" }
         }
       }
     }
     ```

     Codex CLI (`~/.codex/config.toml`):
     ```toml
     [mcp_servers.leadsradar]
     command = "node"
     args = ["/absolute/path/to/leadsradar-agent.mjs"]
     env = { LEADSRADAR_AGENT_HOST = "claude" }
     ```

     Then say "check LeadsRadar connection" to your AI, and **verify the fingerprint + click Approve** in the extension's settings. Zero-dependency single file, no `npm install`.
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
