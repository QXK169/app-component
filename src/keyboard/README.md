# Keyboard 车牌组件

### 介绍

Keyboard 是一个示例车牌键盘组件

### 引入

```js
import Vue from 'vue';
import { Keyboard } from 'app-component';

Vue.use(Keyboard);
```

## 代码演示

### 基础用法

```html
<gw-keyboard />
```

## API

### Props

| 参数         | 说明         | 类型      | 默认值 |
| ------------ | ------------ | --------- | ------ |
| length       | 车牌位数     | _number_  | 8      |
| licenseList  | 车牌纪录列表 | _array_   | -      |
| city         | 默认城市     | _string_  | 京     |
| defaultLicense | 默认车牌     | _string_  | -      |

### Events

| 事件名  | 说明     | 回调参数            |
| ------- | -------- | ------------------- |
| confirm | 确认     | _event: MouseEvent_ |
| close   | 关闭弹框 | _event: MouseEvent_ |

### Slots

| 名称    | 说明     |
| ------- | -------- |
| default | 默认插槽 |

### 贡献者们

| 名称      |     |     |
| --------- | --- | --- |
| zhen.wang |     |     |
