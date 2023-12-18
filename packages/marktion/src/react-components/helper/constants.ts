export enum SystemShortcutKey {
  ToggleSourceMode,
  AIChat
}

export type SystemShortcutType = {
  key: SystemShortcutKey;
  title: string;
  description: string;
  syntax: string;
};

export const SystemShortcuts: SystemShortcutType[] = [
  {
    key: SystemShortcutKey.AIChat,
    title: 'Ask AI(at the line beginning)',
    description: 'Ask AI',
    syntax: 'Space'
  },
  {
    key: SystemShortcutKey.ToggleSourceMode,
    title: 'Toggle source mode',
    description: 'Switch to source mode or WYSIWYG mode',
    syntax: 'Ctrl + /'
  }
];

export const SystemShortcutMap = (() => {
  const map = {} as Record<SystemShortcutKey, SystemShortcutType>;

  SystemShortcuts.forEach(item => {
    map[item.key] = item;
  });

  return map;
})();
