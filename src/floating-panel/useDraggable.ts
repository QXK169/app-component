import { computed, ref, toRefs, unref } from 'vue';
import { useEventListener } from './useEventListener';
/**
 * Make elements draggable.
 *
 * @see https://vueuse.org/useDraggable
 * @param target
 * @param options
 */
export function useDraggable(target, options = {} as any) {
  const {
    pointerTypes,
    preventDefault,
    stopPropagation,
    exact,
    onMove,
    onEnd,
    onStart,
    initialValue,
    axis = 'both',
    draggingElement = target,
    passive = true,
  } = options as any;

  const position = ref(unref(initialValue) ?? { x: 0, y: 0 });

  const pressedDelta = ref();

  const filterEvent = (e) => {
    if (pointerTypes) return pointerTypes.includes(e.pointerType);
    return true;
  };

  const handleEvent = (e) => {
    if (unref(preventDefault)) e.preventDefault();
    if (unref(stopPropagation)) e.stopPropagation();
  };

  const start = (event) => {
    const [e] = event.touches;
    if (!filterEvent(event)) return;
    if (unref(exact) && e.target !== unref(target)) return;
    const rect = unref(target)?.getBoundingClientRect();
    const pos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    if (onStart?.(pos, event) === false) return;
    pressedDelta.value = pos;
    handleEvent(event);
  };
  const move = (event) => {
    const [e] = event.touches;
    if (!filterEvent(event)) return;
    if (!pressedDelta.value) return;

    let { x, y } = position.value;
    if (axis === 'x' || axis === 'both') x = e.clientX - pressedDelta.value.x;
    if (axis === 'y' || axis === 'both') y = e.clientY - pressedDelta.value.y;
    position.value = {
      x,
      y,
    };
    onMove?.(position.value, event);
    handleEvent(event);
  };
  const end = (e) => {
    if (!filterEvent(e)) return;
    if (!pressedDelta.value) return;
    pressedDelta.value = undefined;
    onEnd?.(position.value, e);
    handleEvent(e);
  };

  const config = { capture: options?.capture ?? true, passive };
  useEventListener(draggingElement, 'touchstart', start, config);
  useEventListener(draggingElement, 'touchmove', move, config);
  useEventListener(draggingElement, 'touchend', end, config);

  return {
    ...toRefs(position),
    position,
    isDragging: computed(() => !!pressedDelta.value),
    style: computed(() => `left:${position.value.x}px;top:${position.value.y}px;`),
  };
}
