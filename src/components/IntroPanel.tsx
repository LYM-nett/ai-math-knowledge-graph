/**
 * IntroPanel.tsx
 * Full-screen intro overlay shown on first load.
 * Covers: course context, stats, domain badges, navigation guide.
 */

import type { NormalizedGraph } from '../lib/graphTypes';
import { DOMAIN_COLOURS } from '../lib/uiLabels';

// ─── Constants ────────────────────────────────────────────────────────────────

const DOMAIN_ORDER = [
  'domain_function_learning',
  'domain_tensor_algebra',
  'domain_neural_units',
  'domain_convolution',
  'domain_norm_distance',
  'domain_info_theory',
  'domain_chains',
];

const MODES = [
  {
    icon: '◎',
    title: '总览模式',
    desc: '查看 7 大数学领域与核心主题的全局关联结构，点击领域节点可进入聚焦视图。',
  },
  {
    icon: '⊕',
    title: '领域聚焦',
    desc: '深入展开单一领域的知识树，呈现从理论到方法、算法再到应用的层次关系。',
  },
  {
    icon: '⛓',
    title: '应用链条',
    desc: '追溯从数学原理到 AI 实际应用的完整路径，可视化 7 条核心知识链。',
  },
] as const;

// ─── Props ────────────────────────────────────────────────────────────────────

interface IntroProps {
  graph: NormalizedGraph;
  onClose: () => void;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCell({ value, label }: { value: number; label: string }) {
  return (
    <div
      style={{
        flex: 1,
        textAlign: 'center',
        padding: '14px 0',
      }}
    >
      <div
        style={{
          fontSize:           30,
          fontWeight:         800,
          color:              '#0f172a',
          lineHeight:         1,
          fontVariantNumeric: 'tabular-nums',
          letterSpacing:      '-0.01em',
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 5, letterSpacing: '0.04em' }}>
        {label}
      </div>
    </div>
  );
}

function ModeCard({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div
      style={{
        background:   '#f8fafc',
        border:       '1px solid #e2e8f0',
        borderRadius: 10,
        padding:      '18px 20px',
      }}
    >
      <div
        style={{
          fontSize:     22,
          marginBottom: 10,
          color:        '#1d4ed8',
          fontWeight:   300,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize:      13,
          fontWeight:    700,
          color:         '#0f172a',
          marginBottom:  7,
          letterSpacing: '0.01em',
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.7 }}>{desc}</div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function IntroPanel({ graph, onClose }: IntroProps) {
  const nodeCount   = graph.nodes.length;
  const edgeCount   = graph.edges.length;
  const domainCount = graph.nodes.filter((n) => n.type === 'domain').length;
  const chainCount  = graph.nodes.filter((n) => n.type === 'chain').length;

  return (
    <div
      style={{
        position:       'fixed',
        inset:          0,
        zIndex:         1000,
        background:     'rgba(15, 23, 42, 0.88)',
        backdropFilter: 'blur(6px)',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        24,
      }}
    >
      <div
        style={{
          background:   '#ffffff',
          borderRadius: 16,
          maxWidth:     820,
          width:        '100%',
          maxHeight:    '92vh',
          overflowY:    'auto',
          boxShadow:    '0 32px 96px rgba(0,0,0,0.45)',
          display:      'flex',
          flexDirection:'column',
        }}
      >
        {/* ── Dark header ── */}
        <div
          style={{
            background:               '#0f172a',
            borderRadius:             '16px 16px 0 0',
            padding:                  '36px 44px 32px',
            flexShrink:               0,
            borderBottom:             '3px solid #f59e0b',
          }}
        >
          <div
            style={{
              fontSize:      10,
              color:         '#64748b',
              letterSpacing: '0.14em',
              marginBottom:  12,
              textTransform: 'uppercase',
              fontWeight:    600,
            }}
          >
            数据科学微专业 &nbsp;·&nbsp; 人工智能数学基础
          </div>

          <h1
            style={{
              fontSize:      26,
              fontWeight:    800,
              color:         '#f1f5f9',
              lineHeight:    1.25,
              margin:        0,
              letterSpacing: '0.01em',
            }}
          >
            《人工智能的数学基础》
          </h1>

          <h2
            style={{
              fontSize:      20,
              fontWeight:    600,
              color:         '#f59e0b',
              margin:        '5px 0 0',
              lineHeight:    1.3,
              letterSpacing: '0.01em',
            }}
          >
            知识图谱可视化系统
          </h2>

          <p
            style={{
              fontSize:   13,
              color:      '#94a3b8',
              marginTop:  14,
              lineHeight: 1.8,
              maxWidth:   580,
            }}
          >
            本图谱基于课程讲义系统梳理核心数学知识体系，建立数学理论、计算方法
            与人工智能应用之间的知识关联网络，以供课程学习与复习参考。
          </p>
        </div>

        {/* ── Stats row ── */}
        <div
          style={{
            display:       'flex',
            borderBottom:  '1px solid #f1f5f9',
            padding:       '4px 44px',
            gap:           0,
          }}
        >
          {([
            { value: nodeCount,   label: '知识节点' },
            { value: edgeCount,   label: '知识关联' },
            { value: domainCount, label: '核心领域' },
            { value: chainCount,  label: '应用链条' },
          ] as const).map(({ value, label }, i) => (
            <div
              key={label}
              style={{
                flex:        1,
                borderRight: i < 3 ? '1px solid #f1f5f9' : 'none',
              }}
            >
              <StatCell value={value} label={label} />
            </div>
          ))}
        </div>

        {/* ── Body ── */}
        <div style={{ padding: '28px 44px 36px', flex: 1 }}>

          {/* Domain badges */}
          <div style={{ marginBottom: 28 }}>
            <SectionLabel>涵盖领域</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {DOMAIN_ORDER.map((domainId) => {
                const node = graph.nodeIndex[domainId];
                if (!node) return null;
                const c = DOMAIN_COLOURS[domainId] ?? {
                  bg: '#f8fafc', border: '#475569', text: '#1e293b', badge: '#475569',
                };
                return (
                  <span
                    key={domainId}
                    style={{
                      display:      'inline-block',
                      padding:      '6px 14px',
                      borderRadius: 6,
                      background:   c.bg,
                      border:       `1.5px solid ${c.border}`,
                      color:        c.text,
                      fontSize:     12,
                      fontWeight:   500,
                      letterSpacing:'0.01em',
                    }}
                  >
                    {node.label}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Mode guide */}
          <div style={{ marginBottom: 32 }}>
            <SectionLabel>使用指南</SectionLabel>
            <div
              style={{
                display:             'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap:                 12,
              }}
            >
              {MODES.map((m) => (
                <ModeCard key={m.title} {...m} />
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={onClose}
              style={{
                padding:       '13px 44px',
                borderRadius:  8,
                border:        'none',
                background:    '#1d4ed8',
                color:         '#ffffff',
                fontSize:      14,
                fontWeight:    700,
                cursor:        'pointer',
                fontFamily:    'inherit',
                letterSpacing: '0.03em',
                boxShadow:     '0 4px 14px rgba(29,78,216,0.4)',
                transition:    'background 0.15s ease, transform 0.1s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = '#1e40af';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = '#1d4ed8';
              }}
            >
              开始探索知识图谱 →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Tiny helper ───────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize:      10,
        fontWeight:    700,
        color:         '#94a3b8',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        marginBottom:  12,
      }}
    >
      {children}
    </div>
  );
}
