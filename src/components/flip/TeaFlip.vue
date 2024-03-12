<script setup>
import {computed} from "vue";

const props = defineProps({
  width: {
    type: [Number, String],
    required: true
  },
  height: {
    type: [Number, String],
    required: true
  },
  direction: {
    type: String,
    default: 'horizontal'
  },
  duration: {
    type: Number,
    default: 1000
  }
})

const flipInner = computed(() => {
  return [
    props.direction === 'horizontal' ? 'flip-inner-x' : '',
    props.direction === 'vertical' ? 'flip-inner-y' : '',
  ]
})
const flipFront = computed(() => {
  return [
    props.direction === 'horizontal' ? 'flip-front-x' : '',
    props.direction === 'vertical' ? 'flip-front-y' : '',
  ]
})
const flipBack = computed(() => {
  return [
    props.direction === 'horizontal' ? 'flip-back-x' : '',
    props.direction === 'vertical' ? 'flip-back-y' : '',
  ]
})
const duration = computed(() => {
  return 'transform ' + props.duration + 'ms'
})
</script>

<template>
  <div
      :style="{ width: typeof width === 'number'? width + 'px' : width, height: typeof height === 'number'? height + 'px' : height }"
      class="flip">
    <div :class="flipInner" class="flip-inner">
      <div :class="flipFront" class="flip-front">
        <slot name="front"></slot>
      </div>
      <div :class="flipBack" class="flip-back">
        <slot name="back"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flip {
  perspective: 1000px;
}

.flip-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: v-bind(duration);
}

.flip-front,
.flip-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.flip:hover .flip-inner-x {
  transform: rotateY(180deg);
}

.flip:hover .flip-inner-y {
  transform: rotateX(180deg);
}

.flip-front-x {
  transform: rotateY(0deg);
}

.flip-front-y {
  transform: rotateX(0deg);
}

.flip-back-x {
  transform: rotateY(180deg);
}

.flip-back-y {
  transform: rotateX(180deg);
}
</style>
