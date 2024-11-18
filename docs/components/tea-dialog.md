# 弹出框

## 基础用法

:::demo

```vue
<template>
  <tea-dialog v-model="dialogVisible">
    <div
      style="height: 200px;width: 400px;color: white;background-color: #25599f;display: flex;align-items: center;justify-content: center"
    >
      这是弹出框，请自定义
    </div>
  </tea-dialog>
  <tea-button @click="dialogVisible = true">弹出框</tea-button>
</template>

<script setup>
import { ref } from "vue";
let dialogVisible = ref(false);
</script>
```

:::

## 使用 VNode

:::demo

```vue
<template>
  <tea-button @click="onShow">弹出框</tea-button>
</template>

<script setup>
import { h } from "vue";
import { TeaDialog } from "../../src/components/dialog/vue3/TeaDialog.ts";
const onShow = () => {
  TeaDialog({
    content: h(
      "div",
      {
        style: {
          height: "200px",
          width: "400px",
          color: "white",
          backgroundColor: "#25599f",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      },
      "这是弹出框，请自定义",
    ),
  });
};
</script>
```

:::

## 属性

| 参数                    | 说明          | 类型                   | 可选值 | 是否必填 | 默认值    |
| --------------------- | ----------- | -------------------- | --- | ---- | ------ |
| model-value / v-model | 是否弹出dialog  | boolean              | -   | 是    | -      |
| modal                 | 是否开启遮罩层     | boolean              | -   | -    | true   |
| background            | 使用背景图片      | string               | -   | -    | -      |
| append-to             | 挂载到哪个元素     | string / HTMLElement | -   | -    | 'body' |
| lock-scroll           | 是否将body滚动锁定 | boolean              | -   | -    | true   |


