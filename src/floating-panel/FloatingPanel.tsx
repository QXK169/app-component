import { defineComponent, ref, computed, watch, onMounted } from 'vue';
import { useLockScroll } from './use-lock-scroll';
import { useDraggable } from './useDraggable';

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
    const startY = ref(0);
  
    const nextY = ref(anchors.value[anchors.value.length - 2]);
    // 最后位置
    const lastY = ref(nextY.value);
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

    onMounted(() => {
      useDraggable(elementRef, {
        onStart: (_, event) => {
          touchStartTime = Date.now();
          const { target, touches } = event as any;
          const header = headerRef.value;

          if (header === target || header?.contains(target)) {
            pulling.value = true;
          }
          startY.value = touches[0].clientY;
        },
        onMove: (position: any, event) => {
          const poz = event.touches[0];
          const direction = poz.clientY > startY.value ? 'down' : 'up';
          const reachedTop = nextY.value <= bounds.value.bottom; // 是否到达顶部
          const content = contentRef.value;
          if (!content) return;
          if (reachedTop) {
            if (content?.scrollTop <= 0 && direction === 'down') {
              pulling.value = true;
            }
          } else {
            pulling.value = true;
          }

          if (!pulling.value) return;
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
          if (Math.abs(poz.clientY - startY.value) < MIN_DISTANCE && duration < 100) {
            return false;
          }
          nextY.value = position.y;
        },
        onEnd: (position, event) => {
          const poz = event.changedTouches[0];
          let nextAnchor: any = nextY.value;
          if (!pulling.value) return;
          // 根据move距离判断方向
          const direction = poz.clientY > startY.value ? 'down' : 'up';
          pulling.value = false;

          if (Math.abs(poz.clientY - startY.value) < MIN_DISTANCE) {
            console.log('结束');
            // 恢复
            nextY.value = lastY.value;
            return;
          }

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

            // nextY.value = nearest(anchors.value, position.y);
            nextY.value = nextAnchor;
          }
          lastY.value = nextY.value;
          emit('heightChange', window.innerHeight - nextY.value);
        },
        passive: false,
      });
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
