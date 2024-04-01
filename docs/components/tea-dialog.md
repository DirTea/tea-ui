:::demo

```vue

<template>
  <tea-dialog v-model="dialogVisible">
    <div
        style="height: 200px;width: 400px;color: white;background-color: #25599f;display: flex;align-items: center;justify-content: center">
      这是弹出框，请自定义
    </div>
  </tea-dialog>
  <tea-button @click="dialogVisible = true">弹出框</tea-button>
</template>

<script setup>
import {ref} from 'vue';
let dialogVisible = ref(false);
</script>

```

:::
