<template>
  <div class="weather">
    <span>今日天气</span>
    <amap-weather-icons
      v-if="weather.weather"
      :icon="weather.weather"
      :size="40"
    ></amap-weather-icons>
    <span>{{ weather.weather }}</span>
    <span>{{ weather.temperature }}</span>
    <span>℃</span>
  </div>
</template>

<script>
import "amap-weather-icons";

export default {
  props: {
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
  },
  data() {
    return {
      weather: "",
    };
  },
  methods: {
    getWeather() {
      fetch(
        `https://restapi.amap.com/v3/weather/weatherInfo?key=${this.k}&city=${this.city}`,
      )
        .then((response) => response.json())
        .then((res) => {
          this.weather = res.lives[0];
        });
    },
  },
  mounted() {
    this.getWeather();
  },
};
</script>

<style scoped>
.weather {
  display: flex;
  align-items: center;
}
</style>
