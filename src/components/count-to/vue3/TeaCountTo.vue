<template>
  <div class="count-to">
    <div class="count-to-item" v-for="i in endValStr.length">
      <div class="count-to-span">
        <div :class="'count-to-num-' + i" class="count-to-num">0</div>
        <div :class="'count-to-num-' + i" class="count-to-num">1</div>
        <div :class="'count-to-num-' + i" class="count-to-num">2</div>
        <div :class="'count-to-num-' + i" class="count-to-num">3</div>
        <div :class="'count-to-num-' + i" class="count-to-num">4</div>
        <div :class="'count-to-num-' + i" class="count-to-num">5</div>
        <div :class="'count-to-num-' + i" class="count-to-num">6</div>
        <div :class="'count-to-num-' + i" class="count-to-num">7</div>
        <div :class="'count-to-num-' + i" class="count-to-num">8</div>
        <div :class="'count-to-num-' + i" class="count-to-num">9</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

const props = defineProps({
  startVal: {
    type: Number,
    default: 0,
  },
  endVal: {
    type: Number,
    required: true,
    default: 0,
  },
  duration: {
    type: Number,
    default: 1000,
  },
});
let startValStr = ref("");
let endValStr = ref("");
let endValList = ref([]);
watch(
  () => props.startVal,
  (val) => {
    startValStr.value = val.toString().padStart(endValList.value.length, "0");
  },
  { immediate: true },
);
watch(
  () => props.endVal,
  (val) => {
    endValStr.value = val.toString();
    endValList.value = endValStr.value.split("");
  },
  { immediate: true },
);

onMounted(() => {
  endValList.value.forEach((item, index) => {
    const runKeyFrames = `
      @keyframes test-${index + 1} {
        0% {
          transform: translate(0%, ${-100 * startValStr.value[index]}%);
        }
        100% {
          transform: translate(0%, ${-100 * item}%);
        }
      }
    `;
    const style = document.createElement("style");
    style.innerHTML = runKeyFrames;
    const claList = document.getElementsByClassName(
      `count-to-num-${index + 1}`,
    ) as HTMLElement;
    for (let cla of claList) {
      cla.style.animation = `test-${index + 1} ${props.duration}ms`;
      cla.style.animationFillMode = "forwards";
      cla.appendChild(style);
    }
  });
});
</script>

<style scoped>
.count-to {
  display: flex;
}
.count-to-item {
  height: 60px;
  width: 48px;
  background: #273f56;
  border: 1px solid #00cde2;
  margin: 0 3px;
}
.count-to-span {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: relative;
  color: white;
  font-size: 36px;
  font-weight: 700;
  line-height: 60px;
  overflow: hidden;
}
.count-to-num {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}
</style>
