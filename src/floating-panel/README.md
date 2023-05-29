# GwFloatingPanel 浮动面板

### 介绍

FloatingPanel 是一个示例浮动面板

### 引入

```js
import Vue from 'vue';
import { FloatingPanel } from 'app-component';

Vue.use(FloatingPanel);
```

## 代码演示

### 基础用法

```html
<floating-panel :anchors="anchors"> 内容 </floating-panel>

const anchors = [100, window.innerHeight * 0.4, window.innerHeight * 0.8];
```

#### anchors 参数说明

const anchors = [画板上边界, 初始化位置, 画板下边界];

## API

### Props


| 参数           | 说明                        | 类型       | 默认值   |
| -------------- | --------------------------- | ---------- | -------- |
| anchors        | 可拖拽至哪些高度，单位为 px | _number[]_ | -        |
| isFollowScroll | 是否拖拽跟随                | _boolean_  | false     |
| height         | 面板高度                    | _number_   | 屏幕高度 |
| distance       | 上滑 or 下滑阈值            | _number_   | 40       |

### Slots

| 名称    | 说明         |
| ------- | ------------ |
| default | 默认内容插槽 |
| header  | 头部插槽     |

### events

| 名称         | 说明         |
| ------------ | ------------ |
| heightChange | 高度发生变化 |

### methods

setTop(100, { immediate: true });

immediate: 是否执行动画 true 不执行 | false 执行

### 贡献者们

| 名称      |     |     |
| --------- | --- | --- |
| zhen.wang |     |     |
