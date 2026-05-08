/**
 * uiLabels.ts
 * Central registry: Chinese UI copy, type translations, and colour tokens.
 *
 * Colour design principles:
 *   central   — dark navy + gold: apex node, immediately stands out
 *   domain    — per-domain accent on white: primary navigation tier
 *   theory    — indigo/blue: academic rigour
 *   method    — amber/orange: practical application
 *   concept   — emerald: fundamental building blocks
 *   formula   — violet: mathematical abstraction
 *   algorithm — teal: computational systematism
 *   application — rose: real-world impact
 *   chain     — indigo: integrative workflow
 */

import type { NodeType, EdgeType } from './graphTypes';

// ─── Type label maps ──────────────────────────────────────────────────────────

export const NODE_TYPE_LABEL: Record<NodeType, string> = {
  central:     '中心节点',
  domain:      '一级领域',
  theory:      '核心理论',
  method:      '具体方法',
  concept:     '数学概念',
  formula:     '核心公式',
  algorithm:   '算法',
  application: 'AI 应用',
  chain:       '应用链条',
};

export const EDGE_TYPE_LABEL: Record<EdgeType, string> = {
  contains:     '包含',
  depends_on:   '前置依赖',
  derived_from: '推导自',
  enables:      '支撑',
  used_in:      '应用于',
  optimizes:    '优化',
  measures:     '度量',
  regularizes:  '正则化',
  approximates: '逼近',
};

// ─── Colour scheme type ───────────────────────────────────────────────────────

export interface ColourScheme {
  bg: string;
  border: string;
  text: string;
  badge: string;
}

// ─── Node colour tokens ───────────────────────────────────────────────────────

export const NODE_COLOURS: Record<NodeType, ColourScheme> = {
  central:     { bg: '#0f172a', border: '#f59e0b', text: '#fef3c7', badge: '#f59e0b' },
  domain:      { bg: '#f8fafc', border: '#475569', text: '#1e293b', badge: '#475569' },
  theory:      { bg: '#eff6ff', border: '#1d4ed8', text: '#1e3a8a', badge: '#1d4ed8' },
  method:      { bg: '#fff7ed', border: '#c2410c', text: '#7c2d12', badge: '#c2410c' },
  concept:     { bg: '#f0fdf4', border: '#15803d', text: '#14532d', badge: '#15803d' },
  formula:     { bg: '#faf5ff', border: '#7e22ce', text: '#3b0764', badge: '#7e22ce' },
  algorithm:   { bg: '#ecfdf5', border: '#047857', text: '#064e3b', badge: '#047857' },
  application: { bg: '#fff1f2', border: '#be123c', text: '#4c0519', badge: '#be123c' },
  chain:       { bg: '#eef2ff', border: '#4338ca', text: '#1e1b4b', badge: '#4338ca' },
};

/** Per-domain colour overrides — each domain has a distinct identity. */
export const DOMAIN_COLOURS: Record<string, ColourScheme> = {
  domain_function_learning: { bg: '#eff6ff', border: '#1d4ed8', text: '#1e3a8a', badge: '#1d4ed8' },
  domain_tensor_algebra:    { bg: '#fdf4ff', border: '#7e22ce', text: '#3b0764', badge: '#7e22ce' },
  domain_neural_units:      { bg: '#f0fdf4', border: '#15803d', text: '#14532d', badge: '#15803d' },
  domain_convolution:       { bg: '#fff7ed', border: '#c2410c', text: '#7c2d12', badge: '#c2410c' },
  domain_norm_distance:     { bg: '#f0fdfa', border: '#0e7490', text: '#164e63', badge: '#0e7490' },
  domain_info_theory:       { bg: '#fefce8', border: '#b45309', text: '#451a03', badge: '#b45309' },
  domain_chains:            { bg: '#eef2ff', border: '#4338ca', text: '#1e1b4b', badge: '#4338ca' },
};

/** Returns the colour scheme for a node, with domain-specific overrides. */
export function getNodeColours(nodeType: NodeType, nodeId: string): ColourScheme {
  if (nodeType === 'domain' && DOMAIN_COLOURS[nodeId]) return DOMAIN_COLOURS[nodeId];
  return NODE_COLOURS[nodeType];
}

// ─── Edge colour tokens ───────────────────────────────────────────────────────

export const EDGE_COLOUR: Record<EdgeType, string> = {
  contains:     '#94a3b8',  // slate — structural backbone (rendered dashed)
  depends_on:   '#2563eb',  // blue — prerequisite dependency
  derived_from: '#0d9488',  // teal — mathematical derivation
  enables:      '#16a34a',  // green — enablement / unlocks
  used_in:      '#ea580c',  // orange — application usage
  optimizes:    '#dc2626',  // red — optimisation target
  measures:     '#9333ea',  // purple — quantification
  regularizes:  '#92400e',  // dark amber — regularisation
  approximates: '#db2777',  // pink — approximation
};

// ─── UI copy ──────────────────────────────────────────────────────────────────

export const UI = {
  appTitle:            '《人工智能的数学基础》知识图谱',
  appSubtitle:         '知识体系可视化',
  searchPlaceholder:   '搜索概念、公式、算法或应用…',
  moduleListTitle:     '一级模块',
  nodeTypeFilterTitle: '节点类型',
  edgeTypeFilterTitle: '边关系类型',
  noNodeSelected:      '点击图中节点查看详情',
  backToOverview:      '← 返回总览',
  overviewHint:        '点击一级模块进入聚焦视图',
  chainModeHint:       '点击应用链条节点查看成员',
  legendTitle:         '图例',
  nodeTypeLegend:      '节点类型',
  edgeTypeLegend:      '边类型',
  statsNodes:          '节点',
  statsEdges:          '关系',
  searchResults:       '搜索结果',
  noResults:           '未找到匹配节点',
  implicitLabel:       '隐式推断节点',
  aboutGraph:          '关于图谱',
  // Detail panel labels
  fieldDomain:         '所属领域',
  fieldDefinition:     '定义',
  fieldFormula:        '核心公式',
  fieldPrereqs:        '前置知识',
  fieldDownstream:     '后续关联',
  fieldAlgorithms:     '相关算法',
  fieldApplications:   'AI 应用',
  fieldSources:        '来源文件',
  fieldImplicit:       '节点性质',
  fieldImplicitReason: '隐式说明',
  fieldAllEdges:       '全部关系',
} as const;

// ─── View mode labels ─────────────────────────────────────────────────────────

export const VIEW_MODE_LABEL = {
  overview: '总览模式',
  domain:   '领域聚焦',
  chain:    '应用链条',
} as const;
