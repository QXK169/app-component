
# 快速上手

### 安装

```bash
# 通过 npm
npm i qxk-app-component

# 通过 yarn
yarn add qxk-app-component

# 通过 pnpm
pnpm add qxk-app-component
```

# FloatingPanel 浮动面板

内容型面板。

## 何时使用

import { FloatingPanel } from 'qxk-app-component'

用户可自由灵活上下滑动浏览内容，常用于地图导航。

## 示例

## FloatingPanel

### 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| anchors | 可拖拽至哪些高度，单位为 `px` | `number[]` | - |
| onHeightChange | 当高度变化时触发，`animating` 参数表示是否处于动画过程中 | `(height: number, animating: boolean) => void` |  |

### Ref

FloatingPanel 的 ref 上提供了 `setHeight` 方法，你可以通过它来指令式地控制 `FloatingPanel` 的高度：

```ts
type FloatingPanelRef = {
  setHeight: (
    height: number,
    options?: {
      immediate?: boolean // 是否跳过动画
    }
  ) => void
}
```

```jsx
<FloatingPanel ref={ref}>...</FloatingPanel>

ref.value.setHeight(100)
```
