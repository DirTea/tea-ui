<template>
  <div class="weather">
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
import { onMounted, ref } from "vue";
import "amap-weather-icons";

const props = defineProps({
  // 高德key
  k: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
    default: "北京市",
  },
});

const weather = ref<{ weather: string; temperature: string }>();

const getWeather = () => {
  fetch(
    `https://restapi.amap.com/v3/weather/weatherInfo?key=${props.k}&city=${props.city}`,
  )
    .then((response) => response.json())
    .then((res) => {
      weather.value = res.lives[0];
    });
};

onMounted(() => {
  getWeather();
});
</script>

<style scoped>
.weather {
  display: flex;
  align-items: center;
}
</style>
