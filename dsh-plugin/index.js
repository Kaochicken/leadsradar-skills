/**
 * dsh-plugin-leadsradar — 探栗（LeadsRadar）DeepSeek Harness 插件（⭐r94 npm 自足式）
 *
 * 设计目标：零路径配置、零系统 Node.js 依赖——
 *   - 适配器 leadsradar-agent.mjs 随包分发，apply 时用 import.meta.url 自动定位包内绝对路径；
 *   - command 用 process.execPath（宿主进程自身）：纯 node 宿主=node.exe；
 *     Electron 宿主配 ELECTRON_RUN_AS_NODE=1 即可当 node 跑（纯 node 下该变量无害被忽略）；
 *   - 通过 Cordis 核心 API ctx.plugin() 动态挂载官方 @deepseek-ai/dsh-mcp-client，
 *     以 stdio 拉起适配器，工具注册为 mcp__leadsradar__*；
 *   - env 走 mcp-client 的显式配置合并（scrubbedParentEnv 只洗 KEY/PASSWORD/SECRET/TOKEN/DSH_*，
 *     LEADSRADAR_AGENT_HOST / ELECTRON_RUN_AS_NODE 均不匹配且显式声明，安全存活）。
 */
export const name = "dsh-plugin-leadsradar";

export async function apply(ctx) {
  const { fileURLToPath } = await import("node:url");
  const mod = await import("@deepseek-ai/dsh-mcp-client");
  const McpClient = mod.default ?? mod;
  const adapterPath = fileURLToPath(new URL("./leadsradar-agent.mjs", import.meta.url));
  ctx.plugin(McpClient, {
    serverName: "leadsradar",
    transport: "stdio",
    command: process.execPath,
    args: [adapterPath],
    env: {
      ELECTRON_RUN_AS_NODE: "1",
      LEADSRADAR_AGENT_HOST: "dsh",
    },
  });
}
