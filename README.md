
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
const anchors = [100, window.innerHeight * 0.4, window.innerHeight * 0.8];

## 示例

## FloatingPanel

### 属性


| 参数           | 说明                        | 类型       | 默认值   |
| -------------- | --------------------------- | ---------- | -------- |
| anchors        | 可拖拽至哪些高度，单位为 px | _number[]_ | -        |
| isFollowScroll | 是否拖拽跟随                | _boolean_  | false     |
| height         | 面板高度                    | _number_   | 屏幕高度 |
| distance       | 上滑 or 下滑阈值            | _number_   | 40       |


#### anchors 参数说明

const anchors = [画板上边界, 初始化位置, 画板下边界];


### Slots

| 名称    | 说明         |
| ------- | ------------ |
| default | 默认内容插槽 |
| header  | 头部插槽     |

### events

| 名称         | 说明         |
| ------------ | ------------ |
| heightChange | 高度发生变化 |
### Ref

FloatingPanel 的 ref 上提供了 `setTop` 方法，你可以通过它来指令式地控制 `FloatingPanel` 的高度：

```ts
type FloatingPanelRef = {
  setTop: (
    height: number,
    options?: {
      immediate?: boolean // 是否跳过动画
    }
  ) => void
}
```

```jsx
<FloatingPanel ref={ref}>...</FloatingPanel>

ref.value.setTop(100)
```
### 贡献者
zhen.wang; 感觉组件对你业务有帮助，请用你发财的小手，点点Star