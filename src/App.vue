<template>
  <div>
    <TeaRank
      type="outer"
      rank_width="400px"
      text_space="20px"
      :list="list"
      :background="[
        ['#F35B4C', '#F08656'],
        ['#EA9C47', '#E9C459'],
        ['#3ECD7E', '#6ECDA5'],
        ['#3C97F0', '#55ADEC'],
      ]"
      :top="8"
      item_height="28px"
    ></TeaRank>
  </div>

  <!--  <tea-roller>-->
  <!--    <tea-roller-item>-->
  <!--      <div style="background: black; height: 100%; width: 100%"></div>-->
  <!--    </tea-roller-item>-->
  <!--    <tea-roller-item>-->
  <!--      <div style="background: blue; height: 100%; width: 100%"></div-->
  <!--    ></tea-roller-item>-->
  <!--    <tea-roller-item>-->
  <!--      <div style="background: green; height: 100%; width: 100%"></div-->
  <!--    ></tea-roller-item>-->
  <!--  </tea-roller>-->
  <!--  <tea-roller height="100" width="100vw">-->
  <!--    <tea-roller-item>-->
  <!--      <div-->
  <!--        style="-->
  <!--          width: 100%;-->
  <!--          height: 100%;-->
  <!--          border: 1px white solid;-->
  <!--          background-color: black;-->
  <!--          display: flex;-->
  <!--          justify-content: center;-->
  <!--          align-items: center;-->
  <!--        "-->
  <!--      >-->
  <!--        <span style="font-size: 50px; color: white">1</span>-->
  <!--      </div>-->
  <!--    </tea-roller-item>-->
  <!--    <tea-roller-item>-->
  <!--      <div-->
  <!--        style="-->
  <!--          width: 100%;-->
  <!--          height: 100%;-->
  <!--          border: 1px white solid;-->
  <!--          background-color: black;-->
  <!--          display: flex;-->
  <!--          justify-content: center;-->
  <!--          align-items: center;-->
  <!--        "-->
  <!--      >-->
  <!--        <span style="font-size: 50px; color: white">2</span>-->
  <!--      </div>-->
  <!--    </tea-roller-item>-->
  <!--    <tea-roller-item>-->
  <!--      <div-->
  <!--        style="-->
  <!--          width: 100%;-->
  <!--          height: 100%;-->
  <!--          border: 1px white solid;-->
  <!--          background-color: black;-->
  <!--          display: flex;-->
  <!--          justify-content: center;-->
  <!--          align-items: center;-->
  <!--        "-->
  <!--      >-->
  <!--        <span style="font-size: 50px; color: white">3</span>-->
  <!--      </div>-->
  <!--    </tea-roller-item>-->
  <!--    <tea-roller-item>-->
  <!--      <div-->
  <!--        style="-->
  <!--          width: 100%;-->
  <!--          height: 100%;-->
  <!--          border: 1px white solid;-->
  <!--          background-color: black;-->
  <!--          display: flex;-->
  <!--          justify-content: center;-->
  <!--          align-items: center;-->
  <!--        "-->
  <!--      >-->
  <!--        <span style="font-size: 50px; color: white">4</span>-->
  <!--      </div>-->
  <!--    </tea-roller-item>-->
  <!--  </tea-roller>-->
  <!--  <Caonima></Caonima>-->
</template>

<script setup>
import TeaRollerItem from "./components/test/TeaRollerItem.vue";
import TeaRoller from "./components/test/TeaRoller.vue";
import Caonima from "./components/preview/Caonima.vue";
import TeaRank from "./components/rank/TeaRank.vue";
import { ref } from "vue";

const list = ref([
  { title: "01.煤炭购", value: 100 },
  { title: "02.石油", value: 80 },
  { title: "03.第三名", value: 60 },
  { title: "04.煤炭", value: 0 },
]);
</script>

<style scoped></style>
