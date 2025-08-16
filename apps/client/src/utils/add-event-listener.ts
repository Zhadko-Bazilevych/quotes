export type CleanupFn = () => void;

export function addEventListenerWithCleaup<K extends keyof WindowEventMap>(
  type: K,
  listener: (this: Window, ev: WindowEventMap[K]) => void,
): () => void {
  window.addEventListener(type, listener);

  return () => window.removeEventListener(type, listener);
}
