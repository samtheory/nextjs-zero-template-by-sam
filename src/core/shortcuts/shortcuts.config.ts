export interface ShortcutDefinition {
  shortcut: string;
  description: string;
  scope?: string;
}

/** Sensible default shortcuts to register at bootstrap. */
export const defaultShortcuts: ShortcutDefinition[] = [
  { shortcut: 'ctrl+k', description: 'Open search', scope: 'global' },
  { shortcut: 'ctrl+/', description: 'Toggle help panel', scope: 'global' },
  { shortcut: 'ctrl+shift+p', description: 'Command palette', scope: 'global' },
  { shortcut: 'escape', description: 'Close modal / cancel action', scope: 'global' },
];
