import { defineComponent, ref, computed, watch } from 'vue';
import { useLockScroll } from './use-lock-scroll';
import { useDraggable } from '@vueuse/core';

const MIN_DISTANCE = 40;


export default defineComponent({
  name: 'FloatingPanel',
  props: {
    anchors: {
      type: Array,
      default: () => [],
    },
    isFollowScroll: {
      type: Boolean,
      default: false,
    },
    height: {
      type: Number,
      default:
        document.documentElement.clientHeight || document.body.clientHeight,
    },
  },
  emits: ['heightChange'],
  setup(props, { slots, emit, expose }) {
    const elementRef = ref<HTMLElement>();
    const headerRef = ref<HTMLElement>();
    const contentRef = ref<HTMLElement>();
    //
    const anchors: any = ref<any>(props.anchors);
    const pulling = ref<boolean>(false);
    const isScroll = ref<boolean>(false);
    const startY = ref(0);
    const nextY = ref(anchors.value[anchors.value.length - 2]);
    // 盒子高度
    const maxHeight = computed(() =>
      Math.ceil(props.height - anchors.value[0])
    );
    // 上边界线
    const bounds: any = computed(() => ({
      top: anchors.value[anchors.value.length - 1],
      bottom: anchors.value[0],
    }));


    let touchStartTime = 0;

    // const nearest = (arr, target) =>
    // arr.reduce((pre, cur) => (Math.abs(pre - target) < Math.abs(cur - target) ? pre : cur));

    // 重置盒子基础位置
    watch(
      () => props.anchors,
      (values) => {
        anchors.value = values;
      }
    );

    useLockScroll(elementRef, () => true);

    useDraggable(elementRef, {
      onStart: (_, event) => {
        const { target } = event as any;
        const header = headerRef.value;

        if (header === target || header?.contains(target)) {
          pulling.value = true;
        }
        startY.value = event.y;
      },
      onMove: (position: any, event) => {
        // 处理点击事件
        touchStartTime = Date.now();
        const direction = event.y > startY.value ? 'down' : 'up';
        const reachedTop = nextY.value <= bounds.value.bottom; // 是否到达顶部
        const content = contentRef.value;
        if (!content) return;
        if (reachedTop) {
          if (content?.scrollTop <= 0 && direction === 'down') {
            pulling.value = true;
            isScroll.value = false;
          }
        } else {
          pulling.value = true;
        }

        if (!pulling.value) return;
        if (isScroll.value) return;
        if (event.cancelable) {
          event.preventDefault();
        }
        event.stopPropagation();

        // 处理上下边界问题
        if (position.y < bounds.value.bottom) {
          position.y = bounds.value.bottom;
          pulling.value = false;
        }
        if (position.y > bounds.value.top) {
          position.y = bounds.value.top;
          pulling.value = false;
        }
        const duration = Date.now() - touchStartTime;
        if (Math.abs(event.y - startY.value) < MIN_DISTANCE && duration < 100) {
          return;
        } 
        console.log( Math.abs(event.y - startY.value));
        nextY.value = position.y;
      },
      onEnd: (position, event) => {
        if (!pulling.value) return;
        const direction = event.y > startY.value ? 'down' : 'up';
        pulling.value = false;
        const duration = Date.now() - touchStartTime;
        // 处理点击事件
        if (Math.abs(event.y - startY.value) < 8 && duration < 100) {
          return;
        }
        console.log('结束')

        let nextAnchor: any = nextY.value;

        if (props.isFollowScroll) {
          nextY.value = position.y;
        } else {
          if (direction === 'up') {
            // Find next anchor upwards
            for (let i = anchors.value.length - 1; i >= 0; i--) {
              if (anchors.value[i] < nextY.value) {
                nextAnchor = anchors.value[i];
                break;
              }
            }
          } else {
            // Find next anchor downwards
            for (let i = 0; i < anchors.value.length; i++) {
              if (anchors.value[i] > nextY.value) {
                nextAnchor = anchors.value[i];
                break;
              }
            }
          }

          // nextY.value = nearest(anchors, position.y);
          nextY.value = nextAnchor;
          const reachedTop = nextY.value <= bounds.value.bottom; // 是否到达顶部
          if (reachedTop) {
            isScroll.value = true;
          } else {
            isScroll.value = false;
          }
        }
        emit('heightChange', window.innerHeight - nextY.value);
      },
    });

    // 设置位置
    const setTop = (value, options) => {
      if (options && options.immediate) {
        nextY.value = value;
      } else {
        pulling.value = false;
        nextY.value = value;
      }
    };

    expose({
      setTop,
    });

    // 渲染头部
    const renderHeader = () => (
      <div class="gwm-floating-panel-header" ref={headerRef}>
        {slots.header ? (
          slots.header?.()
        ) : (
          <div class="gwm-floating-panel-bar"></div>
        )}
      </div>
    );

    // 渲染内容

    const renderContent = () => (
      <div
        class="gwm-floating-panel-content"
        ref={contentRef}
        style={{ overflow: isScroll.value ? 'scroll' : 'hidden' }}
      >
        {slots.default?.()}
      </div>
    );

    return () => {
      const Header = renderHeader();
      const Content = renderContent();
      return (
        <div
          class={[
            'gwm-floating-panel',
            props.isFollowScroll ? '' : pulling.value ? '' : 'gwm-transition',
          ]}
          ref={elementRef}
          style={{
            height: `${maxHeight.value}px`,
            top: `${nextY.value}px`,
          }}
        >
          <div
            class="gwm-floating-panel-mask"
            style={{ display: pulling.value ? 'block' : 'none' }}
          ></div>
          {Header}
          {Content}
        </div>
      );
    };
  },
});
