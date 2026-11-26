# 21cm 三维 Viewer 工作总览

盘点日期：2026-11-23。范围为本独立三维 Viewer 仓库（前端代码、数据清单与科学验证记录；535 个 `.f32.bin` 原值文件保留在本地磁盘并由 `.gitignore` 忽略，在 GitHub Pages 等静态部署环境返回 404 时按 [data.js](data.js) 固定提交远程回退）。详细代码导航见 [文件索引](FILE_INDEX.md)。

## 页面入口

| 用途 | 入口 | 说明 |
| --- | --- | --- |
| 最终三维 Viewer | [cavity.html](cavity.html) | PL / BT、三个物理场、红移播放、辉光、折叠参数、全屏 |
| 三维目录首页 | [index.html](index.html) | 跳转到 `cavity.html`，保留 URL 参数 |
| 二维切片库 | [atlas.html](atlas.html) | 55 组 BPL、32 组 PL，每组 32 个红移和五个物理场 |
| 三维操作说明 | [README.md](README.md) | 显示约定、播放、缓存、数据来源与校验 |
| 主网页参数图谱（另一仓库） | `21cm-cosmic-dawn-atlas` 仓库 `index.html` / `README.md` | 预计算 BPL 与匹配 PL 主站，独立维护于 `HainaHuang729/21cm-cosmic-dawn-atlas` |

## 已完成工作

| 工作 | 当前状态 | 主要依据 |
| --- | --- | --- |
| 三维页面收束 | 保留最终辉光版本；红移控制在画面内，底部参数可折叠，全屏可操作 | [页面控制](cavity.js)、[样式](cavity.css) |
| PL 热演化修复 | 相同保存初始条件和物理参数下完整重算，三个场均发布 85 帧 | [PL 修复记录](science/pl-thermal-repair/README.md) |
| BT 偏差定位与验证 | 定位到扰动计算的浮点往返缩放残留；固定相同扰动输入后，原版驱动的六个场在控制红移逐体素一致 | [BT 修复记录](science/bt-thermal-repair/README.md)、[发布决定](science/bt-thermal-repair/publication-decision.json) |
| BT 完整发布 | 三个场均为 85 帧，原先 17 帧亮温缺口已由通过验证的重算结果替换 | [BT 当前清单](data/bt-manifest.json) |
| 密度分辨率 | PL / BT 全部红移均为真实 128³ 体积平均数据；xH 与亮温为 64³ | [密度导出记录](science/density128/README.md) |
| 播放优化 | 校验移入工作线程，限制缓存和播放画布成本，静止恢复精细渲染 | [播放实测](science/playback/validation.json) |
| 全量测试与 BT 播放 | 2026-10-18 保存记录：58 项测试通过，密度和亮温均按序绘制 85 帧 | [BT 网页验证](science/bt-thermal-repair/web-validation.json) |

BT 的验证采用分步对照：保留冷启动独立密度检查，再共享经过哈希核对的密度、速度输入，由原版驱动独立重算热、电离和复合历史。未共享这些演化输出，未放宽原容差，未修改 C 内核，也未对重算得到的原生标量做裁剪或手工改写。它不等同于匹配输入对照中的扰动场独立重生成；原始失败记录继续保留。

## 当前数据规模

| 模型 | 红移范围 | 红移数 | xH | 亮温 | 密度 | 当前三维文件大小 |
| --- | --- | --- | --- | --- | --- | --- |
| PL 250 cMpc | 35.216929 → 6 | 85 | 85 × 64³ | 85 × 64³ | 85 × 128³ | 850 MiB |
| BT 250 cMpc | 35.216929 → 6 | 85 | 85 × 64³ | 85 × 64³ | 85 × 128³ | 850 MiB |

- 当前三维 Viewer：510 个场文件，合计 1,700 MiB。
- 本地磁盘保留原值：535 个 `.f32.bin` 文件、合计 1,725 MiB（包含当前三维 Viewer 的 510 个活跃文件 1,700 MiB，以及独立 100 cMpc 参考的 25 个缓存文件 25 MiB）。注册表有 547 个键，其中部分为同文件别名；这些二进制文件已由 `.gitignore` 忽略，不提交到本仓库 Git。已被替代的历史 `.f32.bin` 与 64³ 密度文件已清理，历史清单与验证凭据继续保留。
- 二维库：55 + 32 组模型，共 13,920 张数值切片，使用外部 `21cm-cosmic-dawn-atlas/web_data/index.json`（本地通过未跟踪目录 `atlas-data/` 存放，远程部署时回退上游公开文件）。

逐快照的路径查 [local-files.json](data/local-files.json)，网格、SHA-256、统计值和来源查 [PL 清单](data/pl-manifest.json) / [BT 清单](data/bt-manifest.json)。二维 lightcone 横截面不能拼成同一时刻的三维 coeval 盒子。

## 版本记录

| 记录 | 值 |
| --- | --- |
| 本独立仓库主分支 | `main`（从 `21cm-cosmic-dawn-atlas` 的 `codex/viewer-lab-cache-local` 提交 `3e2de01` 独立导出） |
| 源三维分支历史提交 | `d1bf6c9c8fd0859da4e52400f6456fcdd0f19a42`、`3e2de011669a110c0722fbb436c3d9ce29dcc222` |
| 三维数据远程回退提交 | `c1c12ff8e1342f83a986b819ac2b740744483180`（`HainaHuang729/21cm-cosmic-dawn-atlas`，定义在 [data.js](data.js)） |
| 二维及独立参考上游固定提交 | `7daaaca68ac6df4f9ccd95fbb1bbb16ecc042fc0`（`HainaHuang729/21cm-cosmic-dawn-atlas`） |

本独立仓库可由 `main` 分支根目录直接通过 GitHub Pages 提供静态服务（含 `.nojekyll`）；主网页参数图谱仍由 `HainaHuang729/21cm-cosmic-dawn-atlas` 的 `.github/workflows/pages.yml` 部署。

## 启动和检查

以下命令均从本仓库根目录开始。三维 Viewer 无构建步骤，数据校验需要 localhost 或 HTTPS。

```bash
npm start
```

打开 `http://127.0.0.1:8766/`。BT 密度示例：`http://127.0.0.1:8766/cavity.html?model=bt&field=density&z=6.282799727630618`。

```bash
# 运行三维 Viewer 全部单元测试（需要 Node.js 22 或更新版本）
npm test
```

本地文件补齐和修复命令：在仓库根目录执行 `python3 scripts/cache-data.py --all-sample`。集群重算、对照和导出脚本位于 [science/](science/)；其路径针对已有 HPC 工程，计算通过 Slurm 运行。原生 HDF5 和三维 Ts/Tk 保留在集群，网页只发布显示数据。

## 集群文件位置

计算脚本及验证凭据记录的集群工程根目录为 `/project/tkcastrosim/HNHuang/project_mcmc`。下表路径相对于该目录。

| 路径 | 内容 |
| --- | --- |
| `data/web_pl256_thermal_fixed_v3/` | PL 重算身份、原生 256³ 快照、温度和电离缓存及完成记录 |
| `data/web_bt256_thermal_fixed_v2/` | BT 重算身份、原生 256³ 快照、温度和电离缓存及完成记录 |
| `data/web_pl_thermal_repair_20261016/` | PL 隔离驱动、回归对照和 64³ 显示导出 |
| `data/web_bt_thermal_repair_20261017/` | BT 冷启动对照、因果实验、匹配扰动输入对照和 64³ 显示导出 |
| `data/web_density128_20261017/pl/`、`data/web_density128_20261017/bt/` | 两个模型的 128³ 密度导出、清单和验证记录 |
| `software/21cmFAST/` | 保留的原始 21cmFAST 软件；修复工作使用隔离的驱动副本 |
| `web_21cm_viewer/runtime/` | 计算和导出任务日志；这是集群目录，与本地同名 TypeScript 工程分别记录 |

## 来源与归档说明

本文件夹从原 `21cm-cosmic-dawn-atlas`（原名 `21cmTB`）的 `viewer-lab/` 独立迁移而来；其余历史多项目目录与打包件归档于 `/Users/amadeus/Documents/ChatGPT/New project-archive/`。正式科学验证凭据位于 [science/](science/)。
