# 简单过渡动画

## 基础用法

:::demo

```vue
<template>
  <div v-transition:height|width|opacity="isShow">
    <div style="width: 300px;height: 300px;background: #009844"></div>
  </div>
  <tea-button @click="isShow = !isShow">过渡</tea-button>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { vTransition } from "../../src/directives/transition/TeaTransition.ts";

const isShow = ref(true);
</script>
```

:::

注意！

- 不要在有style的元素上直接使用此指令，请在外面再套一层容器使用

- 请不要与v-if和v-show一起使用，在v-transition已经内置了打开和关闭

- 非强制要求给子元素设置宽高，指令内部会自动判断元素的宽高

## 指令参数

可以同时开启多个过渡效果，请使用逗号或者竖线分隔传入以下指令参数

| 参数    | 说明           | 可选值  |
| ------- | -------------- | ------- |
| height  | 开启高度过渡   | h / col |
| width   | 开启宽度过渡   | w / row |
| opacity | 开启透明度过渡 | o       |
