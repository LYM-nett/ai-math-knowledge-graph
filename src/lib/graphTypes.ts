/**
 * graphTypes.ts
 * Core type definitions for the AI Mathematics knowledge graph ontology.
 * No data — only types and interfaces.
 */

// ─── Node Types ─────────────────────────────────────────────────────────────

/**
 * central   – the single root node of the entire graph
 * domain    – top-level chapter (7 total: 6 lecture domains + 1 chain meta-domain)
 * theory    – foundational theorem, axiom system, or formal definition
 * method    – computational procedure applied during learning or inference
 * concept   – specific mathematical object (norm, distance, entropy measure)
 * formula   – reserved for detail-panel display; not rendered as primary node
 * algorithm – named algorithm with specific computational steps
 * application – AI model, system, or architecture
 * chain     – meta-node representing a learning path through concept nodes
 */
export type NodeType =
  | 'central'
  | 'domain'
  | 'theory'
  | 'method'
  | 'concept'
  | 'formula'
  | 'algorithm'
  | 'application'
  | 'chain';

// ─── Edge Types ──────────────────────────────────────────────────────────────

/**
 * contains     – structural hierarchy: parent includes child
 * depends_on   – A requires B to be understood (prerequisite)
 * derived_from – A is a special case or mathematical derivation of B
 * enables      – A makes B possible or theoretically justified
 * used_in      – A appears in or directly supports B
 * measures     – A quantifies or counts B
 * regularizes  – A controls the complexity or sparsity of B
 * approximates – A approximates B (function approximation context)
 * optimizes    – A minimizes or maximizes B
 */
export type EdgeType =
  | 'contains'
  | 'depends_on'
  | 'derived_from'
  | 'enables'
  | 'used_in'
  | 'measures'
  | 'regularizes'
  | 'approximates'
  | 'optimizes';

// ─── Source Traceability ─────────────────────────────────────────────────────

/** Records which source JSON file and topic entry contributes to a node. */
export interface SourceRef {
  /** Filename without extension, e.g. "课件1 函数表示" */
  file: string;
  /** Original `topic` field value from the JSON */
  topic: string;
  /** Original `subtopic` field value, if relevant */
  subtopic?: string;
}

// ─── Core Graph Primitives ────────────────────────────────────────────────────

export interface OntologyNode {
  /** Stable English snake_case identifier. Never changes even if label changes. */
  id: string;
  /** Display label in Chinese (primary) */
  label: string;
  /** Optional English label for internationalization */
  labelEn?: string;
  type: NodeType;
  /**
   * Which domain node this belongs to (its primary chapter).
   * Cross-domain dependencies are expressed via edges, not this field.
   */
  domain?: string;
  /** Concise definition for the detail panel */
  definition?: string;
  /** LaTeX-style or Unicode formula for the detail panel */
  formula?: string;
  /**
   * All raw names (from JSONs, prerequisites, framework) that normalize to
   * this canonical node. Used to build the AliasMap at runtime.
   */
  aliases?: string[];
  /** Source file + topic entries that define or reference this node */
  sources: SourceRef[];
  /**
   * true if this node was inferred from prerequisite/next_topics/related_algorithms
   * but has no first-class JSON topic entry of its own.
   */
  implicit?: boolean;
  /**
   * For implicit nodes: explains WHY this node was inferred rather than defined,
   * and WHERE in the source material it was first referenced.
   * Example: "Referenced in related_algorithms of 课件1 梯度; not a first-class topic."
   */
  implicitReason?: string;
}

export interface OntologyEdge {
  /** Stable ID: "{source}__{type}__{target}" */
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  /** Optional human-readable edge label for display */
  label?: string;
}

export interface OntologyGraph {
  nodes: OntologyNode[];
  edges: OntologyEdge[];
  /** Semantic version of the ontology, increment when schema changes */
  version: string;
}

// ─── Normalized / Processed Graph ────────────────────────────────────────────

/** Maps every alias (raw Chinese name) to its canonical node ID */
export type AliasMap = Record<string, string>;

/** Fast O(1) lookup structures built from the raw graph */
export interface NormalizedGraph extends OntologyGraph {
  /** alias or canonical label → canonical node id */
  aliasMap: AliasMap;
  /** id → node for O(1) lookup */
  nodeIndex: Record<string, OntologyNode>;
  /** Per-node edge lists for O(1) neighbor lookup */
  adjacency: Record<
    string,
    {
      outgoing: OntologyEdge[];
      incoming: OntologyEdge[];
    }
  >;
}

// ─── Validation ───────────────────────────────────────────────────────────────

export interface ValidationError {
  type: 'duplicate_node_id' | 'missing_edge_target' | 'missing_edge_source' | 'self_loop';
  message: string;
  nodeId?: string;
  edgeId?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

// ─── Subgraph Query ───────────────────────────────────────────────────────────

export interface SubgraphOptions {
  /** Maximum hop distance from the root node */
  depth: number;
  /** If provided, only traverse edges of these types */
  edgeTypes?: EdgeType[];
  /** If true, traverse incoming edges in addition to outgoing */
  includeIncoming?: boolean;
}
