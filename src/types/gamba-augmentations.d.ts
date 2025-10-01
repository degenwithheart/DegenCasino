// Augment types from gamba-react-ui-v2 to include a balance property on pool objects
declare module 'gamba-react-ui-v2' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface UiPool {
    /** Current available pool balance (in token units) */
    balance?: number
  }
}
