# 探栗 Agent（LeadsRadar Agent）

[English](README_en.md) | 中文

![version](https://img.shields.io/badge/version-1.0.0-E63946) ![hosts](https://img.shields.io/badge/hosts-WorkBuddy%20%7C%20%E8%B1%86%E5%8C%85%E5%B7%A5%E4%BD%9C%20%7C%20%E5%8D%83%E9%97%AE%E5%8A%9E%E5%85%AC%20%7C%20Trae%20%7C%20DeepSeek-3B82F6) ![platform](https://img.shields.io/badge/platform-%E5%B0%8F%E7%BA%A2%E4%B9%A6%20%7C%20%E6%8A%96%E9%9F%B3-8A8A8C)

> 把你的 AI 助手变成获客雷达的远程驾驶员——**手机上发一句话，电脑上的探栗插件替你跑腿**。

```
你的手机（豆包 / WorkBuddy App）
   │  ① 随口一句「这条作品里有什么线索？」
   ▼
电脑上的 AI 助手（宿主，本仓库接入包）
   │  ② STDIO MCP 调用探栗工具
   ▼
Chrome 探栗插件（数据全部在本机浏览器内采集）
   │  ③ 结果原路返回 → AI 整理成人话
   ▼
你的手机（收到线索速报 / 巡逻摘要 / 选题卡）
```

> **它不能单独使用**：需要先安装[探栗浏览器插件](https://leadsradar.cn)并在插件里批准你的 AI 设备。全程本机运行，采集数据不离开浏览器。

## 例如，你可以这样说

装好后，在手机上对你的 AI 助手说：

> **「帮我看看这条笔记评论区里有没有客户」**——甩一个小红书链接，收回一份四色线索速报：🟢 准备买的、🟠 有意向的、🟡 有需求的，连「先跟谁、怎么开口」都给你。

> **「扫一遍我的对标账号，谁出爆款了？」**——收回巡逻摘要：谁更新了、谁爆了（爆在哪）、节奏有没有变。

> **「这篇的文案提出来，顺便存个选题」**——收回标题钩子 3 变体 + 口播全文 + 选题卡。

> **「家装获客这个词还有机会吗？」**——收回赛道速览：竞争度、头部套路、3 个空档选题。

## 官方技能（Skills）

每个技能是一个 `SKILL.md`，装进宿主的技能/指令库即生效：

| 技能 | 一句话 | 状态 |
|---|---|---|
| **[情报栗](skills/leadsradar-radar/)** | 发作品/账号/关键词「探一下」——现采现报：客户线索、赛道机会、对标巡逻 | ✅ 可用 |
| **[洞察栗](skills/leadsradar-insights/)** | 拆解爆款为什么爆、查历史研究报告并解读成人话 | ✅ 可用 |
| **[创作栗](skills/leadsradar-creator/)** | 发作品说一句话——存选题、下无水印素材、提文案 | ✅ 可用 |
| **[成交栗](skills/leadsradar-closer/)** | 从评论区挖客户——意向分级、跟进名单、可直接发的回复话术 | ✅ 可用 |
| **[管家栗](skills/leadsradar-helper/)** | 「栗子在吗」的应答前台——查连接登录、报库存、答教程 | ✅ 可用 |

状态说明：五技能全量可用（⭐R53 四大数字员工重组：随手调研+对标巡逻合并为情报栗、数据问答升级洞察栗、素材管家更名创作栗、成交栗/管家栗新建）——洞察栗支持查本地缓存的四类 AI 研究报告（作品拆解/账号研究/赛道研究/账号复盘，附 web 直达链接）；监控/档案/日报类查询通道开发中，上线后技能自动点亮。

**唤醒词**：对装好技能的 AI 说 **「栗子」**（称呼，如「栗子，存一下这个选题」）或 **「探一下」**（动作，如「探一下：家装获客这个词还有机会吗」）即可调用——「探栗」「线索雷达」也认；没有唤醒词但意图明确时同样会触发。

## 3 分钟接入

### 第 1 步：安装探栗插件

[Chrome 应用商店](https://leadsradar.cn) / [官网 leadsradar.cn](https://leadsradar.cn) 安装并登录。

### 第 2 步：把接入包装进你的 AI 助手

**方式一 · WorkBuddy / 豆包工作（推荐，全自动）**

1. 打开插件**设置页 → 智能体连接**，选择你的宿主
2. 点**「一键复制 XX 提示词」**（接入包自动下载到本机）
3. 粘贴给你的 AI，照它提示操作——你唯一要动手的是在插件里**核对指纹码后点「批准」**

<details>
<summary>豆包工作实际接入过程实录（2026-10 实测）</summary>

1. AI 先跑 `where node` 取 node 绝对路径——若返回多条，**选不含 `.workbuddy` 的系统 node**（宿主受管运行时路径带版本哈希，宿主升级后失效）
2. 进入豆包工作「**技能 → 连接器・伙伴 → 连接器 → 新建（本地电脑 / 自定义连接器）**」：服务器名称 `leadsradar`；传输类型下拉选**「STDIO / 本地命令」**（默认显示的「服务器 URL」是 HTTP 形态，选 STDIO 后表单切换为命令/参数/环境变量）；命令填 node 绝对路径；参数填 `leadsradar-agent.mjs` 绝对路径；环境变量 `LEADSRADAR_AGENT_HOST=doubao-work`；**保存并启用**
3. **完全退出豆包工作再重新打开**（托盘图标也要退出）——豆包**没有「信任」步骤**，「保存并启用」后即生效
4. 对它说「**检查探栗连接**」：若插件侧显示 step=1（浏览器没开/插件开关没开），按 AI 提示打开浏览器与插件开关；step=2 到插件设置页**核对指纹码后点「批准」**；step=3 即连接成功

</details>

**方式二 · Trae（一键导入）**

在浏览器地址栏打开下面的链接，Trae 会自动唤起并填好配置（国内版；海外版把前缀 `trae-cn` 换成 `trae`）：

```
trae-cn://trae.ai-ide/mcp-import?type=stdio&name=leadsradar&config=eyJtY3BTZXJ2ZXJzIjp7ImxlYWRzcmFkYXIiOnsiY29tbWFuZCI6Im5weCIsImFyZ3MiOlsiLXkiLCJsZWFkc3JhZGFyLWFnZW50Il0sImVudiI6eyJMRUFEU1JBREFSX0FHRU5UX0hPU1QiOiJ0cmFlIn19fX0%3D
```

首次使用会自动从 npm 拉取 [`leadsradar-agent`](https://www.npmjs.com/package/leadsradar-agent)，然后在探栗插件里核对指纹并批准配对即可。

**方式三 · DeepSeek（DSH 官方插件）**

```bash
dsh plugin add leadsradar-dsh-plugin
```

npm 包 [`leadsradar-dsh-plugin`](https://www.npmjs.com/package/leadsradar-dsh-plugin) 已发布。装完对 DeepSeek 说「检查探栗连接」，按提示在插件里批准配对。若你的 DSH 版本添加插件只认本地路径，克隆本仓库后直接添加 `dsh-plugin/` 文件夹即可。

**方式四 · 千问办公（STDIO 连接器）**

左侧**连接器 → 添加 → 粘贴 JSON**（npx 形态无需下载文件）：

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

其他 STDIO MCP 宿主同理：命令 `node`，参数为 `leadsradar-agent.mjs` 绝对路径（或直接 `npx -y leadsradar-agent`），环境变量 `LEADSRADAR_AGENT_HOST` 填宿主标识。接入包零依赖单文件，无需 npm install。

### 第 3 步：装官方技能

把 `skills/` 下需要的 `SKILL.md` 内容加入宿主技能库（WorkBuddy 技能页 / 豆包智能体指令 / 千问办公技能库）。**建议从「随手调研」开始——装完当天就能用。**

## 安全与隐私

- **全程本机**：数据链路只有 `127.0.0.1`，不经任何云端中转
- **配对批准制**：每台 AI 设备接入需在插件里核对设备指纹后人工批准，防来路不明的接管
- **安全限额**：列表单批 300 / 30 分钟 600、评论 500、详情 20/100——超限自动拒绝，保护你的平台账号（AI 会在布置大批量任务前主动告知并建议拆批）
- **不含插件源码**：本仓库只发布接入适配器（协议转发层），探栗插件核心全部闭源
- 请勿在对话、Issue 或日志中提交 Cookie、Token、设备私钥

## 使用边界

- 探栗 Agent 必须配合探栗浏览器插件使用，不能替代插件
- AI 只能使用你在插件中已批准的能力；涉及积分的深度报告以插件内确认为准
- 遇到登录失效、平台风控提示时任务会暂停，请回浏览器处理

## 目录结构

```
├── leadsradar-agent.mjs   # 接入包（零依赖单文件，esbuild 自包含）
├── skills/                # 五个官方技能
├── package.json
└── README.md
```

## 社区技能

官方技能之外，欢迎把你的玩法包（飞书同步、私域 SOP、日报推送…）写成 SKILL.md 提 PR——审核通过后挂进本表，署名归你。

## 支持与反馈

- 官网：[leadsradar.cn](https://leadsradar.cn)
- 使用问题：插件设置页「执行明细」可查采集日志
- 欢迎提 Issue 报错与技能改进建议
