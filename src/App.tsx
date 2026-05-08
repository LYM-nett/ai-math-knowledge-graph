/**
 * App.tsx
 * Root component: layout, state management, view orchestration.
 */

import { useState, useMemo, useCallback } from 'react';
import type { NodeType, EdgeType } from './lib/graphTypes';
import type { ViewMode } from './lib/graphView';
import {
  getOverviewGraph,
  getDomainGraph,
  getChainGraph,
  applyFilters,
} from './lib/graphView';
import { getGraph, searchNodes } from './lib/normalizeGraph';
import { UI } from './lib/uiLabels';
import GraphCanvas    from './components/GraphCanvas';
import Sidebar        from './components/Sidebar';
import DetailPanel    from './components/DetailPanel';
import Legend         from './components/Legend';
import ViewModeSelector from './components/ViewModeSelector';
import IntroPanel     from './components/IntroPanel';

// ─── Filterable type lists ────────────────────────────────────────────────────

const ALL_NODE_TYPES: NodeType[] = [
  'theory', 'method', 'concept', 'formula',
  'algorithm', 'application', 'chain',
];

const ALL_EDGE_TYPES: EdgeType[] = [
  'contains', 'depends_on', 'derived_from', 'enables',
  'used_in', 'optimizes', 'measures', 'regularizes', 'approximates',
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function App() {
  const graph = useMemo(() => getGraph(), []);

  // ── View state ──────────────────────────────────────────────────────────────
  const [viewMode,       setViewMode]       = useState<ViewMode>('overview');
  const [focusedDomainId, setFocusedDomainId] = useState<string | null>(null);
  const [selectedNodeId,  setSelectedNodeId]  = useState<string | null>(null);
  const [showIntro,       setShowIntro]       = useState<boolean>(true);

  // ── Filter state ────────────────────────────────────────────────────────────
  const [searchQuery,      setSearchQuery]      = useState('');
  const [visibleNodeTypes, setVisibleNodeTypes] = useState<Set<NodeType>>(
    new Set(ALL_NODE_TYPES),
  );
  const [visibleEdgeTypes, setVisibleEdgeTypes] = useState<Set<EdgeType>>(
    new Set(ALL_EDGE_TYPES),
  );

  // ── Dimmed nodes (nodes NOT matching the current search) ────────────────────
  const dimmedIds = useMemo<Set<string>>(() => {
    if (!searchQuery.trim()) return new Set();
    const matchIds = new Set(searchNodes(graph, searchQuery).map((n) => n.id));
    return new Set(graph.nodes.filter((n) => !matchIds.has(n.id)).map((n) => n.id));
  }, [graph, searchQuery]);

  // ── Raw graph data for the current view ─────────────────────────────────────
  const { nodes: rawNodes, edges: rawEdges } = useMemo(() => {
    if (viewMode === 'overview') {
      return getOverviewGraph(graph, selectedNodeId, dimmedIds);
    }
    if (viewMode === 'domain' && focusedDomainId) {
      return getDomainGraph(graph, focusedDomainId, selectedNodeId, dimmedIds);
    }
    return getChainGraph(graph, selectedNodeId, dimmedIds);
  }, [viewMode, focusedDomainId, graph, selectedNodeId, dimmedIds]);

  // ── Apply type filters ───────────────────────────────────────────────────────
  const { nodes, edges } = useMemo(
    () => applyFilters(rawNodes, rawEdges, visibleNodeTypes, visibleEdgeTypes),
    [rawNodes, rawEdges, visibleNodeTypes, visibleEdgeTypes],
  );

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleNodeSelect = useCallback(
    (nodeId: string) => {
      const node = graph.nodeIndex[nodeId];
      if (!node) return;
      setSelectedNodeId(nodeId);
      // In overview: clicking a domain switches to domain focus
      if (viewMode === 'overview' && node.type === 'domain') {
        if (nodeId === 'domain_chains') {
          setViewMode('chain');
          setFocusedDomainId(null);
        } else {
          setViewMode('domain');
          setFocusedDomainId(nodeId);
        }
      }
    },
    [graph, viewMode],
  );

  const handleModuleClick = useCallback((domainId: string) => {
    if (domainId === 'domain_chains') {
      setViewMode('chain');
      setFocusedDomainId(null);
    } else {
      setViewMode('domain');
      setFocusedDomainId(domainId);
    }
    setSelectedNodeId(domainId);
  }, []);

  const handleBackToOverview = useCallback(() => {
    setViewMode('overview');
    setFocusedDomainId(null);
    setSelectedNodeId(null);
  }, []);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    if (mode !== 'domain') setFocusedDomainId(null);
    setSelectedNodeId(null);
  }, []);

  const handleNodeTypeToggle = useCallback((t: NodeType) => {
    setVisibleNodeTypes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t); else next.add(t);
      return next;
    });
  }, []);

  const handleEdgeTypeToggle = useCallback((t: EdgeType) => {
    setVisibleEdgeTypes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t); else next.add(t);
      return next;
    });
  }, []);

  // ── Hint text for the current view ──────────────────────────────────────────
  const viewHint = useMemo(() => {
    if (viewMode === 'overview') return UI.overviewHint;
    if (viewMode === 'chain')    return UI.chainModeHint;
    if (viewMode === 'domain' && focusedDomainId) {
      return `聚焦：${graph.nodeIndex[focusedDomainId]?.label ?? ''}`;
    }
    return '';
  }, [viewMode, focusedDomainId, graph]);

  // ── Layout ───────────────────────────────────────────────────────────────────
  return (
    <>
      <div
        style={{
          display:       'flex',
          flexDirection: 'column',
          height:        '100vh',
          width:         '100vw',
          overflow:      'hidden',
        }}
      >
        {/* ── Header ── */}
        <header
          style={{
            flexShrink:      0,
            background:      '#0f172a',
            borderBottom:    '1px solid #1e3a5f',
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'space-between',
            padding:         '0 20px',
            gap:             16,
            minHeight:       60,
          }}
        >
          {/* Title block */}
          <div style={{ flexShrink: 0 }}>
            <h1
              style={{
                fontSize:      15,
                fontWeight:    800,
                color:         '#f1f5f9',
                whiteSpace:    'nowrap',
                letterSpacing: '0.01em',
                lineHeight:    1.2,
              }}
            >
              {UI.appTitle}
            </h1>
            <div
              style={{
                fontSize:      10,
                color:         '#475569',
                letterSpacing: '0.06em',
                marginTop:     3,
                textTransform: 'uppercase',
                fontWeight:    600,
              }}
            >
              {UI.appSubtitle}
            </div>
          </div>

          {/* Mode switcher */}
          <ViewModeSelector current={viewMode} onChange={handleViewModeChange} />

          {/* Right controls */}
          <div
            style={{
              display:    'flex',
              alignItems: 'center',
              gap:        10,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                fontSize:  11,
                color:     '#475569',
                whiteSpace:'nowrap',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {nodes.length}&nbsp;{UI.statsNodes}&nbsp;
              <span style={{ color: '#2d3f55' }}>·</span>
              &nbsp;{edges.length}&nbsp;{UI.statsEdges}
            </div>

            {/* Info button — re-opens intro */}
            <button
              onClick={() => setShowIntro(true)}
              title={UI.aboutGraph}
              style={{
                width:          26,
                height:         26,
                borderRadius:   '50%',
                border:         '1px solid #334155',
                background:     '#1e293b',
                color:          '#64748b',
                fontSize:       13,
                cursor:         'pointer',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                transition:     'all 0.15s ease',
                fontFamily:     'inherit',
                flexShrink:     0,
              }}
              onMouseEnter={(e) => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.background = '#334155';
                btn.style.color      = '#e2e8f0';
              }}
              onMouseLeave={(e) => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.background = '#1e293b';
                btn.style.color      = '#64748b';
              }}
            >
              ？
            </button>
          </div>
        </header>

        {/* ── Main row ── */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

          {/* Left sidebar */}
          <Sidebar
            graph={graph}
            viewMode={viewMode}
            focusedDomainId={focusedDomainId}
            selectedNodeId={selectedNodeId}
            searchQuery={searchQuery}
            visibleNodeTypes={visibleNodeTypes}
            visibleEdgeTypes={visibleEdgeTypes}
            onSearch={setSearchQuery}
            onModuleClick={handleModuleClick}
            onNodeSelect={handleNodeSelect}
            onNodeTypeToggle={handleNodeTypeToggle}
            onEdgeTypeToggle={handleEdgeTypeToggle}
            onBackToOverview={handleBackToOverview}
          />

          {/* Canvas area */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            <GraphCanvas
              nodes={nodes}
              edges={edges}
              viewMode={viewMode}
              focusedDomainId={focusedDomainId}
              onNodeSelect={handleNodeSelect}
            />

            {/* Legend overlay */}
            <Legend />

            {/* View-mode hint badge */}
            {viewHint && (
              <div
                style={{
                  position:        'absolute',
                  top:             14,
                  left:            '50%',
                  transform:       'translateX(-50%)',
                  background:      'rgba(15,23,42,0.78)',
                  color:           '#94a3b8',
                  fontSize:        11,
                  padding:         '4px 14px',
                  borderRadius:    20,
                  pointerEvents:   'none',
                  backdropFilter:  'blur(6px)',
                  whiteSpace:      'nowrap',
                  border:          '1px solid rgba(100,116,139,0.2)',
                  letterSpacing:   '0.02em',
                }}
              >
                {viewHint}
              </div>
            )}
          </div>

          {/* Right detail panel */}
          <DetailPanel graph={graph} selectedNodeId={selectedNodeId} />
        </div>
      </div>

      {/* Intro panel overlay */}
      {showIntro && (
        <IntroPanel graph={graph} onClose={() => setShowIntro(false)} />
      )}
    </>
  );
}
