/**
 * normalizeGraph.ts
 * Processing pipeline and query utilities for the AI Math ontology.
 *
 * Pipeline:
 *   RAW_ONTOLOGY → validateGraph → normalizeGraph → query functions
 *
 * All query functions operate on NormalizedGraph for O(1) node/edge lookups.
 * None of these functions mutate the input graph.
 */

import type {
  AliasMap,
  EdgeType,
  NodeType,
  NormalizedGraph,
  OntologyEdge,
  OntologyGraph,
  OntologyNode,
  SubgraphOptions,
  ValidationError,
  ValidationResult,
} from './graphTypes';
import { RAW_ONTOLOGY } from './ontology';

// ─── Alias Map ───────────────────────────────────────────────────────────────

/**
 * Builds a flat map from every alias and canonical label to its canonical node ID.
 * Used to resolve raw Chinese prerequisite strings from JSON source files.
 *
 * Precedence: canonical label > alias.
 * Duplicate aliases across nodes are flagged as warnings (not errors).
 */
export function buildAliasMap(graph: OntologyGraph): AliasMap {
  const map: AliasMap = {};

  for (const node of graph.nodes) {
    // Always map the canonical label
    map[node.label] = node.id;
    if (node.labelEn) {
      map[node.labelEn] = node.id;
    }
    // Map every alias
    for (const alias of node.aliases ?? []) {
      if (map[alias] !== undefined && map[alias] !== node.id) {
        console.warn(
          `[ontology] Alias collision: "${alias}" maps to both "${map[alias]}" and "${node.id}". Using "${node.id}".`,
        );
      }
      map[alias] = node.id;
    }
  }

  return map;
}

/**
 * Resolves a raw Chinese concept name (as it appears in a JSON prerequisite array)
 * to a canonical node ID. Returns undefined if no match found.
 */
export function resolveAlias(name: string, aliasMap: AliasMap): string | undefined {
  return aliasMap[name];
}

// ─── Validation ───────────────────────────────────────────────────────────────

/**
 * Checks the raw ontology for structural integrity.
 * Does not validate semantic correctness of edges — only structural validity.
 */
export function validateGraph(graph: OntologyGraph): ValidationResult {
  const errors: ValidationError[] = [];
  const nodeIds = new Set(graph.nodes.map((n) => n.id));
  const seenNodeIds = new Set<string>();

  for (const node of graph.nodes) {
    if (seenNodeIds.has(node.id)) {
      errors.push({
        type: 'duplicate_node_id',
        message: `Duplicate node ID: "${node.id}"`,
        nodeId: node.id,
      });
    }
    seenNodeIds.add(node.id);
  }

  for (const edge of graph.edges) {
    if (edge.source === edge.target) {
      errors.push({
        type: 'self_loop',
        message: `Self-loop on node "${edge.source}" (edge "${edge.id}")`,
        edgeId: edge.id,
        nodeId: edge.source,
      });
    }
    if (!nodeIds.has(edge.source)) {
      errors.push({
        type: 'missing_edge_source',
        message: `Edge "${edge.id}" references missing source node "${edge.source}"`,
        edgeId: edge.id,
        nodeId: edge.source,
      });
    }
    if (!nodeIds.has(edge.target)) {
      errors.push({
        type: 'missing_edge_target',
        message: `Edge "${edge.id}" references missing target node "${edge.target}"`,
        edgeId: edge.id,
        nodeId: edge.target,
      });
    }
  }

  return { valid: errors.length === 0, errors };
}

// ─── Normalization Pipeline ───────────────────────────────────────────────────

/**
 * Full normalization pipeline.
 * Validates the graph, then builds fast lookup indexes.
 * Throws if there are structural errors (call validateGraph first to inspect them).
 */
export function normalizeGraph(graph: OntologyGraph): NormalizedGraph {
  const validation = validateGraph(graph);
  if (!validation.valid) {
    const summary = validation.errors.map((e) => e.message).join('\n');
    throw new Error(`Ontology validation failed:\n${summary}`);
  }

  const aliasMap = buildAliasMap(graph);

  const nodeIndex: Record<string, OntologyNode> = {};
  for (const node of graph.nodes) {
    nodeIndex[node.id] = node;
  }

  const adjacency: NormalizedGraph['adjacency'] = {};
  for (const node of graph.nodes) {
    adjacency[node.id] = { outgoing: [], incoming: [] };
  }
  for (const edge of graph.edges) {
    adjacency[edge.source].outgoing.push(edge);
    adjacency[edge.target].incoming.push(edge);
  }

  return { ...graph, aliasMap, nodeIndex, adjacency };
}

// ─── Query Functions ─────────────────────────────────────────────────────────

/** Returns all nodes of the given type. */
export function getNodesByType(graph: NormalizedGraph, type: NodeType): OntologyNode[] {
  return graph.nodes.filter((n) => n.type === type);
}

/** Returns all nodes belonging to the given domain ID. */
export function getNodesByDomain(graph: NormalizedGraph, domainId: string): OntologyNode[] {
  return graph.nodes.filter((n) => n.domain === domainId);
}

/** Returns all outgoing edges from a node, optionally filtered by edge type. */
export function getOutgoingEdges(
  graph: NormalizedGraph,
  nodeId: string,
  edgeTypes?: EdgeType[],
): OntologyEdge[] {
  const edges = graph.adjacency[nodeId]?.outgoing ?? [];
  if (!edgeTypes) return edges;
  const typeSet = new Set(edgeTypes);
  return edges.filter((e) => typeSet.has(e.type));
}

/** Returns all incoming edges to a node, optionally filtered by edge type. */
export function getIncomingEdges(
  graph: NormalizedGraph,
  nodeId: string,
  edgeTypes?: EdgeType[],
): OntologyEdge[] {
  const edges = graph.adjacency[nodeId]?.incoming ?? [];
  if (!edgeTypes) return edges;
  const typeSet = new Set(edgeTypes);
  return edges.filter((e) => typeSet.has(e.type));
}

/** Returns all direct neighbors of a node (both directions by default). */
export function getNeighbors(
  graph: NormalizedGraph,
  nodeId: string,
  direction: 'outgoing' | 'incoming' | 'both' = 'both',
  edgeTypes?: EdgeType[],
): OntologyNode[] {
  const neighborIds = new Set<string>();

  if (direction !== 'incoming') {
    for (const edge of getOutgoingEdges(graph, nodeId, edgeTypes)) {
      neighborIds.add(edge.target);
    }
  }
  if (direction !== 'outgoing') {
    for (const edge of getIncomingEdges(graph, nodeId, edgeTypes)) {
      neighborIds.add(edge.source);
    }
  }

  return [...neighborIds].map((id) => graph.nodeIndex[id]).filter(Boolean);
}

/**
 * Returns a subgraph reachable from rootId up to `depth` hops.
 * Includes all edges where both endpoints are in the result set.
 *
 * Use for hierarchical expansion: start at a domain node (depth=1 shows anchors,
 * depth=2 shows concepts, etc.).
 */
export function getSubgraph(
  graph: NormalizedGraph,
  rootId: string,
  options: SubgraphOptions,
): { nodes: OntologyNode[]; edges: OntologyEdge[] } {
  const { depth, edgeTypes, includeIncoming = false } = options;

  if (!graph.nodeIndex[rootId]) {
    return { nodes: [], edges: [] };
  }

  const visited = new Set<string>([rootId]);
  const queue: Array<{ id: string; level: number }> = [{ id: rootId, level: 0 }];

  while (queue.length > 0) {
    const item = queue.shift()!;
    if (item.level >= depth) continue;

    const outgoing = getOutgoingEdges(graph, item.id, edgeTypes);
    const incoming = includeIncoming
      ? getIncomingEdges(graph, item.id, edgeTypes)
      : [];

    const candidateIds = [
      ...outgoing.map((e) => e.target),
      ...incoming.map((e) => e.source),
    ];

    for (const neighborId of candidateIds) {
      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        queue.push({ id: neighborId, level: item.level + 1 });
      }
    }
  }

  const subNodes = [...visited].map((id) => graph.nodeIndex[id]).filter(Boolean);

  // Only include edges where both endpoints are in the visited set
  const subEdges = graph.edges.filter(
    (edge) => visited.has(edge.source) && visited.has(edge.target),
  );

  // If edgeTypes filter is active, apply it to the included edges too
  const filteredEdges = edgeTypes
    ? subEdges.filter((e) => (edgeTypes as string[]).includes(e.type))
    : subEdges;

  return { nodes: subNodes, edges: filteredEdges };
}

/**
 * Searches nodes by label, aliases, or definition.
 * Case-insensitive. Returns nodes sorted by relevance (exact match first).
 */
export function searchNodes(graph: NormalizedGraph, query: string): OntologyNode[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();

  const exactLabel: OntologyNode[] = [];
  const partialLabel: OntologyNode[] = [];
  const aliasMatch: OntologyNode[] = [];
  const definitionMatch: OntologyNode[] = [];

  for (const node of graph.nodes) {
    const label = node.label.toLowerCase();
    const labelEn = node.labelEn?.toLowerCase() ?? '';

    if (label === q || labelEn === q) {
      exactLabel.push(node);
    } else if (label.includes(q) || labelEn.includes(q)) {
      partialLabel.push(node);
    } else if (node.aliases?.some((a) => a.toLowerCase().includes(q))) {
      aliasMatch.push(node);
    } else if (node.definition?.toLowerCase().includes(q)) {
      definitionMatch.push(node);
    }
  }

  return [...exactLabel, ...partialLabel, ...aliasMatch, ...definitionMatch];
}

/**
 * Returns all nodes that are prerequisites (direct or transitive) of the given node.
 * Uses only `depends_on` and `derived_from` edges (the "mathematical dependency" edges).
 */
export function getPrerequisites(
  graph: NormalizedGraph,
  nodeId: string,
  maxDepth = 5,
): OntologyNode[] {
  const prereqEdgeTypes: EdgeType[] = ['depends_on', 'derived_from'];
  const result = getSubgraph(graph, nodeId, {
    depth: maxDepth,
    edgeTypes: prereqEdgeTypes,
    includeIncoming: false,
  });
  // Remove the root node itself from the result
  return result.nodes.filter((n) => n.id !== nodeId);
}

/**
 * Returns the chain nodes that contain the given concept node.
 * Useful for showing which learning paths a concept participates in.
 */
export function getChainsForNode(graph: NormalizedGraph, nodeId: string): OntologyNode[] {
  return getIncomingEdges(graph, nodeId, ['contains'])
    .map((e) => graph.nodeIndex[e.source])
    .filter((n) => n?.type === 'chain');
}

/**
 * Returns all application nodes that depend on (directly or transitively) the given node.
 * Useful for showing "this concept powers these AI systems".
 */
export function getDownstreamApplications(
  graph: NormalizedGraph,
  nodeId: string,
  maxDepth = 4,
): OntologyNode[] {
  const enableEdgeTypes: EdgeType[] = ['enables', 'used_in'];
  const visited = new Set<string>([nodeId]);
  const queue: Array<{ id: string; level: number }> = [{ id: nodeId, level: 0 }];
  const applications: OntologyNode[] = [];

  while (queue.length > 0) {
    const item = queue.shift()!;
    if (item.level >= maxDepth) continue;

    for (const edge of getOutgoingEdges(graph, item.id, enableEdgeTypes)) {
      if (!visited.has(edge.target)) {
        visited.add(edge.target);
        const targetNode = graph.nodeIndex[edge.target];
        if (targetNode) {
          if (targetNode.type === 'application') {
            applications.push(targetNode);
          }
          queue.push({ id: edge.target, level: item.level + 1 });
        }
      }
    }
  }

  return applications;
}

// ─── Singleton — pre-normalized graph ────────────────────────────────────────

/**
 * Pre-normalized singleton. Import this for all query operations.
 * Validation runs at module load time and throws if the ontology is malformed.
 */
let _graph: NormalizedGraph | null = null;

export function getGraph(): NormalizedGraph {
  if (!_graph) {
    _graph = normalizeGraph(RAW_ONTOLOGY);
  }
  return _graph;
}

// ─── Convenience re-exports ───────────────────────────────────────────────────

export type { AliasMap, NormalizedGraph, OntologyEdge, OntologyNode, ValidationResult };
