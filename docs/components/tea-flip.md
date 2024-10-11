# 翻转

## 基础用法
:::demo

```vue

<template>
  <tea-flip height="300px" width="500px" v-model="value">
    <template #front>
      <div style="background-color: #25599f;width: 100%;height: 100%;display: flex;align-items: center;justify-content: center">
        <div style="color: white;font-size: 50px;">
          正面
        </div>
      </div>
    </template>
    <template #back>
      <div style="background-color: #009844;width: 100%;height: 100%;display: flex;align-items: center;justify-content: center">
        <div style="color: white;font-size: 50px;">
          反面
        </div>
      </div>
    </template>
  </tea-flip>
</template>

<script setup>
  import {ref} from 'vue';
  let value = ref(false);
</script>

```

:::

## Attributes

| 参数      | 说明     | 类型            | 可选值                    | 是否必填 | 默认值       |
| --------- | -------- | --------------- | ------------------------- | -------- | ------------ |
| width     | 宽度     | number / string | -                         | 是       | -            |
| height    | 高度     | number / string | -                         | 是       | -            |
| direction | 翻转反向 | enum            | 'horizontal' / 'vertical' | -        | 'horizontal' |
| duration  | 翻转时长 | number          | -                         | -        | 1000         |
| trigger   | 触发方式 | enum            | 'hover' / 'click'         | -        | 'hover'      |
