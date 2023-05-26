import { watch, onBeforeUnmount, onDeactivated, onMounted, onActivated, nextTick } from 'vue';

import { useTouch } from './use-touch';

//
function isElement(node) {
  const ELEMENT_NODE_TYPE = 1;
  return node.nodeType === ELEMENT_NODE_TYPE;
}

const overflowScrollReg = /scroll|auto|overlay/i;

function getScrollParent(el, root) {
  let node = el;

  while (node && node !== root && isElement(node)) {
    const { overflowY } = window.getComputedStyle(node);
    if (overflowScrollReg.test(overflowY)) {
      return node;
    }
    node = node.parentNode;
  }

  return root;
}

//
function onMountedOrActivated(hook) {
  let mounted;

  onMounted(() => {
    hook();
    nextTick(() => {
      mounted = true;
    });
  });

  onActivated(() => {
    if (mounted) {
      hook();
    }
  });
}

function preventDefault(event, isStopPropagation) {
  /* istanbul ignore else */
  if (typeof event.cancelable !== 'boolean' || event.cancelable) {
    event.preventDefault();
  }

  if (isStopPropagation) {
    event.stopPropagation();
  }
}

let totalLockCount = 0;

const BODY_LOCK_CLASS = 'gwm-overflow-hidden';

export function useLockScroll(rootRef, shouldLock) {
  const touch = useTouch();
  const DIRECTION_UP = '01';
  const DIRECTION_DOWN = '10';

  const onTouchMove = (event) => {
    touch.move(event);

    const direction = touch.deltaY.value > 0 ? DIRECTION_DOWN : DIRECTION_UP;
    const el = getScrollParent(event.target, rootRef.value);
    const { scrollHeight, offsetHeight, scrollTop } = el;
    let status = '11';

    if (scrollTop === 0) {
      status = offsetHeight >= scrollHeight ? '00' : '01';
    } else if (scrollTop + offsetHeight >= scrollHeight) {
      status = '10';
    }

    if (status !== '11' && touch.isVertical() && !(parseInt(status, 2) & parseInt(direction, 2))) {
      preventDefault(event, true);
    }
  };

  const lock = () => {
    document.addEventListener('touchstart', touch.start);
    document.addEventListener('touchmove', onTouchMove, { passive: false });

    if (!totalLockCount) {
      document.body.classList.add(BODY_LOCK_CLASS);
    }

    totalLockCount++;
  };

  const unlock = () => {
    if (totalLockCount) {
      document.removeEventListener('touchstart', touch.start);
      document.removeEventListener('touchmove', onTouchMove);

      totalLockCount--;

      if (!totalLockCount) {
        document.body.classList.remove(BODY_LOCK_CLASS);
      }
    }
  };

  const init = () => shouldLock() && lock();

  const destroy = () => shouldLock() && unlock();

  onMountedOrActivated(init);
  onDeactivated(destroy);
  onBeforeUnmount(destroy);

  watch(shouldLock, (value) => {
    value ? lock() : unlock();
  });
}
