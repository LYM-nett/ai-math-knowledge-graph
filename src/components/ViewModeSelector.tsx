/**
 * ViewModeSelector.tsx
 * Three view-mode toggle buttons in the header.
 */

import type { ViewMode } from '../lib/graphView';
import { VIEW_MODE_LABEL } from '../lib/uiLabels';

interface Props {
  current: ViewMode;
  onChange: (mode: ViewMode) => void;
}

const MODES: ViewMode[] = ['overview', 'domain', 'chain'];

// Subtle icon prefix for each mode
const MODE_ICON: Record<ViewMode, string> = {
  overview: '◎',
  domain:   '⊕',
  chain:    '⛓',
};

export default function ViewModeSelector({ current, onChange }: Props) {
  return (
    <div
      style={{
        display:    'flex',
        gap:        4,
        background: '#0b1120',
        border:     '1px solid #1e3a5f',
        borderRadius: 8,
        padding:    3,
      }}
    >
      {MODES.map((mode) => {
        const active = mode === current;
        return (
          <button
            key={mode}
            onClick={() => onChange(mode)}
            style={{
              display:       'flex',
              alignItems:    'center',
              gap:           5,
              padding:       '5px 14px',
              borderRadius:  6,
              border:        'none',
              background:    active ? '#1d4ed8' : 'transparent',
              color:         active ? '#ffffff' : '#64748b',
              fontSize:      12,
              fontWeight:    active ? 700 : 400,
              cursor:        'pointer',
              transition:    'all 0.15s ease',
              fontFamily:    'inherit',
              whiteSpace:    'nowrap',
              letterSpacing: active ? '0.01em' : '0',
              boxShadow:     active ? '0 1px 4px rgba(29,78,216,0.4)' : 'none',
            }}
            onMouseEnter={(e) => {
              if (!active) (e.currentTarget as HTMLButtonElement).style.color = '#e2e8f0';
            }}
            onMouseLeave={(e) => {
              if (!active) (e.currentTarget as HTMLButtonElement).style.color = '#64748b';
            }}
          >
            <span style={{ fontSize: 11, opacity: active ? 1 : 0.6 }}>
              {MODE_ICON[mode]}
            </span>
            {VIEW_MODE_LABEL[mode]}
          </button>
        );
      })}
    </div>
  );
}
