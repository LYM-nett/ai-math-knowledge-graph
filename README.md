# 《人工智能的数学基础》知识图谱

> 课程知识体系可视化 · 数据科学微专业

**在线访问：** https://lym-nett.github.io/ai-math-knowledge-graph/

---

## 项目简介

本项目基于《人工智能的数学基础》课程讲义，以交互式知识图谱的形式系统梳理课程核心知识体系。图谱将 **94 个知识节点**、**243 条知识关联** 组织为可视化网络，建立数学理论、计算方法与人工智能实际应用之间的关联路径。

### 核心特性

- **三种视图模式**
  - 总览模式：中心节点 + 7 大数学领域的全局结构
  - 领域聚焦：深入单一领域的知识树层次
  - 应用链条：从数学原理到 AI 应用的 7 条完整知识链
- **全中文界面**，节点类型、边关系均有中文标注
- **可读性优先的图谱设计**：包含关系（灰色虚线）与语义关系（彩色实线）视觉分层
- **节点检索**：实时搜索高亮匹配节点
- **节点详情面板**：显示定义、核心公式、前置知识、来源文件等元数据
- **类型过滤**：可按节点类型与边类型筛选图谱内容

---

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.3 | UI 框架 |
| TypeScript | 5.5 | 类型安全 |
| Vite | 5.3 | 构建工具 |
| React Flow | 11.11 | 图谱渲染引擎 |

所有图谱数据以 TypeScript 静态对象定义，无运行时数据库依赖，构建产物为纯静态文件。

---

## 本地运行

### 前置条件

- Node.js ≥ 18
- npm ≥ 9

### 安装与启动

```bash
# 克隆仓库
git clone https://github.com/LYM-nett/ai-math-knowledge-graph.git
cd ai-math-knowledge-graph

# 安装依赖
npm install

# 启动开发服务器（热更新）
npm run dev
```

浏览器访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

构建产物输出至 `dist/`，可直接部署至任何静态文件服务器。本地预览：

```bash
npm run preview
```

---

## GitHub Pages 部署说明

本项目通过 GitHub Actions 自动部署至 GitHub Pages，无需手动操作。

### 首次配置（仅需一次）

1. 将代码推送至 GitHub 仓库的 `main` 分支
2. 进入仓库 **Settings → Pages**
3. 将 **Source** 设置为 **GitHub Actions**（而非分支部署）
4. 保存后，每次 push 到 `main` 都会自动触发构建与部署

### 工作流原理

```
push to main
    │
    ▼
.github/workflows/deploy.yml
    │
    ├─ [build job]
    │    npm ci
    │    npm run build      ← tsc + vite build
    │    upload dist/ 为 Pages artifact
    │
    └─ [deploy job]
         deploy to GitHub Pages
```

部署完成后，网站地址：`https://lym-nett.github.io/ai-math-knowledge-graph/`

---

## 项目结构

```
ai-math-knowledge-graph/
├── src/
│   ├── lib/
│   │   ├── graphTypes.ts        # 核心类型定义（NodeType、EdgeType 等）
│   │   ├── ontology.ts          # 知识本体数据（94节点 × 243条边）
│   │   ├── normalizeGraph.ts    # 图谱规范化 & 索引构建
│   │   ├── graphView.ts         # 视图模式 & 布局算法
│   │   └── uiLabels.ts          # 中文标签 & 颜色 token
│   ├── components/
│   │   ├── GraphCanvas.tsx      # React Flow 画布 & 自定义节点
│   │   ├── Sidebar.tsx          # 搜索 / 模块列表 / 类型过滤
│   │   ├── DetailPanel.tsx      # 节点详情右侧面板
│   │   ├── Legend.tsx           # 可折叠图例
│   │   ├── ViewModeSelector.tsx # 视图模式切换按钮
│   │   └── IntroPanel.tsx       # 首次加载说明页
│   ├── App.tsx                  # 根组件：状态管理 & 布局编排
│   ├── main.tsx                 # 应用入口
│   └── index.css                # 全局样式 & React Flow 覆盖
├── docs/
│   └── ontology-audit.md        # 知识本体审计报告
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Pages 自动部署工作流
├── vite.config.ts               # Vite 配置（含 base 路径）
├── tsconfig.json                # TypeScript 配置
└── package.json
```

---

## 知识图谱设计思路

### 节点分层模型

图谱采用五层节点层次，从抽象到具体依次展开：

```
中心节点  →  一级领域  →  核心理论  →  具体方法 / 数学概念 / 核心公式
                                    →  算法  →  AI 应用
                                    →  应用链条（跨领域集成）
```

| 节点类型 | 说明 | 示例 |
|--------|------|------|
| 中心节点 | 课程总入口 | 人工智能的数学基础 |
| 一级领域 | 7 大数学板块 | 函数表示与学习机制 |
| 核心理论 | 领域奠基理论 | 万能逼近定理 |
| 具体方法 | 可操作的数学工具 | 梯度下降 |
| 数学概念 | 基础数学对象 | 矩阵、向量、张量 |
| 核心公式 | 关键数学表达式 | 交叉熵损失函数 |
| 算法 | 具体实现算法 | 卷积核滑动算法 |
| AI 应用 | 深度学习应用 | ResNet、GAN |
| 应用链条 | 跨领域知识链 | 监督学习链条 |

### 边关系语义

| 边类型 | 方向 | 语义 |
|--------|------|------|
| contains | 领域 → 子节点 | 知识归属 |
| depends_on | 节点 → 前置节点 | 学习先决条件 |
| derived_from | 节点 → 来源节点 | 数学推导关系 |
| enables | 理论/方法 → 算法 | 使能/支撑关系 |
| used_in | 方法 → 应用 | 技术应用关系 |
| optimizes | 算法 → 目标 | 优化对象 |
| measures | 公式 → 被度量量 | 量化关系 |
| regularizes | 正则项 → 目标 | 正则化关系 |
| approximates | 方法 → 近似对象 | 逼近关系 |

### 可视化设计原则

- **结构边 vs 语义边**：`contains` 渲染为灰色虚线（骨架），语义边渲染为彩色实线（信息层）
- **层次布局**：递归子树宽度算法，父节点居中置于子节点之上，无力导向算法
- **颜色分级**：中心节点（深海军蓝+金边）→ 领域节点（各领域主题色）→ 内容节点（类型色+左侧竖条）

---

## Ontology Normalization 方法

`src/lib/normalizeGraph.ts` 将原始本体数据转换为带双向索引的规范化图结构。

### 核心数据结构

```typescript
interface NormalizedGraph {
  nodes: OntologyNode[];           // 节点数组
  edges: OntologyEdge[];           // 边数组
  nodeIndex: Record<string, OntologyNode>;  // id → 节点 O(1) 查找
  adjacency: Record<string, {               // 双向邻接表
    outgoing: OntologyEdge[];
    incoming: OntologyEdge[];
  }>;
}
```

### 规范化流程

1. **别名映射表构建**：将每个节点的 `label`、`labelEn`、`aliases` 全部映射至节点 `id`，支持中英文及缩写搜索
2. **悬空引用检测**：遍历所有边，验证 `source` / `target` 均存在于节点集合
3. **双向索引构建**：同时维护 `outgoing`（出边）和 `incoming`（入边）邻接表，支持 O(1) 邻居查询
4. **隐式节点标注**：`implicit: true` 的节点为从前置依赖推断出的、讲义中未直接定义的概念（如标量、向量），附有 `implicitReason` 说明

### 搜索实现

搜索通过别名映射表实现，支持：
- 中文标签（如"梯度下降"）
- 英文标签（如"Gradient Descent"）
- 自定义别名（如"反向传播算法"）
- 大小写不敏感匹配

---

## 许可

本项目仅供课程学习与展示使用。
