<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  width: {
    type: [Number, String],
    required: true,
  },
  height: {
    type: [Number, String],
    required: true,
  },
  direction: {
    type: String,
    values: ["horizontal", "vertical"],
    default: "horizontal",
  },
  duration: {
    type: Number,
    default: 1000,
  },
  trigger: {
    type: String,
    values: ["hover", "click"],
    default: "hover",
  },
  canFlip: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:modelValue", "onFlip", "onUnFlip"]);
const onClick = () => {
  if (props.trigger === "click" && props.canFlip) {
    triggerEmit();
    emit("update:modelValue", !props.modelValue);
  }
};
const onEnterLeave = () => {
  if (props.trigger === "hover" && props.canFlip) {
    triggerEmit();
    emit("update:modelValue", !props.modelValue);
  }
};
const triggerEmit = () => {
  if (!props.modelValue) {
    emit("onFlip");
  } else {
    emit("onUnFlip");
  }
};

const flipInner = computed(() => {
  return [
    props.direction === "horizontal" ? "flip-inner-x" : "",
    props.direction === "vertical" ? "flip-inner-y" : "",
  ];
});
const flipFront = computed(() => {
  return [
    props.direction === "horizontal" ? "flip-front-x" : "",
    props.direction === "vertical" ? "flip-front-y" : "",
  ];
});
const flipBack = computed(() => {
  return [
    props.direction === "horizontal" ? "flip-back-x" : "",
    props.direction === "vertical" ? "flip-back-y" : "",
  ];
});
const duration = computed(() => {
  return "transform " + props.duration + "ms";
});
</script>

<template>
  <div
      :style="{
      width: typeof width === 'number' ? width + 'px' : width,
      height: typeof height === 'number' ? height + 'px' : height,
    }"
      class="flip"
      @click="onClick"
      @mouseenter="onEnterLeave"
      @mouseleave="onEnterLeave"
  >
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

.flip-inner-x {
  transform: v-bind("!props.modelValue ? 'rotateY(0deg)' : 'rotateY(180deg)'");
}

.flip-inner-y {
  transform: v-bind("!props.modelValue ? 'rotateX(0deg)' : 'rotateX(180deg)'");
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
