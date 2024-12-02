<template>
  <div class="vp-raw">
    <el-input
      v-model="input1"
      style="width: 240px"
      placeholder="请输入Web服务Key"
    />
    <el-input
      v-model="input2"
      style="width: 240px"
      placeholder="请输入城市名"
    />
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
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

onMounted(() => {
  import("amap-weather-icons");
});

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
