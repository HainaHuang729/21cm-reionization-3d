# 21cm Viewer 文件索引

盘点日期：2026-11-23。路径均相对于本仓库根目录。工作状态、数据规模和版本见 [工作总览](WORK_INDEX.md)，完整操作说明见 [README](README.md)。

## 先找哪个文件

| 要做的事 | 从这里开始 |
| --- | --- |
| 调整页面布局和底部参数区 | [cavity.html](cavity.html)、[cavity.css](cavity.css) |
| 修改红移、播放按钮和模型切换 | [cavity.js](cavity.js)、[snapshot-player.js](snapshot-player.js) |
| 修改密度纤维、节点或亮温辉光 | [cavity-renderer.js](cavity-renderer.js)、[glow-pass.js](glow-pass.js)、[field-presets.js](field-presets.js) |
| 优化播放开销和缓存 | [playback-profile.js](playback-profile.js)、[volume-cache.js](volume-cache.js)、[prepared-frames.js](prepared-frames.js) |
| 查某帧实际读取的本地文件 | [data/local-files.json](data/local-files.json) |
| 查某帧的网格、哈希、均值及源文件身份 | [PL 清单](data/pl-manifest.json)、[BT 清单](data/bt-manifest.json) |
| 查 BT 偏差原因和发布结论 | [BT 修复说明](science/bt-thermal-repair/README.md)、[发布决定](science/bt-thermal-repair/publication-decision.json) |
| 更新真实模拟数据 | 先读对应 `science/` 修复说明，再执行验证、导出及导入流程 |

## 页面及共享代码

| 文件 | 职责 |
| --- | --- |
| [index.html](index.html) | 目录入口，跳转到最终三维页面并保留查询参数 |
| [cavity.html](cavity.html) | 三维画布、模型和物理场选择、红移播放、全屏及折叠参数区 |
| [cavity.js](cavity.js) | 页面状态、载入与预取、真实红移切换、参数状态、播放和错误处理 |
| [cavity.css](cavity.css) | 最终三维页面布局、全屏、窄屏及悬浮展开按钮 |
| [style.css](style.css) | 页面共享样式及基础视觉变量 |
| [viewer-fullscreen.js](viewer-fullscreen.js) | 全屏进入、退出、Esc 和受限环境布局 |
| [package.json](package.json) | 本地静态服务器与测试命令 |
| [assets/fonts/SOURCES.txt](assets/fonts/SOURCES.txt) | 本地 Jost / IBM Plex Mono 字体来源；同目录保留授权文本 |
| [preview-final.png](preview-final.png) | 最终普通窗口预览 |
| [preview-final-fullscreen.png](preview-final-fullscreen.png) | 最终全屏预览 |
| [preview-final-mobile.png](preview-final-mobile.png) | 最终 320px 窄窗口预览 |

## 渲染与物理场显示

| 文件 | 职责 |
| --- | --- |
| [cavity-renderer.js](cavity-renderer.js) | 最终辉光渲染器及 GLSL；密度纤维和高密节点、xH 界面、亮温吸收及发射 |
| [renderer.js](renderer.js) | 基础 WebGL2 渲染器、三维纹理、相机、交互及共享渲染能力 |
| [glow-pass.js](glow-pass.js) | 亮部提取、模糊合成与色调映射 |
| [field-presets.js](field-presets.js) | 三个场的默认阈值、材质参数、显示映射及密度节点阈值关系 |
| [playback-profile.js](playback-profile.js) | 播放与静止时的像素预算、采样步数和梯度需求 |
| [gradient-volume.js](gradient-volume.js) | 从原标量计算梯度体 |
| [gradient-worker.js](gradient-worker.js) | 梯度计算工作线程 |
| [prepared-frames.js](prepared-frames.js) | 临近帧梯度准备、请求合并、取消和缓存预算 |
| [locator.js](locator.js) | 相机基向量、网格坐标、射线、切面拾取及叠加几何数学 |
| [transfer.js](transfer.js) | 透明度曲线数据、插值、LUT 和节点操作；也是共享依赖 |

## 数据载入和播放

| 文件 | 职责 |
| --- | --- |
| [data.js](data.js) | 固定数据版本、远程地址、物理场定义、清单及原值校验、`VolumeStore` |
| [volume-verifier.js](volume-verifier.js) | 校验线程调度，线程不可用时回退相同校验函数 |
| [volume-verifier-worker.js](volume-verifier-worker.js) | SHA-256、有限性、物理范围、统计和直方图扫描 |
| [volume-cache.js](volume-cache.js) | 按版本及内容哈希缓存字节、限并发预载、可取消的订阅 |
| [snapshot-player.js](snapshot-player.js) | 等待异步帧载入，按序播放、暂停、末帧停止和帧间隔调度 |
| [field-series.js](field-series.js) | 可发布快照筛选、审核缺口、阶段选择及完整缓存任务列表 |
| [scripts/cache-data.py](scripts/cache-data.py) | 下载或修复本地数据，核对文件长度和 SHA-256，更新注册表 |

数据关系为：当前模型清单提供每帧描述，`local-files.json` 提供本地路径，`data.js` 负责载入与校验，渲染器读取通过校验的原值。远程回退和浏览器缓存版本固定于 `data.js` 的 `REVISION`；变更数据时也要同步缓存脚本中的版本和目录。

## 二维切片库

| 文件或目录 | 职责 |
| --- | --- |
| [atlas.html](atlas.html) | 模型选择、匹配 PL 并排、五场切换、红移播放和探针界面 |
| [atlas.js](atlas.js) | 切片库交互、绘图、联动探针和播放 |
| [atlas-data.js](atlas-data.js) | 切片索引、哈希、解压、量化值解码及色表 |
| [atlas.css](atlas.css) | 切片库布局和样式 |
| [chrome.js](chrome.js) | 二维切片库底部控制台折叠 |
| `atlas-data` | 指向本地 `web_data/` 目录的符号链接（来自 `21cmTB`）；未纳入 Git |
| `atlas-data/index.json` | 55 组 BPL、32 组 PL 的索引和参数元数据（外部 `web_data/`） |
| `atlas-data/runs/` / `atlas-data/pl/` | 模型 JSON 描述及压缩的五场 `.slices.bin`（外部 `web_data/`，远程部署时回退上游提交） |

## 当前及历史三维数据

### 清单和路径索引

| 文件 | 用途 |
| --- | --- |
| [data/pl-manifest.json](data/pl-manifest.json) | 当前 PL：三个场各 85 帧，密度网格覆盖为 128³ |
| [data/bt-manifest.json](data/bt-manifest.json) | 当前 BT：三个场各 85 帧，密度网格覆盖为 128³ |
| [data/local-files.json](data/local-files.json) | `模型/快照ID/物理场` 到本地文件的映射；包含少量同文件别名 |
| [data/legacy-manifest.json](data/legacy-manifest.json) | 独立 100 cMpc 参考清单，有 19 个红移；本地注册缓存为 25 个场文件 |
| [data/pl-manifest-before-density128.json](data/pl-manifest-before-density128.json) | PL 热演化已修复、密度尚为 64³ 时的清单 |
| [data/bt-manifest-before-density128.json](data/bt-manifest-before-density128.json) | BT 完整重算已验证、密度尚为 64³ 时的清单 |
| [data/bt-manifest-source-v1.json](data/bt-manifest-source-v1.json) | BT 修复前清单，包含 17 帧亮温审核缺口，用于历史追溯和回归检查 |
| [data/pl/manifest-source-v2.json](data/pl/manifest-source-v2.json) | PL 修复前来源清单，说明见 [data/pl/README.md](data/pl/README.md) |

例如 BT 的 `z=6.282799727630618` 对应快照 ID `z6.2827997276`。用键 `bt/z6.2827997276/density` 在注册表查文件，再在 BT 清单的同 ID 下读取密度网格、哈希和统计。

### 原值文件目录

| 目录 | `.f32.bin` 数量 | 大小 | 当前用途 |
| --- | --- | --- | --- |
| [data/pl-thermal-fixed-v3](data/pl-thermal-fixed-v3/) | 170 | 170 MiB | 85 帧 × xH / 亮温；已被 128³ 替代的 64³ 密度已清理 |
| [data/bt-thermal-fixed-v2](data/bt-thermal-fixed-v2/) | 170 | 170 MiB | 85 帧 × xH / 亮温；已被 128³ 替代的 64³ 密度已清理 |
| [data/pl-density128-v1](data/pl-density128-v1/) | 85 | 680 MiB | 当前 PL 的全部 128³ 密度 |
| [data/bt-density128-v1](data/bt-density128-v1/) | 85 | 680 MiB | 当前 BT 的全部 128³ 密度 |
| [data/legacy](data/legacy/) | 25 | 25 MiB | 独立 100 cMpc 参考缓存，不在当前三维模型菜单中 |

合计 535 个 `.f32.bin` 文件（1,725 MiB）。历史目录 `data/bt/` 及 `data/pl/` 的旧 `.f32.bin` 原值文件已清理；[data/pl/README.md](data/pl/README.md) 与 [data/pl/manifest-source-v2.json](data/pl/manifest-source-v2.json) 保留用于来源追溯。原值采用 little-endian float32，最快轴为 grid-X，线性索引为 `x + n × (y + n × z)`。是否参与当前显示由活动清单和注册表决定，不能只根据目录中的文件数量判断。

## 科学修复和验证

### PL 热演化

目录：[science/pl-thermal-repair](science/pl-thermal-repair/)。先读该目录的 [README](science/pl-thermal-repair/README.md)。

| 文件或文件组 | 用途 |
| --- | --- |
| [driver.patch](science/pl-thermal-repair/driver.patch)、[build_fixed_driver.py](science/pl-thermal-repair/build_fixed_driver.py)、[driver-provenance.json](science/pl-thermal-repair/driver-provenance.json) | 递推修复、隔离驱动构建和源文件指纹 |
| [pilot_pl.py](science/pl-thermal-repair/pilot_pl.py)、[verify_pilot.py](science/pl-thermal-repair/verify_pilot.py)、[verify_full_pilot.py](science/pl-thermal-repair/verify_full_pilot.py) | 32³ 因果与输出时序回归 |
| [pilot-validation.json](science/pl-thermal-repair/pilot-validation.json)、[full-pilot-validation.json](science/pl-thermal-repair/full-pilot-validation.json) | 上述回归的结果 |
| [diagnose_pl.py](science/pl-thermal-repair/diagnose_pl.py)、[check_native_early.py](science/pl-thermal-repair/check_native_early.py)、[native-early-comparison.json](science/pl-thermal-repair/native-early-comparison.json) | 原始诊断和早期原生分辨率比较 |
| [recompute_pl.py](science/pl-thermal-repair/recompute_pl.py)、[native_reference.py](science/pl-thermal-repair/native_reference.py) | 完整重算和原版单目标对照 |
| [export_repaired_pl.py](science/pl-thermal-repair/export_repaired_pl.py)、[package_display.sbatch](science/pl-thermal-repair/package_display.sbatch)、[import_display.py](science/pl-thermal-repair/import_display.py) | 验证导出、集群打包及本地导入 |
| [parameter-validation.json](science/pl-thermal-repair/parameter-validation.json)、[native-run-validation.json](science/pl-thermal-repair/native-run-validation.json)、[native-validation.json](science/pl-thermal-repair/native-validation.json) | 输入一致性、85 帧源数据和导出检查 |

### BT 热演化及偏差原因

目录：[science/bt-thermal-repair](science/bt-thermal-repair/)。阅读顺序为 [README](science/bt-thermal-repair/README.md) → [publication-decision.json](science/bt-thermal-repair/publication-decision.json) → 具体诊断和对照凭据。

| 文件或文件组 | 用途 |
| --- | --- |
| [recompute_bt.py](science/bt-thermal-repair/recompute_bt.py)、[recompute.sbatch](science/bt-thermal-repair/recompute.sbatch) | 复用修复后的递推驱动，完整重算原生 BT |
| [native_reference.py](science/bt-thermal-repair/native_reference.py)、[reference.sbatch](science/bt-thermal-repair/reference.sbatch) | 最初的原版冷启动单目标对照 |
| [check_native_early.py](science/bt-thermal-repair/check_native_early.py)、[diagnose_control.py](science/bt-thermal-repair/diagnose_control.py) | 早期源数据和最初控制帧诊断 |
| [control-diagnostic.json](science/bt-thermal-repair/control-diagnostic.json)、[native-reference-result.json](science/bt-thermal-repair/native-reference-result.json) | 原始逐场比较；保留 xH 47 个、亮温 7 个体素超容差的结果 |
| [input_ablation.py](science/bt-thermal-repair/input_ablation.py)、[input_ablation.sbatch](science/bt-thermal-repair/input_ablation.sbatch)、[input-ablation.json](science/bt-thermal-repair/input-ablation.json) | 六组输入替换实验，定位扰动输入差异 |
| [perturbation_state_probe.py](science/bt-thermal-repair/perturbation_state_probe.py)、[perturbation-state.json](science/bt-thermal-repair/perturbation-state.json) | IC 速度数组浮点往返残留和原始缓冲恢复实验 |
| [rng_probe.py](science/bt-thermal-repair/rng_probe.py)、[rng-probe.json](science/bt-thermal-repair/rng-probe.json) | GSL Poisson 抽样复现 |
| [matched_perturb_reference.py](science/bt-thermal-repair/matched_perturb_reference.py)、[matched_reference.sbatch](science/bt-thermal-repair/matched_reference.sbatch) | 相同扰动输入下，由原版驱动独立重算演化历史 |
| [matched-input-provenance.json](science/bt-thermal-repair/matched-input-provenance.json)、[matched-reference-result.json](science/bt-thermal-repair/matched-reference-result.json) | 共享输入的哈希，以及六场逐体素一致的结果 |
| [parameter-validation.json](science/bt-thermal-repair/parameter-validation.json)、[recomputed-identity.json](science/bt-thermal-repair/recomputed-identity.json) | 重算输入、物理参数与模拟身份 |
| [native-run-validation.json](science/bt-thermal-repair/native-run-validation.json)、[native-validation.json](science/bt-thermal-repair/native-validation.json) | 85 帧源数据检查、演化链、导出均值守恒和轴顺序 |
| [export_repaired_bt.py](science/bt-thermal-repair/export_repaired_bt.py)、[export.sbatch](science/bt-thermal-repair/export.sbatch)、[package_display.sbatch](science/bt-thermal-repair/package_display.sbatch)、[import_display.py](science/bt-thermal-repair/import_display.py) | 发布门槛、64³ 导出、打包和本地激活 |
| [publication-decision-initial.json](science/bt-thermal-repair/publication-decision-initial.json)、[publication-decision.json](science/bt-thermal-repair/publication-decision.json) | 初次失败和当前发布决定，两者均保留 |
| [job-accounting.txt](science/bt-thermal-repair/job-accounting.txt)、[workflow-fingerprints.json](science/bt-thermal-repair/workflow-fingerprints.json) | 计算任务历史、脚本和数据包指纹 |
| [web-validation.json](science/bt-thermal-repair/web-validation.json) | 58 项测试记录、密度和亮温各 85 帧播放、远程文件抽检 |

### 密度导出和播放实测

| 文件 | 用途 |
| --- | --- |
| [science/density128/README.md](science/density128/README.md) | 原生 256³ → 128³ 的方法和验证说明 |
| [export_density128.py](science/density128/export_density128.py)、[export.sbatch](science/density128/export.sbatch) | 2³ 体积平均、均值守恒、轴顺序、读回和降回 64³ 的同源一致性检查 |
| [import_density128.py](science/density128/import_density128.py) | 校验全部 85 帧后，更新活动密度清单和本地路径 |
| [pl-validation.json](science/density128/pl-validation.json)、[bt-validation.json](science/density128/bt-validation.json) | 两个模型各 85 帧的密度导出检查 |
| [science/density128/web-validation.json](science/density128/web-validation.json) | 密度升级阶段的网页验证记录 |
| [science/playback/validation.json](science/playback/validation.json) | 播放优化性能及静止画面像素一致性记录 |

## 测试索引

在本目录运行 `npm test`。以下 12 个测试文件构成当前测试套件。

| 测试文件 | 覆盖内容 |
| --- | --- |
| [data.test.mjs](tests/data.test.mjs) | 注册原值文件的哈希、统计、坐标、场范围与异常拒绝 |
| [field-series.test.mjs](tests/field-series.test.mjs) | 两模型完整 85 帧、510 个缓存任务、BT 对照元数据及历史缺口 |
| [field-presets.test.mjs](tests/field-presets.test.mjs) | 密度映射、亮温正负号和物理阈值 |
| [snapshot-player.test.mjs](tests/snapshot-player.test.mjs) | 帧顺序、暂停、异步完成、末帧、失败停止与时间调度 |
| [volume-cache.test.mjs](tests/volume-cache.test.mjs) | 版本和哈希隔离、损坏缓存修复、并发、取消、预算与未发布帧拒绝 |
| [volume-verifier.test.mjs](tests/volume-verifier.test.mjs) | 校验工作线程、损坏拒绝、回退和资源释放 |
| [prepared-frames.test.mjs](tests/prepared-frames.test.mjs) | 梯度准备、重复请求、原值保留与取消 |
| [gradient.test.mjs](tests/gradient.test.mjs) | 均匀场和线性梯度的计算约定 |
| [playback-profile.test.mjs](tests/playback-profile.test.mjs) | 密度梯度需求、播放预算和静止精细配置 |
| [locator.test.mjs](tests/locator.test.mjs) | 网格中心、相机、射线、切面拾取、裁剪与叠加几何 |
| [transfer.test.mjs](tests/transfer.test.mjs) | 透明度曲线归一化、插值、节点操作与原值保留 |
| [atlas.test.mjs](tests/atlas.test.mjs) | 真实五场切片解码、颜色和异常描述拒绝 |

## 过程文件与维护

早期未跟踪的过程报告目录 `reports/` 已清理，正式验证和发布结论查 [science/](science/)，最终预览查 `preview-final*.png`。

数据更新时，应同步活动清单、本地注册表、`data.js` 与缓存脚本的固定版本，再保留对应验证凭据。目录结构或职责改变时同步本索引。原生计算和导出脚本按集群 Slurm 环境使用；历史失败凭据和旧清单保留其追溯用途。

