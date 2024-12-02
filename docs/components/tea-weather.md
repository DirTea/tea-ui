# 高德天气

## 基础用法

在高德地图申请Web服务的key，将申请好的key输入以开始预览效果

<div class="vp-raw">
  <el-input v-model="input1" style="width: 240px" placeholder="请输入Web服务Key" />
  <el-input v-model="input2" style="width: 240px" placeholder="请输入城市名" />
  <el-button type="primary" @click="getWeather">开始预览</el-button>
</div>

<div class="weather" v-if="weather">
  <span>今日天气</span>
  <amap-weather-icons
    v-if="weather?.weather"
    :icon="weather?.weather"
    :size="40"
  ></amap-weather-icons>
  <span>{{ weather?.weather }}</span>
  <span>{{ weather?.temperature }}</span>
  <span>℃</span>
</div>

<script setup lang="ts">
import { ref } from "vue";
import "amap-weather-icons";

const input1 = ref<string>("");
const input2 = ref<string>("北京市");

const weather = ref<{ weather: string; temperature: string }>();

const getWeather = () => {
  fetch(
    `https://restapi.amap.com/v3/weather/weatherInfo?key=${input1.value}&city=${input2.value}`,
  )
    .then((response) => response.json())
    .then((res) => {
      weather.value = res.lives[0];
    });
};
</script>

<style scoped>
.weather {
  display: flex;
  align-items: center;
}
</style>

```javascript
<template>
  <tea-weather k="请输入Web服务Key"></tea-weather>
</template>
```

## 属性

| 参数 | 说明               | 类型   | 可选值 | 是否必填 | 默认值 |
| ---- | ------------------ | ------ | ------ | -------- | ------ |
| k    | 高德Web服务Key     | string | -      | 是       | -      |
| city | 城市名称或区域编码 | string | -      | 是       | 北京市 |
