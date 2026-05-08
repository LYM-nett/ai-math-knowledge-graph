/**
 * Legend.tsx
 * Collapsible colour legend overlaid at the bottom-left of the canvas.
 */

import { useState } from 'react';
import { NODE_TYPE_LABEL, EDGE_TYPE_LABEL, NODE_COLOURS, EDGE_COLOUR } from '../lib/uiLabels';
import type { NodeType, EdgeType } from '../lib/graphTypes';

const NODE_TYPES: NodeType[] = [
  'central', 'domain', 'theory', 'method',
  'concept', 'formula', 'algorithm', 'application', 'chain',
];

const EDGE_TYPES: EdgeType[] = [
  'contains', 'depends_on', 'derived_from', 'enables',
  'used_in', 'optimizes', 'measures', 'regularizes', 'approximates',
];

export default function Legend() {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        position:     'absolute',
        bottom:       60,
        left:         12,
        zIndex:       10,
        background:   'rgba(255,255,255,0.97)',
        border:       '1px solid #e2e8f0',
        borderRadius: 10,
        boxShadow:    '0 4px 16px rgba(0,0,0,0.10)',
        overflow:     'hidden',
        maxWidth:     210,
        backdropFilter: 'blur(6px)',
      }}
    >
      {/* Toggle header */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width:          '100%',
          padding:        '7px 12px',
          background:     open ? '#f1f5f9' : '#f8fafc',
          border:         'none',
          borderBottom:   open ? '1px solid #e2e8f0' : 'none',
          cursor:         'pointer',
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'center',
          fontFamily:     'inherit',
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', letterSpacing: '0.04em' }}>
          图  例
        </span>
        <span style={{ fontSize: 9, color: '#94a3b8', letterSpacing: '0.05em' }}>
          {open ? '收起 ▲' : '展开 ▼'}
        </span>
      </button>

      {open && (
        <div style={{ padding: '10px 14px 12px', fontSize: 11 }}>

          {/* Node types */}
          <div
            style={{
              fontSize:      9,
              fontWeight:    700,
              color:         '#94a3b8',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom:  8,
            }}
          >
            节点类型
          </div>

          {NODE_TYPES.map((t) => (
            <div
              key={t}
              style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}
            >
              <div
                style={{
                  width:        11,
                  height:       11,
                  borderRadius: t === 'central' ? 3 : 3,
                  background:   NODE_COLOURS[t].bg,
                  border:       `2px solid ${NODE_COLOURS[t].border}`,
                  flexShrink:   0,
                }}
              />
              <span style={{ color: '#374151', lineHeight: 1 }}>
                {NODE_TYPE_LABEL[t]}
              </span>
            </div>
          ))}

          {/* Edge types */}
          <div
            style={{
              fontSize:      9,
              fontWeight:    700,
              color:         '#94a3b8',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginTop:     10,
              marginBottom:  8,
              paddingTop:    8,
              borderTop:     '1px solid #f1f5f9',
            }}
          >
            边关系类型
          </div>

          {EDGE_TYPES.map((t) => (
            <div
              key={t}
              style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}
            >
              {/* Line swatch: dashed for contains, solid for others */}
              {t === 'contains' ? (
                <svg width="20" height="6" style={{ flexShrink: 0 }}>
                  <line
                    x1="0" y1="3" x2="20" y2="3"
                    stroke={EDGE_COLOUR[t]}
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />
                </svg>
              ) : (
                <svg width="20" height="6" style={{ flexShrink: 0 }}>
                  <line
                    x1="0" y1="3" x2="20" y2="3"
                    stroke={EDGE_COLOUR[t]}
                    strokeWidth="2"
                  />
                  <polygon
                    points="20,0 20,6 26,3"
                    fill={EDGE_COLOUR[t]}
                    transform="translate(-6, 0)"
                  />
                </svg>
              )}
              <span style={{ color: '#374151', lineHeight: 1 }}>
                {EDGE_TYPE_LABEL[t]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
