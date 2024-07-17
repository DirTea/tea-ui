<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useElementBounding } from "@vueuse/core";

const props = defineProps({
  height: {
    type: Number,
    default: 100,
  },

  /*************************以下为计算，不要在使用组件时传入****************************/
  // roller总长度
  rollerLength: {
    type: Number,
  },
  // 此item的索引
  itemIndex: {
    type: Number,
  },
  //
  itemStack: {
    type: Array,
  },
});

const section = ref();
const scrollTop = ref(0);
const emits = defineEmits(["next", "prev"]);
const handleScroll = () => {
  scrollTop.value =
    window.scrollY ||
    document.documentElement.scrollTop ||
    document.body.scrollTop;
  if (props.itemIndex === props.itemStack.length) {
    if (
      scrollTop.value - props.itemStack[props.itemIndex].height >=
      section.value.offsetHeight
    ) {
      emits("next", section.value.offsetHeight);
    }
    // if(scrollTop.value <= props.heightTemp) {
    //   emits("prev", section.value.offsetHeight);
    // }
  }
};
const transformComputed = computed(() => {
  if (props.itemIndex === props.itemStack.length) {
    return `translateY(-${scrollTop.value - props.itemStack[props.itemIndex - 1].height}px)`;
  } else {
    return `none`;
  }
});

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});
onUnmounted(() => {
  // 移除滚动事件监听
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div
    ref="section"
    :style="{
      height: `${height}vh`,
      transform: transformComputed,
      'z-index': rollerLength - itemIndex,
    }"
    class="roller-item"
  >
    <slot></slot>
  </div>
</template>

<style scoped>
.roller-item {
  position: fixed;
  width: 100%;
}
</style>
