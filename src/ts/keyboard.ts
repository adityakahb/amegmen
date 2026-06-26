/** Modern event.key values used for navigation */
export const Key = {
  Backspace: 'Backspace',
  Delete: 'Delete',
  Down: 'ArrowDown',
  End: 'End',
  Enter: 'Enter',
  Escape: 'Escape',
  Home: 'Home',
  Left: 'ArrowLeft',
  PageDown: 'PageDown',
  PageUp: 'PageUp',
  Right: 'ArrowRight',
  Space: ' ',
  Tab: 'Tab',
  Up: 'ArrowUp',
} as const;

/** Union of all `Key` constant values — use for typed `event.key` comparisons. */
export type KeyValue = (typeof Key)[keyof typeof Key];
