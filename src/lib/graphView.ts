/**
 * graphView.ts
 * Converts NormalizedGraph into React Flow node/edge arrays for each view mode.
 * All layout is deterministic — no force-directed physics.
 */

import type { Node as RFNode, Edge as RFEdge } from 'reactflow';
import { MarkerType } from 'reactflow';
import type {
  NormalizedGraph,
  OntologyEdge,
  OntologyNode,
  NodeType,
  EdgeType,
} from './graphTypes';
import { getSubgraph } from './normalizeGraph';
import { getNodeColours, EDGE_COLOUR } from './uiLabels';

// ─── Public types ─────────────────────────────────────────────────────────────

export type ViewMode = 'overview' | 'domain' | 'chain';

export interface NodeData {
  node: OntologyNode;
  colours: ReturnType<typeof getNodeColours>;
  isSelected: boolean;
  isDimmed: boolean;
}

// ─── Layout constants ─────────────────────────────────────────────────────────

const NODE_W = 182;   // standard node render width (px)
const NODE_H = 74;    // estimated node height for spacing
const H_GAP  = 52;    // horizontal gap between sibling subtree slots
const V_GAP  = 124;   // vertical gap between depth levels

// ─── Node factory ─────────────────────────────────────────────────────────────

function toRFNode(
  node: OntologyNode,
  x: number,
  y: number,
  selectedId: string | null,
  dimmedIds: Set<string>,
): RFNode<NodeData> {
  return {
    id: node.id,
    position: { x, y },
    type: 'ontologyNode',
    data: {
      node,
      colours: getNodeColours(node.type, node.id),
      isSelected: node.id === selectedId,
      // dimmedIds contains the non-matching nodes (the ones to dim)
      isDimmed: dimmedIds.has(node.id) && node.id !== selectedId,
    },
    style: { width: node.type === 'central' ? 224 : NODE_W },
    draggable:  false,
    selectable: true,
  };
}

// ─── Edge factories ───────────────────────────────────────────────────────────

/**
 * Structural containment edge.
 * Rendered as a dashed, lightweight gray line so the tree backbone stays
 * visually subordinate to the semantic edges.
 */
function toContainsEdge(edge: OntologyEdge): RFEdge {
  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: 'smoothstep',
    animated: false,
    style: {
      stroke: '#94a3b8',
      strokeWidth: 1.2,
      strokeDasharray: '6 4',
    },
    markerEnd: {
      type: MarkerType.Arrow,
      color: '#94a3b8',
      width: 10,
      height: 10,
    },
    data: { edge },
  };
}

/**
 * Semantic relationship edge.
 * Rendered as a solid, coloured line with a filled arrowhead so direction
 * and relationship type are immediately apparent.
 */
function toSemanticEdge(edge: OntologyEdge): RFEdge {
  const color = EDGE_COLOUR[edge.type];
  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: 'smoothstep',
    animated: false,
    style: { stroke: color, strokeWidth: 1.6 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color,
      width: 12,
      height: 12,
    },
    data: { edge },
  };
}

function toRFEdge(edge: OntologyEdge): RFEdge {
  return edge.type === 'contains' ? toContainsEdge(edge) : toSemanticEdge(edge);
}

// ─── Hierarchical tree layout ─────────────────────────────────────────────────

/**
 * Recursive, width-first tree layout.
 * Each leaf occupies a slot of (NODE_W + H_GAP).
 * Parents are centred over the union of their children's slots.
 */
function computeTreeLayout(
  rootId: string,
  childrenMap: Map<string, string[]>,
): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();

  function subtreeWidth(id: string): number {
    const children = childrenMap.get(id) ?? [];
    if (children.length === 0) return NODE_W + H_GAP;
    return children.reduce((sum, c) => sum + subtreeWidth(c), 0);
  }

  function assign(id: string, left: number, y: number): void {
    const children = childrenMap.get(id) ?? [];
    const sw = subtreeWidth(id);
    positions.set(id, { x: left + (sw - NODE_W) / 2, y });

    let cx = left;
    for (const child of children) {
      assign(child, cx, y + NODE_H + V_GAP);
      cx += subtreeWidth(child);
    }
  }

  assign(rootId, 0, 0);
  return positions;
}

// ─── Overview mode ────────────────────────────────────────────────────────────

export function getOverviewGraph(
  graph: NormalizedGraph,
  selectedId: string | null,
  dimmedIds: Set<string>,
): { nodes: RFNode<NodeData>[]; edges: RFEdge[] } {
  const central = graph.nodeIndex['ai_math_foundation'];
  const domainEdges = graph.adjacency['ai_math_foundation'].outgoing.filter(
    (e) => e.type === 'contains',
  );
  const domains = domainEdges
    .map((e) => graph.nodeIndex[e.target])
    .filter(Boolean) as OntologyNode[];

  const rfNodes: RFNode<NodeData>[] = [];
  const rfEdges: RFEdge[] = [];

  const n = domains.length;
  // Spacing between the left edges of consecutive domain nodes
  const SPACING = 228;
  const totalW  = SPACING * (n - 1) + NODE_W;
  const startX  = -totalW / 2;

  // Central node (224 px wide) centred over the domain row
  rfNodes.push(toRFNode(central, -(224 / 2), 0, selectedId, dimmedIds));

  domains.forEach((domain, i) => {
    rfNodes.push(toRFNode(domain, startX + i * SPACING, 272, selectedId, dimmedIds));
    rfEdges.push(toRFEdge(domainEdges[i]));
  });

  return { nodes: rfNodes, edges: rfEdges };
}

// ─── Domain focus mode ────────────────────────────────────────────────────────

export function getDomainGraph(
  graph: NormalizedGraph,
  domainId: string,
  selectedId: string | null,
  dimmedIds: Set<string>,
): { nodes: RFNode<NodeData>[]; edges: RFEdge[] } {
  const { nodes: subNodes, edges: containsEdges } = getSubgraph(graph, domainId, {
    depth: 3,
    edgeTypes: ['contains'],
    includeIncoming: false,
  });

  const visibleIds = new Set(subNodes.map((n) => n.id));

  // Collect semantic edges between visible nodes (excluding 'contains')
  const seenEdgeIds = new Set<string>(containsEdges.map((e) => e.id));
  const semanticEdges: OntologyEdge[] = [];

  for (const node of subNodes) {
    for (const edge of graph.adjacency[node.id]?.outgoing ?? []) {
      if (!seenEdgeIds.has(edge.id) && visibleIds.has(edge.target)) {
        seenEdgeIds.add(edge.id);
        semanticEdges.push(edge);
      }
    }
  }

  // Build children map (contains edges only) for tree layout
  const childrenMap = new Map<string, string[]>(subNodes.map((n) => [n.id, []]));
  for (const edge of containsEdges) {
    if (edge.type === 'contains') childrenMap.get(edge.source)?.push(edge.target);
  }

  const positions = computeTreeLayout(domainId, childrenMap);

  const rfNodes = subNodes.map((node) => {
    const pos = positions.get(node.id) ?? { x: 0, y: 0 };
    return toRFNode(node, pos.x, pos.y, selectedId, dimmedIds);
  });

  // Contains edges first (rendered below), semantic edges on top
  const rfEdges = [...containsEdges, ...semanticEdges].map(toRFEdge);

  return { nodes: rfNodes, edges: rfEdges };
}

// ─── Chain mode ───────────────────────────────────────────────────────────────

export function getChainGraph(
  graph: NormalizedGraph,
  selectedId: string | null,
  dimmedIds: Set<string>,
): { nodes: RFNode<NodeData>[]; edges: RFEdge[] } {
  const domainChains = graph.nodeIndex['domain_chains'];
  const chainEdges = graph.adjacency['domain_chains'].outgoing.filter(
    (e) => e.type === 'contains',
  );
  const chainNodes = chainEdges
    .map((e) => graph.nodeIndex[e.target])
    .filter((n): n is OntologyNode => n?.type === 'chain');

  const rfNodes: RFNode<NodeData>[] = [];
  const rfEdges: RFEdge[] = [];

  // domain_chains node centred at top
  rfNodes.push(toRFNode(domainChains, -(224 / 2), 0, selectedId, dimmedIds));

  // Chain nodes: 4 per row, each row centred
  const COLS  = 4;
  const COL_W = 228;
  const ROW_H = 208;

  chainNodes.forEach((node, i) => {
    const row      = Math.floor(i / COLS);
    const col      = i % COLS;
    const rowCount = Math.min(COLS, chainNodes.length - row * COLS);
    const rowW     = COL_W * (rowCount - 1) + NODE_W;
    const rowX     = -rowW / 2;
    rfNodes.push(
      toRFNode(node, rowX + col * COL_W, 230 + row * ROW_H, selectedId, dimmedIds),
    );
  });

  chainEdges.forEach((e) => rfEdges.push(toRFEdge(e)));

  return { nodes: rfNodes, edges: rfEdges };
}

// ─── Filter application ───────────────────────────────────────────────────────

/**
 * Applies node-type and edge-type visibility filters.
 * Central and domain nodes are always kept as structural anchors.
 */
export function applyFilters(
  nodes: RFNode<NodeData>[],
  edges: RFEdge[],
  visibleNodeTypes: Set<NodeType>,
  visibleEdgeTypes: Set<EdgeType>,
): { nodes: RFNode<NodeData>[]; edges: RFEdge[] } {
  const filteredNodes = nodes.filter(
    (n) =>
      n.data.node.type === 'central' ||
      n.data.node.type === 'domain'  ||
      visibleNodeTypes.has(n.data.node.type),
  );

  const visibleIds = new Set(filteredNodes.map((n) => n.id));

  const filteredEdges = edges.filter(
    (e) =>
      visibleEdgeTypes.has((e.data as { edge: OntologyEdge }).edge.type) &&
      visibleIds.has(e.source) &&
      visibleIds.has(e.target),
  );

  return { nodes: filteredNodes, edges: filteredEdges };
}
