<template>
  <div style="margin-top: 10px">
    <div>高德地图</div>
    <!--    <GaodeHjkjMap></GaodeHjkjMap>-->
  </div>
  <div style="margin-top: 10px">
    <div>天地图</div>
    <!--    <TiandiHjkjMap></TiandiHjkjMap>-->
  </div>
  <div style="margin-top: 10px">
    <doughnut-chart></doughnut-chart>
  </div>
  <div style="margin-top: 10px">
    <Watermark></Watermark>
  </div>

</template>

<script setup>
import DoughnutChart from "./demo/echarts/TeaDoughnutChart.vue";
import Watermark from "./components/watermark/vue2/Watermark.vue";

</script>

<style scoped>
:deep(.hover) {
  color: #25599f;
}
</style>
