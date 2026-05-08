/**
 * DetailPanel.tsx
 * Right-side panel showing full details for the selected node.
 */

import type { NormalizedGraph, OntologyNode } from '../lib/graphTypes';
import {
  NODE_TYPE_LABEL,
  EDGE_TYPE_LABEL,
  UI,
  getNodeColours,
} from '../lib/uiLabels';
import { getIncomingEdges, getOutgoingEdges } from '../lib/normalizeGraph';

// ─── Field row ────────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          fontSize:      9,
          fontWeight:    700,
          color:         '#94a3b8',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom:  6,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

// ─── Node chip ────────────────────────────────────────────────────────────────

function NodeChip({ node }: { node: OntologyNode }) {
  const c = getNodeColours(node.type, node.id);
  return (
    <span
      style={{
        display:      'inline-block',
        padding:      '3px 9px',
        borderRadius: 5,
        background:   c.bg,
        border:       `1px solid ${c.border}`,
        color:        c.text,
        fontSize:     11,
        fontWeight:   500,
        marginRight:  5,
        marginBottom: 5,
        letterSpacing:'0.01em',
        lineHeight:   1.5,
      }}
    >
      {node.label}
    </span>
  );
}

// ─── Edge row ─────────────────────────────────────────────────────────────────

function EdgeRow({ label, target }: { label: string; target: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4, fontSize: 12 }}>
      <span
        style={{
          flexShrink:    0,
          minWidth:      56,
          fontSize:      10,
          fontWeight:    700,
          color:         '#6366f1',
          letterSpacing: '0.03em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
      <span style={{ color: '#374151' }}>{target}</span>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface DetailPanelProps {
  graph: NormalizedGraph;
  selectedNodeId: string | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DetailPanel({ graph, selectedNodeId }: DetailPanelProps) {
  /* Empty state */
  if (!selectedNodeId) {
    return (
      <aside
        style={{
          width:          292,
          flexShrink:     0,
          background:     '#ffffff',
          borderLeft:     '1px solid #e2e8f0',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          padding:        24,
        }}
      >
        <div style={{ textAlign: 'center', color: '#cbd5e1' }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>🔍</div>
          <div style={{ fontSize: 12, lineHeight: 1.6, color: '#94a3b8' }}>
            {UI.noNodeSelected}
          </div>
        </div>
      </aside>
    );
  }

  const node = graph.nodeIndex[selectedNodeId];
  if (!node) return null;

  const colours = getNodeColours(node.type, node.id);

  /* Derived edge data */
  const outgoing = getOutgoingEdges(graph, node.id);
  const incoming = getIncomingEdges(graph, node.id);

  const prereqs = outgoing
    .filter((e) => e.type === 'depends_on' || e.type === 'derived_from')
    .map((e) => graph.nodeIndex[e.target])
    .filter((n): n is OntologyNode => Boolean(n));

  const downstream = incoming
    .filter((e) => e.type === 'enables' || e.type === 'used_in' || e.type === 'approximates')
    .map((e) => graph.nodeIndex[e.source])
    .filter((n): n is OntologyNode => Boolean(n));

  const algorithms = [
    ...outgoing.filter((e) => e.type === 'used_in').map((e) => graph.nodeIndex[e.target]),
    ...incoming.filter((e) => e.type === 'used_in').map((e) => graph.nodeIndex[e.source]),
  ]
    .filter((n): n is OntologyNode => n?.type === 'algorithm')
    .filter((n, i, arr) => arr.findIndex((x) => x.id === n.id) === i);

  const applications = [
    ...outgoing.filter((e) => e.type === 'used_in' || e.type === 'enables').map((e) => graph.nodeIndex[e.target]),
    ...incoming.filter((e) => e.type === 'used_in' || e.type === 'enables').map((e) => graph.nodeIndex[e.source]),
  ]
    .filter((n): n is OntologyNode => n?.type === 'application')
    .filter((n, i, arr) => arr.findIndex((x) => x.id === n.id) === i);

  const domainNode = node.domain ? graph.nodeIndex[node.domain] : null;

  return (
    <aside
      style={{
        width:          292,
        flexShrink:     0,
        background:     '#ffffff',
        borderLeft:     '1px solid #e2e8f0',
        overflowY:      'auto',
        display:        'flex',
        flexDirection:  'column',
      }}
    >
      {/* ── Node header ── */}
      <div
        style={{
          background:   colours.bg,
          borderBottom: `3px solid ${colours.border}`,
          padding:      '18px 20px 16px',
          flexShrink:   0,
        }}
      >
        {/* Type badge */}
        <div
          style={{
            display:       'inline-block',
            fontSize:      9,
            fontWeight:    700,
            color:         colours.badge,
            background:    `${colours.badge}1a`,
            borderRadius:  4,
            padding:       '2px 8px',
            marginBottom:  10,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {NODE_TYPE_LABEL[node.type]}
        </div>

        {/* Chinese label */}
        <h2
          style={{
            fontSize:      16,
            fontWeight:    800,
            color:         colours.text,
            lineHeight:    1.3,
            margin:        0,
            letterSpacing: '0.01em',
            wordBreak:     'keep-all',
          }}
        >
          {node.label}
        </h2>

        {/* English label */}
        {node.labelEn && (
          <div
            style={{
              fontSize:      11,
              color:         colours.text + '88',
              marginTop:     5,
              fontStyle:     'italic',
              lineHeight:    1.4,
              letterSpacing: '0.01em',
            }}
          >
            {node.labelEn}
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div style={{ padding: '18px 20px', flex: 1 }}>

        {/* Domain */}
        {domainNode && (
          <Field label={UI.fieldDomain}>
            <span
              style={{
                color:      getNodeColours(domainNode.type, domainNode.id).badge,
                fontWeight: 600,
                fontSize:   12,
              }}
            >
              {domainNode.label}
            </span>
          </Field>
        )}

        {/* Definition */}
        {node.definition && (
          <Field label={UI.fieldDefinition}>
            <span style={{ color: '#1e293b', lineHeight: 1.75 }}>{node.definition}</span>
          </Field>
        )}

        {/* Formula */}
        {node.formula && (
          <Field label={UI.fieldFormula}>
            <code
              style={{
                display:    'block',
                background: '#f8fafc',
                border:     '1px solid #e2e8f0',
                borderLeft: '3px solid #7e22ce',
                borderRadius: '0 6px 6px 0',
                padding:    '10px 12px',
                fontSize:   11.5,
                fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
                lineHeight: 1.6,
                color:      '#1e293b',
                overflowX:  'auto',
                whiteSpace: 'pre-wrap',
                wordBreak:  'break-all',
              }}
            >
              {node.formula}
            </code>
          </Field>
        )}

        {/* Prerequisites */}
        {prereqs.length > 0 && (
          <Field label={UI.fieldPrereqs}>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {prereqs.map((n) => <NodeChip key={n.id} node={n} />)}
            </div>
          </Field>
        )}

        {/* Downstream */}
        {downstream.length > 0 && (
          <Field label={UI.fieldDownstream}>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {downstream.map((n) => <NodeChip key={n.id} node={n} />)}
            </div>
          </Field>
        )}

        {/* Algorithms */}
        {algorithms.length > 0 && (
          <Field label={UI.fieldAlgorithms}>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {algorithms.map((n) => <NodeChip key={n.id} node={n} />)}
            </div>
          </Field>
        )}

        {/* Applications */}
        {applications.length > 0 && (
          <Field label={UI.fieldApplications}>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {applications.map((n) => <NodeChip key={n.id} node={n} />)}
            </div>
          </Field>
        )}

        {/* Sources */}
        {node.sources.length > 0 && (
          <Field label={UI.fieldSources}>
            {node.sources.map((s, i) => (
              <div key={i} style={{ marginBottom: 3, fontSize: 11 }}>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>{s.file}</span>
                {s.topic && (
                  <span style={{ color: '#64748b' }}>
                    &nbsp;›&nbsp;{s.topic}
                  </span>
                )}
              </div>
            ))}
          </Field>
        )}

        {/* Implicit node notice */}
        {node.implicit && (
          <Field label={UI.fieldImplicit}>
            <span
              style={{
                display:      'inline-block',
                padding:      '3px 10px',
                borderRadius: 4,
                background:   '#fef9c3',
                border:       '1px solid #fde047',
                color:        '#713f12',
                fontSize:     10,
                fontWeight:   600,
                letterSpacing:'0.03em',
              }}
            >
              {UI.implicitLabel}
            </span>
          </Field>
        )}

        {node.implicit && node.implicitReason && (
          <Field label={UI.fieldImplicitReason}>
            <div
              style={{
                background:   '#fefce8',
                border:       '1px solid #fde68a',
                borderLeft:   '3px solid #f59e0b',
                borderRadius: '0 6px 6px 0',
                padding:      '9px 11px',
                fontSize:     11,
                color:        '#713f12',
                lineHeight:   1.7,
              }}
            >
              {node.implicitReason}
            </div>
          </Field>
        )}

        {/* All edge relations */}
        {outgoing.length > 0 && (
          <Field label={UI.fieldAllEdges}>
            <div
              style={{
                background:   '#f8fafc',
                border:       '1px solid #e2e8f0',
                borderRadius: 7,
                padding:      '10px 12px',
              }}
            >
              {outgoing.map((e) => {
                const target = graph.nodeIndex[e.target];
                return target ? (
                  <EdgeRow
                    key={e.id}
                    label={EDGE_TYPE_LABEL[e.type]}
                    target={target.label}
                  />
                ) : null;
              })}
            </div>
          </Field>
        )}
      </div>
    </aside>
  );
}
