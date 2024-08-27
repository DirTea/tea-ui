<template>
  <tea-flip height="135vw" width="90vw" trigger="click" v-model="shit">
    <template #front>
      <view
        style="
          height: 100%;
          width: 100%;
          border: 1px black solid;
          display: flex;
          justify-content: center;
          align-items: center;
        "
      >
        <text
          style="
            writing-mode: vertical-rl;
            text-orientation: upright;
            font-size: 80px;
          "
          >LIVE
        </text>
      </view>
    </template>
    <template #back>
      <view style="height: 100%; width: 100%; border: 1px black solid">
        <view
          style="
            height: 30px;
            width: 100%;
            border: 1px black solid;
            display: flex;
            align-items: center;
          "
        >
          <text style="padding-left: 10px">444</text>
        </view>
      </view>
    </template>
  </tea-flip>

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
import TeaFlip from "./components/flip/TeaFlip.vue";
import { ref } from "vue";

const shit = ref(false);
</script>

<style scoped></style>
