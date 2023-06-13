import { unref, onUnmounted } from 'vue';

export function useEventListener(target, events, listeners, options) {
  target = unref(target);

  target.addEventListener(events, listeners, options);

  onUnmounted(() => {
    target.removeEventListener(events, listeners);
  });
}
