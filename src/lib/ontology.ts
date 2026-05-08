/**
 * ontology.ts
 * Canonical ontology for 《人工智能的数学基础》.
 *
 * Data sources:
 *   课件1 函数表示.json
 *   课件2 元素级运算.json
 *   课件3 矩阵级运算.json
 *   课件4 卷积运算.json
 *   课件5 范数.json
 *   课件6 信息论.json
 *   课件7 信息间的度量.json
 *   人工智能数学基础知识图谱总框架.md
 *
 * Normalization decisions are documented inline as comments where non-obvious.
 * No computation here — pure data.
 */

import type { OntologyEdge, OntologyGraph, OntologyNode } from './graphTypes';

// ─── Edge factory ─────────────────────────────────────────────────────────────

function e(
  source: string,
  type: OntologyEdge['type'],
  target: string,
  label?: string,
): OntologyEdge {
  return { id: `${source}__${type}__${target}`, source, target, type, label };
}

// ─── Nodes ────────────────────────────────────────────────────────────────────

const nodes: OntologyNode[] = [

  // ── Central ────────────────────────────────────────────────────────────────
  {
    id: 'ai_math_foundation',
    label: '人工智能的数学基础',
    labelEn: 'Mathematical Foundations of AI',
    type: 'central',
    sources: [],
  },

  // ── Domains (one per lecture chapter) ──────────────────────────────────────
  {
    id: 'domain_function_learning',
    label: '函数表示与学习机制',
    labelEn: 'Function Representation & Learning',
    type: 'domain',
    sources: [],
  },
  {
    id: 'domain_tensor_algebra',
    label: '张量计算与线性代数',
    labelEn: 'Tensor Computation & Linear Algebra',
    type: 'domain',
    sources: [],
  },
  {
    id: 'domain_neural_units',
    label: '神经网络基本计算单元',
    labelEn: 'Neural Network Computational Units',
    type: 'domain',
    sources: [],
  },
  {
    id: 'domain_convolution',
    label: '卷积运算与局部特征建模',
    labelEn: 'Convolution & Local Feature Modeling',
    type: 'domain',
    sources: [],
  },
  {
    id: 'domain_norm_distance',
    label: '范数、距离与相似性度量',
    labelEn: 'Norms, Distances & Similarity Measures',
    type: 'domain',
    sources: [],
  },
  {
    id: 'domain_info_theory',
    label: '信息论与概率分布度量',
    labelEn: 'Information Theory & Distribution Measures',
    type: 'domain',
    sources: [],
  },
  {
    // F1: "综合应用链条" — the 7th top-level module; wraps all chain meta-nodes.
    id: 'domain_chains',
    label: '综合应用链条',
    labelEn: 'Integrated Application Chains',
    type: 'domain',
    sources: [],
  },

  // ── Theory nodes ────────────────────────────────────────────────────────────

  {
    id: 'function',
    label: '函数',
    labelEn: 'Function',
    type: 'theory',
    domain: 'domain_function_learning',
    definition:
      '映射 f: X → Y，把定义域 X 中的每个元素唯一对应到值域 Y 中。寻找能表示离散采样信号的连续函数，天然可以刻画信号的连续变化，并方便利用微积分工具分析变化率。',
    formula: 'f: X → Y',
    aliases: ['映射', '函数映射', '输入—输出映射', '参数化函数'],
    sources: [{ file: '课件1 函数表示', topic: '函数', subtopic: '基本定义与深层意义' }],
  },

  {
    id: 'weierstrass_theorem',
    label: 'Weierstrass逼近定理',
    labelEn: 'Weierstrass Approximation Theorem',
    type: 'theory',
    domain: 'domain_function_learning',
    definition:
      '闭区间 [a,b] 上的连续函数，对任意 ε>0，存在一个实系数多项式 P(x) 使全局误差小于 ε。为多项式逼近任意连续函数提供理论保证。',
    formula: '|f(x) − P(x)| < ε, ∀x ∈ [a, b]',
    sources: [{ file: '课件1 函数表示', topic: 'Weierstrass逼近定理', subtopic: '逼近理论' }],
  },

  {
    id: 'universal_approximation',
    label: '通用逼近定理',
    labelEn: 'Universal Approximation Theorem',
    type: 'theory',
    domain: 'domain_function_learning',
    definition:
      '对紧集 K 上的连续函数 g，含至少一个隐藏层并带有适当非线性激活函数的全连接网络可以任意精度逼近 g。为深度全连接网络的强大逼近能力提供理论保证。',
    formula: 'sup_{x∈K} ‖f_θ(x) − g(x)‖ < ε',
    sources: [{ file: '课件1 函数表示', topic: '通用逼近定理', subtopic: '逼近理论' }],
  },

  // -- Norm theory: axiom-level definitions

  {
    id: 'vector_norm',
    label: '向量范数',
    labelEn: 'Vector Norm',
    type: 'theory',
    domain: 'domain_norm_distance',
    definition:
      '映射 ‖·‖: ℝⁿ → ℝ 满足三条公理：(1) 正定性 ‖x‖ ≥ 0，=0 ↔ x=0；(2) 齐次性 ‖λx‖ = |λ|‖x‖；(3) 三角不等式 ‖x+y‖ ≤ ‖x‖+‖y‖。',
    formula: '‖x‖ ≥ 0; ‖λx‖ = |λ|‖x‖; ‖x+y‖ ≤ ‖x‖+‖y‖',
    aliases: ['常用向量范数'],
    sources: [{ file: '课件5 范数', topic: '向量范数', subtopic: '范数基本定义' }],
  },

  {
    id: 'matrix_norm',
    label: '矩阵范数',
    labelEn: 'Matrix Norm',
    type: 'theory',
    domain: 'domain_norm_distance',
    definition:
      '满足正定性、齐次性、三角不等式的矩阵到标量映射；方阵情形额外要求相容性：‖AB‖ ≤ ‖A‖‖B‖。',
    formula: '‖AB‖ ≤ ‖A‖ · ‖B‖ （相容性）',
    sources: [{ file: '课件5 范数', topic: '矩阵范数', subtopic: '范数基本定义' }],
  },

  {
    id: 'inner_product',
    label: '内积',
    labelEn: 'Inner Product',
    type: 'theory',
    domain: 'domain_norm_distance',
    definition:
      'ℝⁿ 中内积 (x,y) = xᵀy，满足对称性、双线性与正定性；内积诱导 2-范数：‖x‖₂² = (x, x)。',
    formula: '(x, y) = xᵀy; (x, x) = ‖x‖₂²',
    // "内积与2-范数" was a combined topic — split here; L2 norm is a separate concept node.
    aliases: ['向量内积', '内积与2-范数'],
    sources: [{ file: '课件5 范数', topic: '内积与2-范数', subtopic: '向量范数' }],
  },

  {
    id: 'cauchy_schwarz',
    label: 'Cauchy-Schwarz不等式',
    labelEn: 'Cauchy-Schwarz Inequality',
    type: 'theory',
    domain: 'domain_norm_distance',
    definition:
      '内积与2-范数满足的基本不等式，是Hölder不等式在 p=q=2 时的特例。用于证明余弦相似度有界性和注意力机制缩放因子的合理性。',
    formula: '|(x, y)| ≤ ‖x‖₂ · ‖y‖₂',
    sources: [{ file: '课件5 范数', topic: 'Cauchy-Schwarz不等式', subtopic: '内积与范数' }],
  },

  {
    id: 'holder_inequality',
    label: 'Hölder不等式',
    labelEn: 'Hölder Inequality',
    type: 'theory',
    domain: 'domain_norm_distance',
    definition:
      '共轭指数 p, q（1/p + 1/q = 1）下内积的上界；Cauchy-Schwarz 不等式是其 p=q=2 的特例。',
    formula: '|(x, y)| ≤ ‖x‖_p · ‖y‖_q, 1/p + 1/q = 1',
    sources: [{ file: '课件5 范数', topic: 'Hölder不等式', subtopic: '内积与范数' }],
  },

  {
    id: 'norm_equivalence',
    label: '范数等价性',
    labelEn: 'Norm Equivalence',
    type: 'theory',
    domain: 'domain_norm_distance',
    definition:
      'ℝⁿ 上任意两个向量范数等价（存在正常数 c₁, c₂ 夹逼）；无穷维空间中不成立。意味着有限维空间中范数选取不影响收敛性。',
    formula: 'c₁‖x‖^{(2)} ≤ ‖x‖^{(1)} ≤ c₂‖x‖^{(2)}, ∀x ∈ ℝⁿ',
    sources: [{ file: '课件5 范数', topic: '向量范数等价性', subtopic: '向量范数' }],
  },

  {
    id: 'distance_metric',
    label: '距离度量',
    labelEn: 'Distance Metric',
    type: 'theory',
    domain: 'domain_norm_distance',
    definition:
      '满足非负性、对称性和三角不等式的空间映射函数，用于量化数据点之间的绝对距离差异。',
    formula: 'd(x,y) ≥ 0; d(x,y) = d(y,x); d(x,z) ≤ d(x,y) + d(y,z)',
    sources: [{ file: '课件7 信息间的度量', topic: '距离度量', subtopic: '数据相似性度量' }],
  },

  // -- Information theory: axiomatic definitions

  {
    id: 'self_information',
    label: '自信息量',
    labelEn: 'Self-Information',
    type: 'theory',
    domain: 'domain_info_theory',
    definition:
      '随机变量取值 x 时携带的信息量，等于发生概率的负对数；概率越小，信息量越大；独立事件的信息量可加。',
    formula: 'h(x) = −ln p(x) （单位：nat；以2为底时单位为 bit）',
    sources: [{ file: '课件6 信息论', topic: '自信息量', subtopic: '信息论基础' }],
  },

  {
    id: 'shannon_entropy',
    label: '香农熵',
    labelEn: 'Shannon Entropy',
    type: 'theory',
    domain: 'domain_info_theory',
    definition:
      '离散随机变量 X 的自信息量关于其概率分布的期望，度量概率分布整体的不确定性。',
    formula: 'H(p) = E_p[−ln p(X)] = −Σᵢ pᵢ ln pᵢ',
    // "香农熵（离散熵）" → strip parenthetical qualifier; "信息熵" is a common alias used in 课件7
    aliases: ['香农熵（离散熵）', '离散熵', '信息熵'],
    sources: [{ file: '课件6 信息论', topic: '香农熵（离散熵）', subtopic: '熵' }],
  },

  {
    id: 'differential_entropy',
    label: '微分熵',
    labelEn: 'Differential Entropy',
    type: 'theory',
    domain: 'domain_info_theory',
    definition:
      '连续随机变量 X 的自信息量关于其概率密度函数的期望积分；可为负值，不具有离散熵的部分性质。',
    formula: 'H(p) = −∫ p(x) ln p(x) dx',
    aliases: ['微分熵（连续熵）', '连续熵'],
    sources: [{ file: '课件6 信息论', topic: '微分熵（连续熵）', subtopic: '熵' }],
  },

  {
    id: 'joint_entropy',
    label: '联合熵',
    labelEn: 'Joint Entropy',
    type: 'theory',
    domain: 'domain_info_theory',
    definition:
      '多维随机变量 (X,Y) 的联合分布的熵，度量多个随机变量整体的不确定性；X,Y 独立时 H(X,Y)=H(X)+H(Y)。',
    formula: 'H(X,Y) = −Σₓ Σᵧ p(x,y) ln p(x,y)',
    sources: [{ file: '课件6 信息论', topic: '联合熵', subtopic: '熵' }],
  },

  {
    id: 'entropy_extremum_discrete',
    label: '离散熵极值性质',
    labelEn: 'Discrete Entropy Extremum',
    type: 'theory',
    domain: 'domain_info_theory',
    definition:
      '取 n 个值的离散随机变量中，均匀分布时熵最大（= ln n）；退化为确定性变量时熵最小（= 0）。',
    formula: 'H(p) ≤ ln n，等号当且仅当 p₁=p₂=…=pₙ=1/n',
    aliases: ['熵的极值性质（离散）'],
    sources: [
      { file: '课件6 信息论', topic: '熵的极值性质（离散）', subtopic: '香农熵（离散熵）' },
    ],
  },

  {
    id: 'entropy_extremum_continuous',
    label: '连续熵极值性质',
    labelEn: 'Continuous Entropy Extremum',
    type: 'theory',
    domain: 'domain_info_theory',
    definition:
      '在均值 μ 和方差 σ² 固定的连续分布中，正态分布 N(μ,σ²) 的微分熵最大（正态分布是最大熵分布）。',
    formula: 'H(N(μ,σ²)) = ln(√(2πe)σ)',
    aliases: ['熵的极值性质（连续）'],
    sources: [
      { file: '课件6 信息论', topic: '熵的极值性质（连续）', subtopic: '微分熵（连续熵）' },
    ],
  },

  // ── Concept nodes ───────────────────────────────────────────────────────────

  // -- Domain 1: Function Learning concepts

  {
    id: 'basis_function_combination',
    label: '基函数的线性组合',
    labelEn: 'Basis Function Linear Combination',
    type: 'concept',
    domain: 'domain_function_learning',
    definition:
      '预先给定一组基函数 {φₖ}，通过它们的线性组合构造逼近复杂目标函数的方法。系数 aₖ 通过最小化误差确定。',
    formula: 'f(t) = Σₖ₌₀ⁿ aₖφₖ(t)',
    aliases: ['基函数线性组合'],
    sources: [
      { file: '课件1 函数表示', topic: '基函数的线性组合', subtopic: '函数逼近方法' },
    ],
  },

  {
    id: 'polynomial_basis',
    label: '多项式基函数',
    labelEn: 'Polynomial Basis Functions',
    type: 'concept',
    domain: 'domain_function_learning',
    definition:
      '取基函数 {1, t, t², …, tⁿ}，其线性组合便构成多项式函数。Weierstrass 定理保证其可以任意精度逼近连续函数。',
    formula: 'Pₙ(t) = Σₖ₌₀ⁿ aₖtᵏ',
    sources: [{ file: '课件1 函数表示', topic: '多项式基函数', subtopic: '基函数线性组合' }],
  },

  {
    id: 'trigonometric_basis',
    label: '三角基函数',
    labelEn: 'Trigonometric Basis Functions',
    type: 'concept',
    domain: 'domain_function_learning',
    definition:
      '以 cos(2πkt/T) 和 sin(2πkt/T) 为基函数的线性组合，即 Fourier 级数的截断形式，用于刻画信号中的周期性结构。',
    formula: 'f(t) = a₀/2 + Σₖ₌₁ⁿ (aₖcos(2πkt/T) + bₖsin(2πkt/T))',
    sources: [{ file: '课件1 函数表示', topic: '三角基函数', subtopic: '基函数线性组合' }],
  },

  {
    id: 'nonlinear_composition',
    label: '函数的非线性复合',
    labelEn: 'Nonlinear Function Composition',
    type: 'concept',
    domain: 'domain_function_learning',
    definition:
      '不预设固定基函数，而是通过多个简单函数的非线性复合来构造复杂函数逼近目标。是深度神经网络的数学本质。',
    formula: 'f = fₙ ∘ fₙ₋₁ ∘ … ∘ f₁',
    sources: [{ file: '课件1 函数表示', topic: '函数的非线性复合', subtopic: '函数逼近方法' }],
  },

  // -- Domain 2: Tensor Algebra — base objects
  // These four are implicit (no dedicated JSON topic entry) but are
  // foundational prerequisites cited throughout all lecture files.

  {
    id: 'scalar',
    label: '标量',
    labelEn: 'Scalar',
    type: 'concept',
    domain: 'domain_tensor_algebra',
    definition: '零阶张量，单个实数。',
    implicit: true,
    implicitReason: '先决条件节点；在 课件2 "元素级运算" 中作为零阶张量被引用，无独立主题条目。',
    sources: [{ file: '课件2 元素级运算', topic: '元素级运算', subtopic: '基本定义' }],
  },
  {
    id: 'vector',
    label: '向量',
    labelEn: 'Vector',
    type: 'concept',
    domain: 'domain_tensor_algebra',
    definition: '一阶张量，有序实数数组 x ∈ ℝⁿ。',
    implicit: true,
    implicitReason: '先决条件节点；在 课件2 "元素级运算" 中作为一阶张量被引用，无独立主题条目。',
    sources: [{ file: '课件2 元素级运算', topic: '元素级运算', subtopic: '基本定义' }],
  },
  {
    id: 'matrix',
    label: '矩阵',
    labelEn: 'Matrix',
    type: 'concept',
    domain: 'domain_tensor_algebra',
    definition: '二阶张量，矩形实数数组 A ∈ ℝ^{m×n}。',
    implicit: true,
    implicitReason: '先决条件节点；在 课件2 "元素级运算" 中作为二阶张量被引用，无独立主题条目。',
    sources: [{ file: '课件2 元素级运算', topic: '元素级运算', subtopic: '基本定义' }],
  },
  {
    id: 'tensor',
    label: '张量',
    labelEn: 'Tensor',
    type: 'concept',
    domain: 'domain_tensor_algebra',
    definition: '多维数组的泛化；标量、向量、矩阵分别是0、1、2阶张量的特例。',
    implicit: true,
    implicitReason: '先决条件节点；在 课件2 和 课件3 的多处先决条件中被引用，无独立主题条目。',
    sources: [
      { file: '课件2 元素级运算', topic: '元素级运算', subtopic: '基本定义' },
      { file: '课件3 矩阵级运算', topic: '张量分解', subtopic: '矩阵乘法算法' },
    ],
  },

  // -- Domain 2: Element-level operations

  {
    id: 'elementwise_ops',
    label: '元素级运算',
    labelEn: 'Element-wise Operations',
    type: 'concept',
    domain: 'domain_tensor_algebra',
    definition:
      '对张量（标量、向量、矩阵）的每个元素独立地施加同一运算，输出张量与输入张量形状相同。',
    formula: 'C = op(A), c_{ij} = op(a_{ij})',
    sources: [{ file: '课件2 元素级运算', topic: '元素级运算', subtopic: '基本定义' }],
  },

  {
    id: 'elementwise_add_scale',
    label: '逐元素加法与数乘',
    labelEn: 'Element-wise Addition & Scalar Multiplication',
    type: 'concept',
    domain: 'domain_tensor_algebra',
    definition: '同形矩阵对应位置相加；矩阵每个元素与标量相乘。',
    formula: 'C = A + B, c_{ij} = a_{ij} + b_{ij}; (kA)_{ij} = k · a_{ij}',
    aliases: ['矩阵逐元素加法与数乘'],
    sources: [
      { file: '课件2 元素级运算', topic: '矩阵逐元素加法与数乘', subtopic: '元素级运算' },
    ],
  },

  {
    id: 'hadamard_product',
    label: 'Hadamard乘积',
    labelEn: 'Hadamard Product',
    type: 'concept',
    domain: 'domain_tensor_algebra',
    definition:
      '同形矩阵对应位置相乘，结果矩阵形状不变。同一运算在不同上下文中有不同名称：卷积中称"局部乘积求和"，门控机制中称"门控"，本质是同一运算。',
    formula: 'C = A ⊙ B ∈ ℝ^{m×n}, c_{ij} = a_{ij} · b_{ij}',
    // Framework erroneously creates three separate slots for the same operation.
    // All three are aliases of this single canonical node.
    aliases: ['Hadamard门控', 'Hadamard局部乘积求和'],
    sources: [{ file: '课件2 元素级运算', topic: 'Hadamard乘积', subtopic: '元素级运算' }],
  },

  // -- Domain 2: Matrix-level operations

  {
    id: 'matrix_multiply',
    label: '矩阵乘法',
    labelEn: 'Matrix Multiplication',
    type: 'concept',
    domain: 'domain_tensor_algebra',
    definition:
      'A ∈ ℝ^{m×n} 与 B ∈ ℝ^{n×p} 的乘积 C ∈ ℝ^{m×p}，第 (i,j) 元素为 A 第 i 行与 B 第 j 列的内积；满足结合律与分配律，不满足交换律。',
    formula: 'C = AB ∈ ℝ^{m×p}, c_{ij} = Σ_{k=1}^{n} a_{ik} · b_{kj}',
    sources: [{ file: '课件3 矩阵级运算', topic: '矩阵乘法', subtopic: '矩阵级运算' }],
  },

  {
    id: 'affine_transform',
    label: '仿射变换',
    labelEn: 'Affine Transformation',
    type: 'concept',
    domain: 'domain_tensor_algebra',
    definition:
      '线性变换（矩阵乘法）加偏置向量的复合，构成向量空间之间的一般线性映射；全连接层每层计算的数学核心。',
    formula: 'y = Wx + b',
    sources: [{ file: '课件3 矩阵级运算', topic: '仿射变换', subtopic: '矩阵乘法应用' }],
  },

  {
    id: 'matrix_inverse',
    label: '矩阵的逆',
    labelEn: 'Matrix Inverse',
    type: 'concept',
    domain: 'domain_tensor_algebra',
    definition:
      '方阵 A ∈ ℝ^{n×n} 的逆矩阵 A⁻¹ 满足 AA⁻¹ = A⁻¹A = I；存在逆矩阵的充要条件为 A 满秩。',
    formula: 'AA^{-1} = A^{-1}A = I',
    aliases: ['逆矩阵'],
    sources: [{ file: '课件3 矩阵级运算', topic: '矩阵的逆', subtopic: '矩阵级运算' }],
  },

  {
    id: 'multivariate_regression',
    label: '多元线性回归',
    labelEn: 'Multivariate Linear Regression',
    type: 'concept',
    domain: 'domain_tensor_algebra',
    definition:
      '用线性函数 h(x) = wᵀx + b 拟合样本 {(xᵢ, yᵢ)}，参数 w, b 通过最小化 MSE 损失确定。',
    formula: 'h(x) = wᵀx + b; L(w,b) = (1/2l) Σᵢ (wᵀxᵢ + b − yᵢ)²',
    sources: [
      { file: '课件3 矩阵级运算', topic: '多元线性回归', subtopic: '矩阵乘法应用' },
    ],
  },

  {
    id: 'mse_loss',
    label: '均方误差损失（MSE）',
    labelEn: 'Mean Squared Error Loss',
    type: 'concept',
    domain: 'domain_tensor_algebra',
    definition: '预测值与真实值差的平方均值，回归任务最常用的训练目标。',
    formula: 'L = (1/2l) Σᵢ (h(xᵢ) − yᵢ)²',
    aliases: ['MSE', 'MSE损失'],
    sources: [
      { file: '课件3 矩阵级运算', topic: '均方误差损失（MSE）', subtopic: '损失函数' },
    ],
  },

  // -- Domain 4: Convolution concepts

  {
    id: 'continuous_conv',
    label: '连续卷积',
    labelEn: 'Continuous Convolution',
    type: 'concept',
    domain: 'domain_convolution',
    definition:
      '输入信号 f(t) 与核函数 g(t) 的积分运算：将 g 翻转后沿 t 轴滑动，在每个位置计算与 f 的乘积积分。',
    formula: '(f * g)(t) = ∫_{−∞}^{+∞} f(τ) g(t − τ) dτ',
    sources: [{ file: '课件4 卷积运算', topic: '连续卷积', subtopic: '卷积运算' }],
  },

  {
    id: 'discrete_conv_1d',
    label: '一维离散卷积',
    labelEn: '1D Discrete Convolution',
    type: 'concept',
    domain: 'domain_convolution',
    definition:
      '输入向量 f ∈ ℝ^M 与卷积核 w ∈ ℝ^K 的滑动加权求和，输出长度为 M−K+1（无补边时）；深度学习中省略核翻转步骤。',
    formula: 'y_i = Σ_{m=1}^{K} f_{i+m−1} · w_m, y ∈ ℝ^{M−K+1}',
    sources: [{ file: '课件4 卷积运算', topic: '一维离散卷积', subtopic: '卷积运算' }],
  },

  {
    id: 'padding_strategy',
    label: 'Padding策略',
    labelEn: 'Padding Strategy',
    type: 'concept',
    domain: 'domain_convolution',
    definition:
      '对输入向量两端补充元素以控制输出长度；四种方式：零边界（CNN最常用）、复制边界、镜像边界、循环边界。',
    formula: '补零后输出长度 = M − K + 1 + 2P（P 为单侧补充量）',
    aliases: ['补充边界策略', 'Padding', 'padding', '步长'],
    sources: [{ file: '课件4 卷积运算', topic: '补充边界策略', subtopic: '一维离散卷积' }],
  },

  {
    id: 'discrete_conv_2d',
    label: '二维离散卷积',
    labelEn: '2D Discrete Convolution',
    type: 'concept',
    domain: 'domain_convolution',
    definition:
      '输入矩阵 F ∈ ℝ^{H×W} 与卷积核 w ∈ ℝ^{K×K} 的二维滑动加权求和；每步对局部 K×K 区域做 Hadamard 乘积再求和。',
    formula: 'y_{ij} = Σ_{m=1}^{K} Σ_{n=1}^{K} f_{i+m−1, j+n−1} · w_{mn}, Y ∈ ℝ^{(H−K+1)×(W−K+1)}',
    sources: [{ file: '课件4 卷积运算', topic: '二维离散卷积', subtopic: '卷积运算' }],
  },

  // -- Domain 5: Specific norm instances (derived from vector_norm theory)

  {
    id: 'l1_norm',
    label: 'L1范数',
    labelEn: 'L1 Norm',
    type: 'concept',
    domain: 'domain_norm_distance',
    definition: '向量元素绝对值之和（曼哈顿范数）。正则化时促进稀疏解（Lasso）；对应曼哈顿距离。',
    formula: '‖x‖₁ = Σ|xₖ|',
    aliases: ['1范数', '曼哈顿范数'],
    sources: [{ file: '课件5 范数', topic: '常用向量范数', subtopic: '向量范数' }],
  },

  {
    id: 'l2_norm',
    label: 'L2范数',
    labelEn: 'L2 Norm',
    type: 'concept',
    domain: 'domain_norm_distance',
    definition:
      '向量元素平方和的平方根（欧几里得范数）；与内积的关系：‖x‖₂² = (x,x)。正则化时抑制权重大小（Ridge）；对应欧氏距离。',
    formula: '‖x‖₂ = (Σ|xₖ|²)^{1/2}',
    aliases: ['2范数', '欧几里得范数'],
    sources: [{ file: '课件5 范数', topic: '常用向量范数', subtopic: '向量范数' }],
  },

  {
    id: 'linf_norm',
    label: 'L∞范数',
    labelEn: 'L∞ Norm',
    type: 'concept',
    domain: 'domain_norm_distance',
    definition: '向量元素绝对值的最大值（切比雪夫范数）；对应切比雪夫距离；鲁棒优化中使用。',
    formula: '‖x‖_∞ = max|xₖ|',
    aliases: ['无穷范数', '切比雪夫范数'],
    sources: [{ file: '课件5 范数', topic: '常用向量范数', subtopic: '向量范数' }],
  },

  {
    id: 'p_norm',
    label: 'p范数',
    labelEn: 'p-Norm (Hölder Norm)',
    type: 'concept',
    domain: 'domain_norm_distance',
    definition:
      '统一族向量范数，p ≥ 1 时满足三角不等式；L1/L2/L∞ 分别是 p=1/2/∞ 的特例；p < 1 时为伪范数，仍有稀疏恢复应用。',
    formula: '‖x‖_p = (Σ_{k=1}^{n} |xₖ|^p)^{1/p}, 1 ≤ p < ∞',
    aliases: ['Hölder范数', 'Hölder范数（p-范数）'],
    sources: [{ file: '课件5 范数', topic: 'Hölder范数（p-范数）', subtopic: '向量范数' }],
  },

  {
    id: 'frobenius_norm',
    label: 'Frobenius范数',
    labelEn: 'Frobenius Norm',
    type: 'concept',
    domain: 'domain_norm_distance',
    definition:
      '矩阵所有元素平方和的平方根，具有正交不变性：‖A‖_F = ‖UᵀAV‖_F。用于低秩近似误差度量和权重正则化。',
    formula: '‖A‖_F = (Σᵢ Σⱼ |aᵢⱼ|²)^{1/2}',
    sources: [{ file: '课件5 范数', topic: 'Frobenius范数', subtopic: '矩阵范数' }],
  },

  {
    id: 'induced_norm',
    label: '诱导范数',
    labelEn: 'Induced Norm (Spectral Norm)',
    type: 'concept',
    domain: 'domain_norm_distance',
    definition:
      '由向量 p-范数诱导：‖A‖ = max_{‖x‖=1} ‖Ax‖，几何意义为矩阵线性变换对向量长度的最大拉伸倍数。p=2 时退化为谱范数 = √λ₁(AᵀA)。',
    formula: '‖A‖_p = max_{x≠0} ‖Ax‖_p / ‖x‖_p; ‖A‖₂ = √λ₁(AᵀA) (谱范数)',
    // Framework 5.3 lists "谱范数" separately; it is the p=2 special case of induced norm.
    aliases: ['诱导范数（矩阵p-范数）', '谱范数', '矩阵p-范数'],
    sources: [
      { file: '课件5 范数', topic: '诱导范数（矩阵p-范数）', subtopic: '矩阵范数' },
    ],
  },

  {
    id: 'l0_pseudonorm',
    label: '0伪范数',
    labelEn: 'L0 Pseudo-norm',
    type: 'concept',
    domain: 'domain_norm_distance',
    definition:
      '矩阵中非零元素的个数；满足正定性和齐次性但不满足三角不等式，故称伪范数。稀疏优化的理论目标。',
    formula: '‖A‖₀ = #{(i,j) : aᵢⱼ ≠ 0}',
    aliases: ['0伪范数与稀疏性', '矩阵0伪范数', 'L0范数'],
    sources: [{ file: '课件5 范数', topic: '0伪范数与稀疏性', subtopic: '矩阵范数' }],
  },

  {
    id: 'weighted_norm',
    label: '加权范数',
    labelEn: 'Weighted Norm (Elliptic Norm)',
    type: 'concept',
    domain: 'domain_norm_distance',
    definition: '由正定矩阵 A 诱导的向量范数，单位球为椭球体；马氏距离是其特例（A = Σ⁻¹）。',
    formula: '‖x‖_A = (xᵀAx)^{1/2}, A 正定',
    aliases: ['加权范数（椭圆范数）', '椭圆范数'],
    sources: [{ file: '课件5 范数', topic: '加权范数（椭圆范数）', subtopic: '向量范数' }],
  },

  // -- Domain 5: Distance and similarity concepts

  {
    id: 'euclid_distance',
    label: '欧氏距离',
    labelEn: 'Euclidean Distance',
    type: 'concept',
    domain: 'domain_norm_distance',
    definition:
      '对应 L2 范数，衡量多维欧氏空间中两点间的直线距离；各维度量纲一致且数据分布均匀时最适用。',
    formula: 'd(x,y) = ‖x − y‖₂ = √(Σᵢ (xᵢ − yᵢ)²)',
    aliases: ['Euclid距离'],
    sources: [{ file: '课件7 信息间的度量', topic: 'Euclid距离', subtopic: '距离度量' }],
  },

  {
    id: 'manhattan_distance',
    label: '曼哈顿距离',
    labelEn: 'Manhattan Distance',
    type: 'concept',
    domain: 'domain_norm_distance',
    definition:
      '对应 L1 范数，衡量各坐标维度绝对差值的累加和；对离群点具有鲁棒性。',
    formula: 'd(x,y) = ‖x − y‖₁ = Σᵢ |xᵢ − yᵢ|',
    aliases: ['Manhattan距离'],
    sources: [{ file: '课件7 信息间的度量', topic: 'Manhattan距离', subtopic: '距离度量' }],
  },

  {
    id: 'chebyshev_distance',
    label: '切比雪夫距离',
    labelEn: 'Chebyshev Distance',
    type: 'concept',
    domain: 'domain_norm_distance',
    definition:
      '对应 L∞ 范数，取各维度坐标差绝对值的最大值；超高维数据中避免微小误差累加。',
    formula: 'd(x,y) = ‖x − y‖_∞ = max_i |xᵢ − yᵢ|',
    aliases: ['Chebyshev距离'],
    sources: [
      { file: '课件7 信息间的度量', topic: 'Chebyshev距离', subtopic: '距离度量' },
    ],
  },

  {
    id: 'mahalanobis_distance',
    label: '马氏距离',
    labelEn: 'Mahalanobis Distance',
    type: 'concept',
    domain: 'domain_norm_distance',
    definition:
      '引入数据集协方差矩阵的全局距离，剔除变量间相关性与量纲差异影响；等价于在协方差白化后的欧氏距离。',
    formula: 'D_M(x) = √((x−μ)ᵀΣ⁻¹(x−μ))',
    aliases: ['Mahalanobis距离'],
    sources: [
      { file: '课件7 信息间的度量', topic: 'Mahalanobis距离', subtopic: '距离度量' },
    ],
  },

  {
    id: 'cosine_similarity',
    label: '余弦相似度',
    labelEn: 'Cosine Similarity',
    type: 'concept',
    domain: 'domain_norm_distance',
    definition:
      '计算两向量夹角的余弦值，忽略绝对长度，仅量化方向趋同性；Cauchy-Schwarz 不等式保证结果在 [−1,1]。',
    formula: 'C(x,y) = ⟨x,y⟩ / (‖x‖₂ · ‖y‖₂)',
    sources: [{ file: '课件7 信息间的度量', topic: '余弦相似度', subtopic: '方向类度量' }],
  },

  {
    id: 'pearson_correlation',
    label: '皮尔逊相关系数',
    labelEn: 'Pearson Correlation Coefficient',
    type: 'concept',
    domain: 'domain_norm_distance',
    definition:
      '将变量数据去中心化（减去特征均值）后计算的余弦相似度，衡量变量间的线性相关程度，消除个体评分基准偏差。',
    sources: [
      { file: '课件7 信息间的度量', topic: '皮尔逊相关系数', subtopic: '方向类度量' },
    ],
  },

  {
    id: 'jaccard_similarity',
    label: 'Jaccard相似系数',
    labelEn: 'Jaccard Similarity',
    type: 'concept',
    domain: 'domain_norm_distance',
    definition:
      '量化离散二值集合元素重合度：两集合交集元素数除以并集元素数；目标检测中的 IoU 是其直接应用。',
    formula: 'J(A,B) = |A∩B| / |A∪B|',
    sources: [
      { file: '课件7 信息间的度量', topic: 'Jaccard相似系数', subtopic: '集合类度量' },
    ],
  },

  // -- Domain 6: Distribution measures

  {
    id: 'cross_entropy',
    label: '交叉熵',
    labelEn: 'Cross-Entropy',
    type: 'concept',
    domain: 'domain_info_theory',
    definition:
      '衡量预测概率分布 Q 与真实目标分布 P 之间信息差异的非对称标量工具；H(P,Q) = H(P) + D_{KL}(P‖Q)。',
    formula: 'H(P,Q) = −Σᵢ p(xᵢ) ln q(xᵢ)',
    // "交叉熵损失" is the same concept applied as a loss function in 课件1/2/3 next_topics.
    aliases: ['交叉熵损失'],
    sources: [{ file: '课件7 信息间的度量', topic: '交叉熵', subtopic: '概率分布度量' }],
  },

  {
    id: 'kl_divergence',
    label: 'KL散度',
    labelEn: 'KL Divergence',
    type: 'concept',
    domain: 'domain_info_theory',
    definition:
      '又称相对熵，度量两概率分布之间信息差异的非对称非负标量；D_{KL}(P‖Q) = H(P,Q) − H(P) ≥ 0。',
    formula: 'D_{KL}(p‖q) = Σₓ p(x) ln(p(x)/q(x))',
    aliases: ['K-L散度', '相对熵'],
    sources: [{ file: '课件7 信息间的度量', topic: 'K-L散度', subtopic: '概率分布度量' }],
  },

  {
    id: 'js_divergence',
    label: 'JS散度',
    labelEn: 'Jensen-Shannon Divergence',
    type: 'concept',
    domain: 'domain_info_theory',
    definition:
      '基于 KL 散度的改进度量，引入均值分布做中介，实现对两概率分布差异的对称、有界评估。',
    formula: 'D_{JS}(p,q) = (1/2)D_{KL}(p‖m) + (1/2)D_{KL}(q‖m), m=(p+q)/2',
    aliases: ['J-S散度', 'JS散度'],
    sources: [{ file: '课件7 信息间的度量', topic: 'J-S散度', subtopic: '概率分布度量' }],
  },

  // ── Method nodes ────────────────────────────────────────────────────────────

  {
    id: 'loss_function',
    label: '损失函数',
    labelEn: 'Loss Function',
    type: 'method',
    domain: 'domain_function_learning',
    definition:
      '衡量模型预测误差的函数；驱动 AI 训练过程的核心目标。MSE 用于回归，交叉熵用于分类。',
    // "损失函数与优化函数" was a single combined topic in 课件1; split here at normalization.
    aliases: ['损失函数与优化函数'],
    sources: [
      { file: '课件1 函数表示', topic: '损失函数与优化函数', subtopic: '函数表示' },
    ],
  },

  {
    id: 'optimization_function',
    label: '优化函数',
    labelEn: 'Optimization Function',
    type: 'method',
    domain: 'domain_function_learning',
    definition:
      '定义参数更新规则的函数（如梯度下降更新规则），与损失函数配合驱动 AI 模型参数调整。',
    implicit: true,
    implicitReason: '"损失函数与优化函数" 在 课件1 中是联合主题；规范化拆分时将优化函数单独立为隐式节点，与损失函数共享同一来源。',
    sources: [
      { file: '课件1 函数表示', topic: '损失函数与优化函数', subtopic: '函数表示' },
    ],
  },

  {
    id: 'gradient',
    label: '梯度',
    labelEn: 'Gradient',
    type: 'method',
    domain: 'domain_function_learning',
    definition:
      '可微多元函数 f 对每个分量的偏导数构成的列向量，是模型训练与优化的"导航仪"；指向函数增长最快的方向。',
    formula: '∇f = (∂f/∂x₁, ∂f/∂x₂, …, ∂f/∂xₙ)ᵀ',
    sources: [{ file: '课件1 函数表示', topic: '梯度', subtopic: '多元函数微分' }],
  },

  {
    id: 'chain_rule',
    label: '链式法则',
    labelEn: 'Chain Rule',
    type: 'method',
    domain: 'domain_function_learning',
    definition:
      '复合函数求导法则：外层函数梯度乘以内层函数梯度；反向传播的数学基础。',
    formula: '∂L/∂w = (∂L/∂y) · (∂y/∂w)',
    implicit: true,
    implicitReason: '在总框架 1.3 "学习目标与优化机制" 中被引用；反向传播的数学基础，无独立课件主题条目。',
    sources: [{ file: '人工智能数学基础知识图谱总框架', topic: '1.3 学习目标与优化机制' }],
  },

  {
    id: 'gradient_descent',
    label: '梯度下降',
    labelEn: 'Gradient Descent',
    type: 'method',
    domain: 'domain_function_learning',
    definition:
      '沿梯度反方向迭代更新参数以最小化损失函数的优化算法；学习率 η 控制每步步长。',
    formula: 'w ← w − η∇L(w)',
    implicit: true,
    implicitReason: '在 课件1 "梯度" 和 课件3 "多元线性回归" 的 related_algorithms 中多次引用；无独立主题条目。',
    sources: [
      { file: '课件1 函数表示', topic: '梯度', subtopic: '多元函数微分' },
      { file: '课件3 矩阵级运算', topic: '多元线性回归', subtopic: '矩阵乘法应用' },
    ],
  },

  {
    id: 'backpropagation',
    label: '反向传播',
    labelEn: 'Backpropagation',
    type: 'method',
    domain: 'domain_function_learning',
    definition:
      '利用链式法则，从输出层到输入层高效计算神经网络各参数梯度的算法；是深度学习训练的核心机制。',
    aliases: ['反向传播算法'],
    implicit: true,
    implicitReason: '在 课件1 "梯度"、课件2 "元素级运算" 及 课件4 "深度卷积神经网络" 的 related_algorithms 中多次引用；无独立主题条目。',
    sources: [
      { file: '课件1 函数表示', topic: '梯度', subtopic: '多元函数微分' },
      { file: '课件2 元素级运算', topic: '元素级运算', subtopic: '基本定义' },
      { file: '课件4 卷积运算', topic: '深度卷积神经网络', subtopic: '二维离散卷积应用' },
    ],
  },

  {
    id: 'least_squares',
    label: '最小二乘法',
    labelEn: 'Least Squares (Normal Equation)',
    type: 'method',
    domain: 'domain_tensor_algebra',
    definition:
      '将样本特征堆叠为设计矩阵 X ∈ ℝ^{l×n}，MSE 损失的解析最优解由矩阵逆给出；当 XᵀX 奇异时用伪逆替代。',
    formula: 'w = (XᵀX)⁻¹Xᵀy',
    // Several name variants appear across the JSON files and framework.
    aliases: ['最小二乘解（正规方程）', '正规方程', '伪逆', '最小二乘解'],
    sources: [
      {
        file: '课件3 矩阵级运算',
        topic: '最小二乘解（正规方程）',
        subtopic: '多元线性回归',
      },
    ],
  },

  {
    id: 'tensor_decomposition',
    label: '张量分解',
    labelEn: 'Tensor Decomposition',
    type: 'method',
    domain: 'domain_tensor_algebra',
    definition:
      '将矩阵乘法的计算复杂度表示为3阶张量 T_{n,m,p} 的秩-1张量之和，秩越小对应乘法次数越少；AlphaTensor 通过强化学习自动发现最优分解。',
    formula: 'T_{n,m,p} = Σ_r u_r ⊗ v_r ⊗ w_r',
    aliases: ['低秩表示', '矩阵乘法算法'],
    sources: [{ file: '课件3 矩阵级运算', topic: '张量分解', subtopic: '矩阵乘法算法' }],
  },

  {
    id: 'max_entropy_principle',
    label: '最大熵原理',
    labelEn: 'Maximum Entropy Principle',
    type: 'method',
    domain: 'domain_info_theory',
    definition:
      '在已知约束条件下选择熵最大的概率分布作为最优分布（"最诚实"的选择）；为VAE使用高斯先验提供理论依据。',
    implicit: true,
    implicitReason: '在 课件6 "熵的极值性质（连续）" 的 next_topics 中被引用，并在总框架 6.2 "最大熵分布" 中列出；无独立主题条目。',
    sources: [
      { file: '课件6 信息论', topic: '熵的极值性质（连续）', subtopic: '微分熵（连续熵）' },
      { file: '人工智能数学基础知识图谱总框架', topic: '6.2 最大熵分布' },
    ],
  },

  {
    id: 'condition_entropy',
    label: '条件熵',
    labelEn: 'Conditional Entropy',
    type: 'method',
    domain: 'domain_info_theory',
    definition:
      '给定 Y 的情况下 X 的剩余不确定性：H(X|Y) = H(X,Y) − H(Y)。信息增益 = 原熵 − 条件熵。',
    formula: 'H(X|Y) = −Σₓ Σᵧ p(x,y) ln p(x|y)',
    implicit: true,
    implicitReason: '在 课件6 "联合熵" 的 next_topics 中被引用，并在总框架 6.1 "信息熵体系" 中列出；无独立主题条目。',
    sources: [
      { file: '课件6 信息论', topic: '联合熵', subtopic: '熵' },
      { file: '人工智能数学基础知识图谱总框架', topic: '6.1 信息熵体系' },
    ],
  },

  {
    id: 'mutual_information',
    label: '互信息',
    labelEn: 'Mutual Information',
    type: 'method',
    domain: 'domain_info_theory',
    definition:
      '衡量两随机变量之间共享信息量：I(X;Y) = H(X) + H(Y) − H(X,Y) = H(X) − H(X|Y)。',
    formula: 'I(X;Y) = H(X) + H(Y) − H(X,Y)',
    implicit: true,
    implicitReason: '在 课件6 "联合熵" 的 next_topics 中被引用，并在总框架 6.1 "信息熵体系" 中列出；决策树信息增益的等价表达；无独立主题条目。',
    sources: [
      { file: '课件6 信息论', topic: '联合熵', subtopic: '熵' },
      { file: '人工智能数学基础知识图谱总框架', topic: '6.1 信息熵体系' },
    ],
  },

  // ── Algorithm nodes ──────────────────────────────────────────────────────────

  {
    id: 'sobel_kernel',
    label: 'Sobel卷积核',
    labelEn: 'Sobel Kernel',
    type: 'algorithm',
    domain: 'domain_convolution',
    definition:
      '手工设计的 3×3 卷积核，分别近似图像在水平和垂直方向的一阶梯度，用于边缘检测。是可学习卷积核概念的启蒙实例。',
    formula:
      'w_v = [[-1,0,1],[-2,0,2],[-1,0,1]]; w_h = [[-1,-2,-1],[0,0,0],[1,2,1]]',
    sources: [
      { file: '课件4 卷积运算', topic: 'Sobel卷积核', subtopic: '二维离散卷积应用' },
    ],
  },

  {
    id: 'alphatensor',
    label: 'AlphaTensor',
    labelEn: 'AlphaTensor',
    type: 'algorithm',
    domain: 'domain_tensor_algebra',
    definition:
      'DeepMind (2022) 用强化学习自动发现更低秩矩阵乘法算法的系统；将算法发现问题转化为张量分解搜索。',
    sources: [{ file: '课件3 矩阵级运算', topic: '张量分解', subtopic: '矩阵乘法算法' }],
  },

  // ── Application nodes ────────────────────────────────────────────────────────
  // Per CLAUDE.md: keep AI application nodes concise.

  {
    // F2: umbrella node for "激活函数" / "非线性激活函数" references in JSON prerequisites.
    id: 'activation_function',
    label: '激活函数',
    labelEn: 'Activation Function',
    type: 'concept',
    domain: 'domain_neural_units',
    definition:
      '神经网络中引入非线性的元素级运算；使多层网络能够逼近任意复杂函数（通用逼近定理的前提）。',
    aliases: ['激活函数族', '非线性激活函数', '激活函数'],
    sources: [{ file: '课件2 元素级运算', topic: 'sigmoid激活函数', subtopic: '激活函数' }],
  },

  {
    id: 'sigmoid',
    label: 'Sigmoid',
    type: 'application',
    domain: 'domain_neural_units',
    definition: '将任意实数压缩到 (0,1) 的单调递增饱和函数；用于二分类输出层和概率输出；有梯度消失风险。',
    formula: 'σ(x) = 1 / (1 + e^{−x})',
    aliases: ['sigmoid激活函数'],
    sources: [
      { file: '课件2 元素级运算', topic: 'sigmoid激活函数', subtopic: '激活函数' },
    ],
  },

  {
    id: 'tanh_activation',
    label: 'Tanh',
    type: 'application',
    domain: 'domain_neural_units',
    definition: '将任意实数压缩到 (−1,1)，输出以0为中心；RNN/LSTM隐藏层常用激活函数。',
    formula: 'tanh(x) = (eˣ − e^{−x}) / (eˣ + e^{−x})',
    aliases: ['tanh激活函数'],
    sources: [
      { file: '课件2 元素级运算', topic: 'tanh激活函数', subtopic: '激活函数' },
    ],
  },

  {
    id: 'relu',
    label: 'ReLU',
    type: 'application',
    domain: 'domain_neural_units',
    definition: '对输入取与0的最大值；负半轴输出恒为0，正半轴梯度恒为1；深度网络中最常用激活函数。',
    formula: 'ReLU(x) = max{0, x}',
    aliases: ['ReLU激活函数'],
    sources: [{ file: '课件2 元素级运算', topic: 'ReLU激活函数', subtopic: '激活函数' }],
  },

  {
    id: 'leaky_relu',
    label: 'Leaky ReLU',
    type: 'application',
    domain: 'domain_neural_units',
    definition: 'ReLU 的变体；在负半轴保留斜率 α（典型值 0.01），避免神经元永久失活（死亡神经元问题）。',
    formula: 'LeakyReLU(x) = max{αx, x}, α ∈ (0,1)',
    aliases: ['Leaky ReLU激活函数'],
    sources: [
      { file: '课件2 元素级运算', topic: 'Leaky ReLU激活函数', subtopic: '激活函数' },
    ],
  },

  {
    id: 'fully_connected_network',
    label: '全连接网络（MLP）',
    labelEn: 'Fully Connected Network (MLP)',
    type: 'application',
    domain: 'domain_neural_units',
    definition:
      '由多个仿射变换层与逐元素非线性激活函数交替复合构成的参数化函数；通用逼近定理保证其表达能力。',
    formula: 'f(x) = σ(W₂σ(W₁x + b₁) + b₂)',
    aliases: ['全连接网络', 'MLP', '全连接层'],
    sources: [{ file: '课件1 函数表示', topic: '全连接网络', subtopic: '函数的非线性复合' }],
  },

  {
    id: 'cnn',
    label: '卷积神经网络（CNN）',
    labelEn: 'Convolutional Neural Network (CNN)',
    type: 'application',
    domain: 'domain_convolution',
    definition:
      '多层可学习卷积核与非线性激活函数交替堆叠；浅层学习边缘/纹理，中层学习部件，高层学习语义概念。',
    formula: 'a^{l+1} = σ(a^l * W^l + b^l)',
    aliases: ['深度卷积神经网络', 'CNN', '卷积神经网络'],
    sources: [
      { file: '课件4 卷积运算', topic: '深度卷积神经网络', subtopic: '二维离散卷积应用' },
    ],
  },

  {
    id: 'lstm',
    label: 'LSTM',
    type: 'application',
    domain: 'domain_neural_units',
    definition:
      '长短期记忆网络；通过 Hadamard 门控机制（输入门、遗忘门、输出门）选择性地保留或遗忘序列信息。',
    implicit: true,
    implicitReason: '在 课件2 "tanh激活函数" 和 "Hadamard乘积" 的 related_algorithms 中引用；总框架 3.4 "循环与注意力机制" 列出为应用节点；无独立主题条目。',
    sources: [
      { file: '课件2 元素级运算', topic: 'tanh激活函数', subtopic: '激活函数' },
      { file: '人工智能数学基础知识图谱总框架', topic: '3.4 循环与注意力机制' },
    ],
  },

  {
    id: 'resnet',
    label: 'ResNet',
    type: 'application',
    domain: 'domain_neural_units',
    definition:
      '残差网络；通过跳跃连接（逐元素加法：输出 = F(x) + x）训练超深度神经网络，缓解梯度消失。',
    implicit: true,
    implicitReason: '在 课件2 "ReLU激活函数" 的 related_algorithms 中引用；总框架 3.4 "循环与注意力机制" 列出为应用节点；无独立主题条目。',
    sources: [
      { file: '课件2 元素级运算', topic: 'ReLU激活函数', subtopic: '激活函数' },
      { file: '人工智能数学基础知识图谱总框架', topic: '3.4 循环与注意力机制' },
    ],
  },

  {
    id: 'vae',
    label: 'VAE',
    labelEn: 'Variational Autoencoder',
    type: 'application',
    domain: 'domain_info_theory',
    definition:
      '变分自编码器；用 KL 散度约束隐变量分布接近高斯先验（最大熵原理的应用），实现可控的生成模型。',
    implicit: true,
    implicitReason: '在 课件6 "微分熵（连续熵）" 的 related_algorithms 中引用；总框架 6.4 "生成模型与信息论" 列出为应用节点；无独立主题条目。',
    sources: [
      { file: '课件6 信息论', topic: '微分熵（连续熵）', subtopic: '熵' },
      { file: '人工智能数学基础知识图谱总框架', topic: '6.4 生成模型与信息论' },
    ],
  },

  {
    id: 'gan',
    label: 'GAN',
    labelEn: 'Generative Adversarial Network',
    type: 'application',
    domain: 'domain_info_theory',
    definition:
      '生成对抗网络；训练目标等价于最小化生成分布与真实分布之间的 JS 散度；谱归一化（诱导范数约束）提升训练稳定性。',
    implicit: true,
    implicitReason: '在总框架 6.4 "生成模型与信息论" 中列出为应用节点；JS散度与谱归一化的核心应用；无独立课件主题条目。',
    sources: [
      { file: '人工智能数学基础知识图谱总框架', topic: '6.4 生成模型与信息论' },
    ],
  },

  {
    id: 'decision_tree',
    label: '决策树',
    labelEn: 'Decision Tree',
    type: 'application',
    domain: 'domain_info_theory',
    definition:
      '基于信息增益（香农熵差）选择最优分裂特征的树形分类模型；互信息是信息增益的另一等价表达。',
    implicit: true,
    implicitReason: '在 课件6 "香农熵（离散熵）" 的 applications 中引用；总框架 6.4 "生成模型与信息论" 列出为应用节点；无独立主题条目。',
    sources: [
      { file: '课件6 信息论', topic: '香农熵（离散熵）', subtopic: '熵' },
      { file: '人工智能数学基础知识图谱总框架', topic: '6.4 生成模型与信息论' },
    ],
  },

  // ── Chain nodes (learning path meta-nodes) ───────────────────────────────────
  // These represent the 综合应用链条 from section 7 of the framework document.

  {
    id: 'chain_supervised',
    label: '监督学习链条',
    labelEn: 'Supervised Learning Chain',
    type: 'chain',
    domain: 'domain_chains',
    definition: '函数表示 → 损失函数 → 梯度 → 梯度下降 → 参数更新',
    sources: [],
  },
  {
    id: 'chain_deep_network',
    label: '深度网络链条',
    labelEn: 'Deep Network Chain',
    type: 'chain',
    domain: 'domain_chains',
    definition: '矩阵乘法 → 仿射变换 → 激活函数 → 非线性复合 → 深度神经网络',
    sources: [],
  },
  {
    id: 'chain_vision',
    label: '卷积视觉链条',
    labelEn: 'Vision Chain',
    type: 'chain',
    domain: 'domain_chains',
    definition: '二维卷积 → 卷积核 → 局部特征 → 层级语义 → CNN视觉任务',
    sources: [],
  },
  {
    id: 'chain_regularization',
    label: '正则化链条',
    labelEn: 'Regularization Chain',
    type: 'chain',
    domain: 'domain_chains',
    definition: '范数 → 正则化项 → 模型复杂度控制 → 泛化能力提升',
    sources: [],
  },
  {
    id: 'chain_sparse',
    label: '稀疏学习链条',
    labelEn: 'Sparse Learning Chain',
    type: 'chain',
    domain: 'domain_chains',
    definition: 'L0伪范数 → L1松弛 → 稀疏优化 → 特征选择',
    sources: [],
  },
  {
    id: 'chain_prob_learning',
    label: '概率学习链条',
    labelEn: 'Probabilistic Learning Chain',
    type: 'chain',
    domain: 'domain_chains',
    definition: '概率分布 → 熵 → 交叉熵/KL散度 → 分类模型/生成模型训练',
    sources: [],
  },
  {
    id: 'chain_similarity',
    label: '相似性检索链条',
    labelEn: 'Similarity Retrieval Chain',
    type: 'chain',
    domain: 'domain_chains',
    definition: '内积/范数 → 距离/相似度 → 聚类/排序/推荐/检索',
    sources: [],
  },
];

// ─── Edges ────────────────────────────────────────────────────────────────────

const edges: OntologyEdge[] = [

  // ── Structural: central → domains ──────────────────────────────────────────
  e('ai_math_foundation', 'contains', 'domain_function_learning'),
  e('ai_math_foundation', 'contains', 'domain_tensor_algebra'),
  e('ai_math_foundation', 'contains', 'domain_neural_units'),
  e('ai_math_foundation', 'contains', 'domain_convolution'),
  e('ai_math_foundation', 'contains', 'domain_norm_distance'),
  e('ai_math_foundation', 'contains', 'domain_info_theory'),
  e('ai_math_foundation', 'contains', 'domain_chains'),  // F1: 7th top-level module

  // ── Structural: domain → anchor nodes (one "entry point" per domain) ────────
  // These edges define what a user sees when they first expand a domain node.
  e('domain_function_learning', 'contains', 'function'),
  e('domain_function_learning', 'contains', 'basis_function_combination'),
  e('domain_function_learning', 'contains', 'nonlinear_composition'),
  e('domain_function_learning', 'contains', 'weierstrass_theorem'),
  e('domain_function_learning', 'contains', 'universal_approximation'),
  e('domain_function_learning', 'contains', 'gradient'),
  e('domain_function_learning', 'contains', 'loss_function'),
  e('domain_function_learning', 'contains', 'gradient_descent'),

  e('domain_tensor_algebra', 'contains', 'tensor'),
  e('domain_tensor_algebra', 'contains', 'elementwise_ops'),
  e('domain_tensor_algebra', 'contains', 'matrix_multiply'),
  e('domain_tensor_algebra', 'contains', 'multivariate_regression'),
  e('domain_tensor_algebra', 'contains', 'tensor_decomposition'),

  e('domain_neural_units', 'contains', 'activation_function'),  // umbrella — F9: sigmoid/relu routed through activation_function
  e('domain_neural_units', 'contains', 'fully_connected_network'),
  e('domain_neural_units', 'contains', 'lstm'),

  e('domain_convolution', 'contains', 'continuous_conv'),
  e('domain_convolution', 'contains', 'discrete_conv_2d'),
  e('domain_convolution', 'contains', 'cnn'),

  e('domain_norm_distance', 'contains', 'vector_norm'),
  e('domain_norm_distance', 'contains', 'matrix_norm'),
  e('domain_norm_distance', 'contains', 'distance_metric'),
  e('domain_norm_distance', 'contains', 'cosine_similarity'),

  e('domain_info_theory', 'contains', 'self_information'),
  e('domain_info_theory', 'contains', 'shannon_entropy'),
  e('domain_info_theory', 'contains', 'cross_entropy'),
  e('domain_info_theory', 'contains', 'kl_divergence'),

  // ── depends_on: Domain 1 — Function Learning ────────────────────────────────

  e('loss_function', 'depends_on', 'function'),
  e('optimization_function', 'depends_on', 'function'),
  e('gradient', 'depends_on', 'loss_function'),
  e('gradient', 'depends_on', 'function'),
  e('chain_rule', 'depends_on', 'gradient'),
  e('gradient_descent', 'depends_on', 'gradient'),
  e('backpropagation', 'depends_on', 'chain_rule'),
  e('basis_function_combination', 'depends_on', 'function'),
  e('polynomial_basis', 'depends_on', 'basis_function_combination'),
  e('trigonometric_basis', 'depends_on', 'basis_function_combination'),
  e('weierstrass_theorem', 'depends_on', 'polynomial_basis'),
  e('nonlinear_composition', 'depends_on', 'function'),
  e('fully_connected_network', 'depends_on', 'affine_transform'),
  e('fully_connected_network', 'depends_on', 'nonlinear_composition'),
  e('fully_connected_network', 'depends_on', 'relu'),
  e('universal_approximation', 'depends_on', 'fully_connected_network'),
  e('universal_approximation', 'depends_on', 'weierstrass_theorem'),

  // ── depends_on: Domain 2 — Tensor Algebra ───────────────────────────────────

  e('elementwise_ops', 'depends_on', 'tensor'),
  e('elementwise_add_scale', 'depends_on', 'elementwise_ops'),
  e('hadamard_product', 'depends_on', 'elementwise_ops'),
  e('matrix_multiply', 'depends_on', 'matrix'),
  e('matrix_multiply', 'depends_on', 'inner_product'),
  e('affine_transform', 'depends_on', 'matrix_multiply'),
  e('matrix_inverse', 'depends_on', 'matrix_multiply'),
  e('tensor_decomposition', 'depends_on', 'matrix_multiply'),
  e('tensor_decomposition', 'depends_on', 'tensor'),
  e('multivariate_regression', 'depends_on', 'matrix_multiply'),
  e('multivariate_regression', 'depends_on', 'mse_loss'),
  e('mse_loss', 'depends_on', 'loss_function'),
  e('least_squares', 'depends_on', 'matrix_inverse'),
  e('least_squares', 'depends_on', 'multivariate_regression'),

  // ── depends_on: Domain 3 — Neural Units ─────────────────────────────────────

  // Activation functions are elementwise ops applied in the neural context.
  // This cross-domain edge is intentional (課件2 groups them together for this reason).
  e('sigmoid', 'depends_on', 'elementwise_ops'),
  e('tanh_activation', 'depends_on', 'elementwise_ops'),
  e('relu', 'depends_on', 'elementwise_ops'),
  e('leaky_relu', 'depends_on', 'relu'),
  e('lstm', 'depends_on', 'tanh_activation'),
  e('lstm', 'depends_on', 'sigmoid'),
  e('resnet', 'depends_on', 'elementwise_add_scale'),

  // ── depends_on: Domain 4 — Convolution ──────────────────────────────────────

  e('discrete_conv_1d', 'depends_on', 'continuous_conv'),
  e('discrete_conv_1d', 'depends_on', 'inner_product'),
  e('padding_strategy', 'depends_on', 'discrete_conv_1d'),
  e('discrete_conv_2d', 'depends_on', 'discrete_conv_1d'),
  e('discrete_conv_2d', 'depends_on', 'hadamard_product'),
  e('sobel_kernel', 'depends_on', 'discrete_conv_2d'),
  e('cnn', 'depends_on', 'discrete_conv_2d'),
  e('cnn', 'depends_on', 'backpropagation'),
  e('cnn', 'depends_on', 'relu'),

  // ── depends_on: Domain 5 — Norms & Distances ────────────────────────────────

  e('inner_product', 'depends_on', 'vector'),
  e('l1_norm', 'depends_on', 'vector_norm'),
  e('l2_norm', 'depends_on', 'vector_norm'),
  e('l2_norm', 'depends_on', 'inner_product'),
  e('linf_norm', 'depends_on', 'vector_norm'),
  e('p_norm', 'depends_on', 'vector_norm'),
  e('cauchy_schwarz', 'depends_on', 'inner_product'),
  e('cauchy_schwarz', 'depends_on', 'l2_norm'),
  e('holder_inequality', 'depends_on', 'p_norm'),
  e('holder_inequality', 'depends_on', 'inner_product'),
  e('weighted_norm', 'depends_on', 'vector_norm'),
  e('weighted_norm', 'depends_on', 'matrix_multiply'),
  e('norm_equivalence', 'depends_on', 'vector_norm'),
  e('matrix_norm', 'depends_on', 'vector_norm'),
  e('matrix_norm', 'depends_on', 'matrix_multiply'),
  e('frobenius_norm', 'depends_on', 'matrix_norm'),
  e('induced_norm', 'depends_on', 'matrix_norm'),
  e('induced_norm', 'depends_on', 'vector_norm'),
  e('l0_pseudonorm', 'depends_on', 'matrix_norm'),
  e('distance_metric', 'depends_on', 'vector_norm'),
  e('euclid_distance', 'depends_on', 'distance_metric'),
  e('euclid_distance', 'depends_on', 'l2_norm'),
  e('manhattan_distance', 'depends_on', 'distance_metric'),
  e('manhattan_distance', 'depends_on', 'l1_norm'),
  e('chebyshev_distance', 'depends_on', 'distance_metric'),
  e('chebyshev_distance', 'depends_on', 'linf_norm'),
  e('mahalanobis_distance', 'depends_on', 'distance_metric'),
  e('mahalanobis_distance', 'depends_on', 'weighted_norm'),
  e('cosine_similarity', 'depends_on', 'inner_product'),
  e('cosine_similarity', 'depends_on', 'l2_norm'),
  e('cosine_similarity', 'depends_on', 'cauchy_schwarz'),
  e('pearson_correlation', 'depends_on', 'cosine_similarity'),

  // ── depends_on: Domain 6 — Information Theory ───────────────────────────────

  e('shannon_entropy', 'depends_on', 'self_information'),
  e('differential_entropy', 'depends_on', 'self_information'),
  e('joint_entropy', 'depends_on', 'shannon_entropy'),
  e('joint_entropy', 'depends_on', 'differential_entropy'),
  e('condition_entropy', 'depends_on', 'joint_entropy'),
  e('condition_entropy', 'depends_on', 'shannon_entropy'),
  e('mutual_information', 'depends_on', 'joint_entropy'),
  e('mutual_information', 'depends_on', 'condition_entropy'),
  e('entropy_extremum_discrete', 'depends_on', 'shannon_entropy'),
  e('entropy_extremum_continuous', 'depends_on', 'differential_entropy'),
  e('max_entropy_principle', 'depends_on', 'entropy_extremum_discrete'),
  e('max_entropy_principle', 'depends_on', 'entropy_extremum_continuous'),
  e('cross_entropy', 'depends_on', 'shannon_entropy'),
  e('kl_divergence', 'depends_on', 'cross_entropy'),
  e('kl_divergence', 'depends_on', 'shannon_entropy'),
  e('js_divergence', 'depends_on', 'kl_divergence'),

  // ── derived_from (A is a special case or derivation of B) ───────────────────

  // p-norm family
  e('l1_norm', 'derived_from', 'p_norm'),        // p = 1
  e('l2_norm', 'derived_from', 'p_norm'),        // p = 2
  e('linf_norm', 'derived_from', 'p_norm'),      // p → ∞
  e('cauchy_schwarz', 'derived_from', 'holder_inequality'), // p = q = 2 special case

  // Distance–norm correspondences
  e('euclid_distance', 'derived_from', 'l2_norm'),
  e('manhattan_distance', 'derived_from', 'l1_norm'),
  e('chebyshev_distance', 'derived_from', 'linf_norm'),
  e('mahalanobis_distance', 'derived_from', 'weighted_norm'),
  e('pearson_correlation', 'derived_from', 'cosine_similarity'),

  // Information theory
  e('kl_divergence', 'derived_from', 'cross_entropy'),  // D_KL = H(P,Q) − H(P)
  e('js_divergence', 'derived_from', 'kl_divergence'),

  // Neural network derivations
  e('leaky_relu', 'derived_from', 'relu'),
  e('mse_loss', 'derived_from', 'l2_norm'),      // MSE = (1/2l)‖ŷ−y‖₂²
  e('fully_connected_network', 'derived_from', 'nonlinear_composition'),
  e('least_squares', 'derived_from', 'matrix_inverse'),

  // Tensor hierarchy: tensor is the generalization containing lower-order cases
  e('tensor', 'contains', 'matrix'),
  e('tensor', 'contains', 'vector'),
  e('tensor', 'contains', 'scalar'),

  // ── enables (A makes B possible or theoretically justified) ─────────────────

  e('weierstrass_theorem', 'enables', 'universal_approximation'),
  e('nonlinear_composition', 'enables', 'fully_connected_network'),
  e('universal_approximation', 'enables', 'fully_connected_network'),
  e('gradient', 'enables', 'gradient_descent'),
  e('chain_rule', 'enables', 'backpropagation'),
  e('backpropagation', 'enables', 'cnn'),
  e('backpropagation', 'enables', 'fully_connected_network'),
  e('discrete_conv_2d', 'enables', 'cnn'),
  e('kl_divergence', 'enables', 'vae'),
  e('js_divergence', 'enables', 'gan'),
  e('max_entropy_principle', 'enables', 'vae'),   // justifies Gaussian prior
  // L1 is the convex relaxation that makes L0 optimization tractable
  e('l1_norm', 'enables', 'l0_pseudonorm'),

  // ── used_in (A appears in or directly supports B) ───────────────────────────

  e('hadamard_product', 'used_in', 'discrete_conv_2d'),  // local product-sum in conv
  e('hadamard_product', 'used_in', 'lstm'),              // gate mechanism
  e('elementwise_add_scale', 'used_in', 'resnet'),       // skip connection: F(x) + x
  e('affine_transform', 'used_in', 'fully_connected_network'),
  e('affine_transform', 'used_in', 'cnn'),
  e('matrix_multiply', 'used_in', 'fully_connected_network'),
  e('matrix_multiply', 'used_in', 'least_squares'),
  e('mse_loss', 'used_in', 'multivariate_regression'),
  e('gradient', 'used_in', 'gradient_descent'),
  e('gradient', 'used_in', 'backpropagation'),
  e('sobel_kernel', 'used_in', 'cnn'),                   // edge detection example
  e('leaky_relu', 'used_in', 'cnn'),
  e('sigmoid', 'used_in', 'lstm'),
  e('tanh_activation', 'used_in', 'lstm'),
  e('shannon_entropy', 'used_in', 'decision_tree'),
  e('mutual_information', 'used_in', 'decision_tree'),   // info gain = mutual info
  e('cross_entropy', 'used_in', 'cnn'),                  // classification loss
  e('kl_divergence', 'used_in', 'vae'),
  e('js_divergence', 'used_in', 'gan'),
  e('induced_norm', 'used_in', 'gan'),                   // spectral normalization
  e('frobenius_norm', 'used_in', 'tensor_decomposition'),// approximation error
  e('tensor_decomposition', 'used_in', 'alphatensor'),
  e('cosine_similarity', 'used_in', 'fully_connected_network'), // attention scoring
  e('jaccard_similarity', 'used_in', 'cnn'),             // IoU in object detection

  // ── measures (A quantifies or counts B) ─────────────────────────────────────

  e('vector_norm', 'measures', 'vector'),
  e('matrix_norm', 'measures', 'matrix'),
  // shannon_entropy depends_on self_information (already present); "measures" was imprecise — removed per audit F8.
  e('frobenius_norm', 'measures', 'matrix'),
  e('euclid_distance', 'measures', 'vector'),

  // ── regularizes (A controls complexity/sparsity of B) ───────────────────────

  e('l1_norm', 'regularizes', 'multivariate_regression'),     // Lasso
  e('l2_norm', 'regularizes', 'multivariate_regression'),     // Ridge
  e('l0_pseudonorm', 'regularizes', 'multivariate_regression'), // sparse ideal
  e('frobenius_norm', 'regularizes', 'fully_connected_network'), // weight decay
  e('induced_norm', 'regularizes', 'cnn'),                   // spectral norm for GAN

  // ── approximates (A approximates B) ─────────────────────────────────────────

  e('polynomial_basis', 'approximates', 'function'),          // Weierstrass theorem
  e('trigonometric_basis', 'approximates', 'function'),        // Fourier series
  e('fully_connected_network', 'approximates', 'function'),    // UAT
  e('discrete_conv_1d', 'approximates', 'continuous_conv'),   // discretization

  // ── optimizes (A minimizes or maximizes B) ──────────────────────────────────

  e('gradient_descent', 'optimizes', 'loss_function'),
  e('backpropagation', 'optimizes', 'loss_function'),
  e('least_squares', 'optimizes', 'mse_loss'),                // analytical optimum

  // ── Chain nodes: contains edges to member nodes ──────────────────────────────

  e('chain_supervised', 'contains', 'function'),
  e('chain_supervised', 'contains', 'loss_function'),
  e('chain_supervised', 'contains', 'gradient'),
  e('chain_supervised', 'contains', 'gradient_descent'),
  e('chain_supervised', 'contains', 'backpropagation'),

  e('chain_deep_network', 'contains', 'matrix_multiply'),
  e('chain_deep_network', 'contains', 'affine_transform'),
  e('chain_deep_network', 'contains', 'relu'),
  e('chain_deep_network', 'contains', 'nonlinear_composition'),
  e('chain_deep_network', 'contains', 'fully_connected_network'),

  e('chain_vision', 'contains', 'discrete_conv_2d'),
  e('chain_vision', 'contains', 'sobel_kernel'),
  e('chain_vision', 'contains', 'cnn'),

  e('chain_regularization', 'contains', 'vector_norm'),
  e('chain_regularization', 'contains', 'l1_norm'),
  e('chain_regularization', 'contains', 'l2_norm'),
  e('chain_regularization', 'contains', 'multivariate_regression'),

  e('chain_sparse', 'contains', 'l0_pseudonorm'),
  e('chain_sparse', 'contains', 'l1_norm'),
  e('chain_sparse', 'contains', 'multivariate_regression'),

  e('chain_prob_learning', 'contains', 'shannon_entropy'),
  e('chain_prob_learning', 'contains', 'cross_entropy'),
  e('chain_prob_learning', 'contains', 'kl_divergence'),
  e('chain_prob_learning', 'contains', 'cnn'),
  e('chain_prob_learning', 'contains', 'vae'),

  e('chain_similarity', 'contains', 'inner_product'),
  e('chain_similarity', 'contains', 'vector_norm'),
  e('chain_similarity', 'contains', 'euclid_distance'),
  e('chain_similarity', 'contains', 'cosine_similarity'),

  // ── F1: domain_chains hierarchy (7th top-level module) ──────────────────────
  e('domain_chains', 'contains', 'chain_supervised'),
  e('domain_chains', 'contains', 'chain_deep_network'),
  e('domain_chains', 'contains', 'chain_vision'),
  e('domain_chains', 'contains', 'chain_regularization'),
  e('domain_chains', 'contains', 'chain_sparse'),
  e('domain_chains', 'contains', 'chain_prob_learning'),
  e('domain_chains', 'contains', 'chain_similarity'),

  // ── F2: activation_function hierarchy ────────────────────────────────────────
  e('activation_function', 'contains', 'sigmoid'),
  e('activation_function', 'contains', 'tanh_activation'),
  e('activation_function', 'contains', 'relu'),
  e('activation_function', 'contains', 'leaky_relu'),
  e('activation_function', 'depends_on', 'elementwise_ops'),
  e('activation_function', 'enables', 'nonlinear_composition'),
  e('activation_function', 'used_in', 'fully_connected_network'),
  e('activation_function', 'used_in', 'cnn'),
];

// ─── Export ───────────────────────────────────────────────────────────────────

export const RAW_ONTOLOGY: OntologyGraph = {
  nodes,
  edges,
  version: '1.0.0',
};
