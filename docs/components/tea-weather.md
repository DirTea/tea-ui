# 高德天气

## 基础用法

在高德地图申请Web服务的key，将申请好的key输入以开始预览效果

<ClientOnly>
<TeaWeather></TeaWeather>
</ClientOnly>

<script setup lang="ts">
import TeaWeather from "../example/TeaWeather.vue"
</script>

```vue
<template>
  <tea-weather k="请输入Web服务Key"></tea-weather>
</template>
```

## 属性

| 参数 | 说明               | 类型   | 可选值 | 是否必填 | 默认值 |
| ---- | ------------------ | ------ | ------ | -------- | ------ |
| k    | 高德Web服务Key     | string | -      | 是       | -      |
| city | 城市名称或区域编码 | string | -      | 是       | 北京市 |
