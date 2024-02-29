<script setup>
import {ref, watch} from "vue";
import {useElementBounding} from "@vueuse/core";

const props = defineProps({
  height: {
    type: Number,
    default: 100
  },

  /*************************以下为计算，不要在使用组件时传入****************************/
  // roller的整体宽度
  rollerWidth: {
    type: Number,
    default: 100
  },
  // roller总长度
  rollerLength: {
    type: Number
  },
  // 此item所在位置
  itemIndex: {
    type: Number
  },
  // 当前已被滚动的item栈 itemStack
  itemStack: {
    type: Array
  },
  // 每个item需要向上偏移的距离 itemOffset
  itemOffset: {
    type: Number
  }
})

const section = ref(null)
const sectionBounding = useElementBounding(section)

const emits = defineEmits(["next", "prev"])
watch(() => sectionBounding.bottom.value,
    (newVal) => {
      if (newVal <= 0 && props.itemIndex === props.itemStack[props.itemStack.length - 1]) {
        emits('next', props.itemIndex + 1)
      } else if (newVal > 0 && props.itemIndex === props.itemStack[props.itemStack.length - 1] - 1) {
        emits('prev')
      }
    }, {
      immediate: true,
    })
</script>

<template>
  <div ref="section" :style="{ height: `${height}vh`, width: `${rollerWidth}vw` }">
    <div
        :style="{ height: `${height}vh`,width: `${rollerWidth}vw`,'z-index': rollerLength - itemIndex,transform: `translateY(${ !itemStack.includes(itemIndex) ? -itemOffset : 0 }vh)`,position: `${!itemStack.includes(itemIndex) ? 'fixed' : 'absolute'}` }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
