/**
 * GraphCanvas.tsx
 * React Flow canvas with the OntologyNodeCard custom node.
 *
 * Design decisions:
 *  - Node component is defined at module level → React Flow never re-mounts it.
 *  - isDimmed is applied as inline opacity (no className toggling needed).
 *  - English label shown only on central / domain nodes to reduce clutter.
 *  - Contains edges are dashed+gray; semantic edges are solid+coloured.
 */

import { memo, useCallback } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeTypes,
  type NodeProps,
} from 'reactflow';
import type { NodeData, ViewMode } from '../lib/graphView';
import { NODE_TYPE_LABEL } from '../lib/uiLabels';

// ─── Custom node card ─────────────────────────────────────────────────────────

const OntologyNodeCard = memo(function OntologyNodeCard({
  data,
}: NodeProps<NodeData>) {
  const { node, colours, isSelected, isDimmed } = data;
  const isCentral = node.type === 'central';
  const isDomain  = node.type === 'domain';

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={{ opacity: 0, pointerEvents: 'none' }}
      />

      <div
        style={{
          background:   colours.bg,
          border:       `${isSelected ? 2.5 : 2}px solid ${isSelected ? '#f59e0b' : colours.border}`,
          borderRadius: isCentral ? 12 : 8,
          padding:      isCentral ? '16px 22px' : '10px 14px',
          boxShadow:    isSelected
            ? '0 0 0 3px rgba(245,158,11,0.25), 0 6px 20px rgba(0,0,0,0.18)'
            : '0 1px 4px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.06)',
          cursor:     'pointer',
          userSelect: 'none',
          opacity:    isDimmed ? 0.18 : 1,
          transition: 'opacity 0.2s ease, box-shadow 0.15s ease, border-color 0.15s ease',
          // Left accent strip for visual type-cue on non-central, non-domain nodes
          ...(!isCentral && !isDomain
            ? { borderLeft: `4px solid ${colours.border}` }
            : {}),
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
            borderRadius:  3,
            padding:       '1px 6px',
            marginBottom:  5,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
          }}
        >
          {NODE_TYPE_LABEL[node.type]}
        </div>

        {/* Chinese label */}
        <div
          style={{
            fontSize:      isCentral ? 15 : isDomain ? 13 : 12,
            fontWeight:    isCentral ? 800 : isDomain ? 700 : 600,
            color:         colours.text,
            lineHeight:    1.4,
            wordBreak:     'keep-all',
            letterSpacing: '0.015em',
          }}
        >
          {node.label}
        </div>

        {/* English subtitle — only for central / domain (avoid clutter in deep views) */}
        {node.labelEn && (isCentral || isDomain) && (
          <div
            style={{
              fontSize:      10,
              color:         colours.text + '80',
              marginTop:     3,
              fontStyle:     'italic',
              lineHeight:    1.35,
              letterSpacing: '0.01em',
            }}
          >
            {node.labelEn}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ opacity: 0, pointerEvents: 'none' }}
      />
    </>
  );
});

// Module-level constant — prevents React Flow re-mounting nodes on re-render
const nodeTypes: NodeTypes = { ontologyNode: OntologyNodeCard };

// ─── Props ────────────────────────────────────────────────────────────────────

interface GraphCanvasProps {
  nodes: Node<NodeData>[];
  edges: Edge[];
  viewMode: ViewMode;
  focusedDomainId: string | null;
  onNodeSelect: (nodeId: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function GraphCanvas({
  nodes,
  edges,
  viewMode,
  focusedDomainId,
  onNodeSelect,
}: GraphCanvasProps) {
  // Changing the key forces ReactFlow to remount → fitView re-runs
  const viewKey = `${viewMode}__${focusedDomainId ?? 'none'}`;

  const handleNodeClick = useCallback(
    (_evt: React.MouseEvent, rfNode: Node<NodeData>) => {
      onNodeSelect(rfNode.id);
    },
    [onNodeSelect],
  );

  const miniMapColor = useCallback(
    (n: Node<NodeData>) => n.data.colours.border,
    [],
  );

  return (
    <ReactFlow
      key={viewKey}
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodeClick={handleNodeClick}
      fitView
      fitViewOptions={{ padding: 0.14, maxZoom: 1.1 }}
      minZoom={0.08}
      maxZoom={2.5}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
    >
      {/* Subtle dot grid — academic "graph paper" feel */}
      <Background
        variant={BackgroundVariant.Dots}
        gap={30}
        size={1}
        color="#dde3ec"
        style={{ background: '#f7f9fc' }}
      />

      {/* Zoom / fit controls */}
      <Controls
        showInteractive={false}
        position="bottom-left"
        style={{ marginBottom: 12, marginLeft: 12 }}
      />

      {/* Mini-map */}
      <MiniMap
        nodeColor={miniMapColor}
        maskColor="rgba(247,249,252,0.82)"
        style={{
          background:   '#f1f5f9',
          border:       '1px solid #e2e8f0',
          borderRadius: 8,
        }}
        position="bottom-right"
      />
    </ReactFlow>
  );
}
