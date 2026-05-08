/**
 * Sidebar.tsx
 * Left panel: search, module list, node-type filter, edge-type filter.
 */

import type { NodeType, EdgeType, NormalizedGraph } from '../lib/graphTypes';
import type { ViewMode } from '../lib/graphView';
import {
  NODE_TYPE_LABEL,
  EDGE_TYPE_LABEL,
  UI,
  DOMAIN_COLOURS,
  NODE_COLOURS,
  EDGE_COLOUR,
} from '../lib/uiLabels';
import { searchNodes } from '../lib/normalizeGraph';

// ─── Constants ────────────────────────────────────────────────────────────────

const ALL_NODE_TYPES: NodeType[] = [
  'theory', 'method', 'concept', 'formula',
  'algorithm', 'application', 'chain',
];

const ALL_EDGE_TYPES: EdgeType[] = [
  'contains', 'depends_on', 'derived_from', 'enables',
  'used_in', 'optimizes', 'measures', 'regularizes', 'approximates',
];

const DOMAIN_ORDER = [
  'domain_function_learning',
  'domain_tensor_algebra',
  'domain_neural_units',
  'domain_convolution',
  'domain_norm_distance',
  'domain_info_theory',
  'domain_chains',
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface SidebarProps {
  graph: NormalizedGraph;
  viewMode: ViewMode;
  focusedDomainId: string | null;
  selectedNodeId: string | null;
  searchQuery: string;
  visibleNodeTypes: Set<NodeType>;
  visibleEdgeTypes: Set<EdgeType>;
  onSearch: (q: string) => void;
  onModuleClick: (domainId: string) => void;
  onNodeSelect: (nodeId: string) => void;
  onNodeTypeToggle: (t: NodeType) => void;
  onEdgeTypeToggle: (t: EdgeType) => void;
  onBackToOverview: () => void;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return (
    <div
      style={{
        fontSize:      9,
        fontWeight:    700,
        color:         '#475569',
        letterSpacing: '0.11em',
        textTransform: 'uppercase',
        padding:       '12px 16px 6px',
        borderTop:     '1px solid #1e3a5f',
        marginTop:     2,
      }}
    >
      {title}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Sidebar({
  graph,
  viewMode,
  focusedDomainId,
  selectedNodeId,
  searchQuery,
  visibleNodeTypes,
  visibleEdgeTypes,
  onSearch,
  onModuleClick,
  onNodeSelect,
  onNodeTypeToggle,
  onEdgeTypeToggle,
  onBackToOverview,
}: SidebarProps) {
  const searchResults =
    searchQuery.trim().length > 0
      ? searchNodes(graph, searchQuery).slice(0, 12)
      : [];

  return (
    <aside
      style={{
        width:          256,
        flexShrink:     0,
        background:     '#0b1120',
        borderRight:    '1px solid #1e3a5f',
        display:        'flex',
        flexDirection:  'column',
        overflowY:      'auto',
      }}
    >
      {/* ── Search ── */}
      <div style={{ padding: '14px 12px 10px' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={UI.searchPlaceholder}
          style={{
            width:      '100%',
            padding:    '8px 12px',
            borderRadius: 7,
            border:     '1px solid #1e3a5f',
            background: '#131d2e',
            color:      '#e2e8f0',
            fontSize:   12,
            outline:    'none',
            fontFamily: 'inherit',
            letterSpacing: '0.01em',
            transition: 'border-color 0.15s ease',
          }}
          onFocus={(e) => {
            (e.currentTarget as HTMLInputElement).style.borderColor = '#3b82f6';
          }}
          onBlur={(e) => {
            (e.currentTarget as HTMLInputElement).style.borderColor = '#1e3a5f';
          }}
        />
      </div>

      {/* ── Search results ── */}
      {searchResults.length > 0 && (
        <>
          <SectionHeader title={UI.searchResults} />
          <div style={{ padding: '2px 8px 6px' }}>
            {searchResults.map((node) => (
              <button
                key={node.id}
                onClick={() => onNodeSelect(node.id)}
                style={{
                  display:    'block',
                  width:      '100%',
                  textAlign:  'left',
                  padding:    '6px 8px',
                  borderRadius: 5,
                  border:     'none',
                  background: selectedNodeId === node.id ? '#1e40af' : 'transparent',
                  color:      selectedNodeId === node.id ? '#ffffff' : '#cbd5e1',
                  fontSize:   12,
                  cursor:     'pointer',
                  fontFamily: 'inherit',
                  marginBottom: 1,
                  letterSpacing: '0.01em',
                  transition: 'background 0.1s ease',
                }}
              >
                <span
                  style={{
                    fontSize:      9,
                    color:         '#475569',
                    marginRight:   5,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    fontWeight:    600,
                  }}
                >
                  {NODE_TYPE_LABEL[node.type]}
                </span>
                {node.label}
              </button>
            ))}
          </div>
        </>
      )}

      {searchQuery.trim().length > 0 && searchResults.length === 0 && (
        <div style={{ padding: '8px 16px', fontSize: 11, color: '#475569' }}>
          {UI.noResults}
        </div>
      )}

      {/* ── Back button (non-overview modes) ── */}
      {viewMode !== 'overview' && (
        <div style={{ padding: '8px 12px 4px' }}>
          <button
            onClick={onBackToOverview}
            style={{
              padding:    '5px 10px',
              borderRadius: 5,
              border:     '1px solid #1e3a5f',
              background: 'transparent',
              color:      '#60a5fa',
              fontSize:   11,
              cursor:     'pointer',
              fontFamily: 'inherit',
              letterSpacing: '0.01em',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#1e293b';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            }}
          >
            {UI.backToOverview}
          </button>
        </div>
      )}

      {/* ── Module list ── */}
      <SectionHeader title={UI.moduleListTitle} />
      <div style={{ padding: '4px 8px 8px' }}>
        {DOMAIN_ORDER.map((domainId) => {
          const node    = graph.nodeIndex[domainId];
          if (!node) return null;
          const colours = DOMAIN_COLOURS[domainId] ?? NODE_COLOURS.domain;
          const isActive =
            (viewMode === 'domain' && focusedDomainId === domainId) ||
            (viewMode === 'chain'  && domainId === 'domain_chains');

          return (
            <button
              key={domainId}
              onClick={() => onModuleClick(domainId)}
              style={{
                display:     'flex',
                alignItems:  'center',
                gap:         9,
                width:       '100%',
                textAlign:   'left',
                padding:     '7px 10px',
                borderRadius: 6,
                border:      isActive ? `1.5px solid ${colours.border}` : '1.5px solid transparent',
                background:  isActive ? `${colours.border}16` : 'transparent',
                color:       isActive ? colours.border : '#94a3b8',
                fontSize:    12,
                fontWeight:  isActive ? 700 : 400,
                cursor:      'pointer',
                fontFamily:  'inherit',
                marginBottom: 1,
                letterSpacing: '0.01em',
                transition:  'all 0.12s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.color = '#e2e8f0';
                  (e.currentTarget as HTMLButtonElement).style.background = '#131d2e';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8';
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                }
              }}
            >
              {/* Colour dot */}
              <div
                style={{
                  width:     7,
                  height:    7,
                  borderRadius: '50%',
                  background: colours.border,
                  flexShrink: 0,
                  opacity:   isActive ? 1 : 0.6,
                }}
              />
              <span style={{ lineHeight: 1.35 }}>{node.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Node type filter ── */}
      <SectionHeader title={UI.nodeTypeFilterTitle} />
      <div style={{ padding: '4px 14px 8px' }}>
        {ALL_NODE_TYPES.map((t) => {
          const on = visibleNodeTypes.has(t);
          return (
            <label
              key={t}
              style={{
                display:    'flex',
                alignItems: 'center',
                gap:        7,
                marginBottom: 5,
                cursor:     'pointer',
                fontSize:   11,
                color:      on ? '#cbd5e1' : '#334155',
                transition: 'color 0.15s ease',
                letterSpacing: '0.01em',
              }}
            >
              <input
                type="checkbox"
                checked={on}
                onChange={() => onNodeTypeToggle(t)}
                style={{ accentColor: NODE_COLOURS[t].border, cursor: 'pointer' }}
              />
              <div
                style={{
                  width:     9,
                  height:    9,
                  borderRadius: 2,
                  background: on ? NODE_COLOURS[t].bg : '#1e293b',
                  border:    `1.5px solid ${on ? NODE_COLOURS[t].border : '#334155'}`,
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                }}
              />
              {NODE_TYPE_LABEL[t]}
            </label>
          );
        })}
      </div>

      {/* ── Edge type filter ── */}
      <SectionHeader title={UI.edgeTypeFilterTitle} />
      <div style={{ padding: '4px 14px 16px' }}>
        {ALL_EDGE_TYPES.map((t) => {
          const on = visibleEdgeTypes.has(t);
          return (
            <label
              key={t}
              style={{
                display:    'flex',
                alignItems: 'center',
                gap:        7,
                marginBottom: 5,
                cursor:     'pointer',
                fontSize:   11,
                color:      on ? '#cbd5e1' : '#334155',
                transition: 'color 0.15s ease',
                letterSpacing: '0.01em',
              }}
            >
              <input
                type="checkbox"
                checked={on}
                onChange={() => onEdgeTypeToggle(t)}
                style={{ accentColor: '#3b82f6', cursor: 'pointer' }}
              />
              {/* Edge line swatch */}
              <div
                style={{
                  width:      18,
                  height:     2,
                  background: on ? EDGE_COLOUR[t] : '#334155',
                  flexShrink: 0,
                  borderRadius: 1,
                  ...(t === 'contains'
                    ? { backgroundImage: `repeating-linear-gradient(90deg, ${on ? EDGE_COLOUR[t] : '#334155'} 0 5px, transparent 5px 8px)`, background: 'none' }
                    : {}),
                }}
              />
              {EDGE_TYPE_LABEL[t]}
            </label>
          );
        })}
      </div>
    </aside>
  );
}
