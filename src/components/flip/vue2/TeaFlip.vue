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
    <div :class="flipInnerComputed" class="flip-inner">
      <div :class="flipFrontComputed" class="flip-front">
        <slot name="front"></slot>
      </div>
      <div :class="flipBackComputed" class="flip-back">
        <slot name="back"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: "modelValue",
    event: "update:modelValue",
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false,
      required: true,
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
  },
  methods: {
    onClick() {
      if (this.trigger === "click" && this.canFlip) {
        this.triggerEmit();
        this.$emit("update:modelValue", !this.modelValue);
      }
    },
    onEnterLeave() {
      if (this.trigger === "hover" && this.canFlip) {
        this.triggerEmit();
        this.$emit("update:modelValue", !this.modelValue);
      }
    },
    triggerEmit() {
      if (!this.modelValue) {
        this.$emit("onFlip");
      } else {
        this.$emit("onUnFlip");
      }
    },
  },
  computed: {
    flipInnerComputed() {
      return [
        this.direction === "horizontal" ? "flip-inner-x" : "",
        this.direction === "vertical" ? "flip-inner-y" : "",
      ];
    },
    flipFrontComputed() {
      return [
        this.direction === "horizontal" ? "flip-front-x" : "",
        this.direction === "vertical" ? "flip-front-y" : "",
      ];
    },
    flipBackComputed() {
      return [
        this.direction === "horizontal" ? "flip-back-x" : "",
        this.direction === "vertical" ? "flip-back-y" : "",
      ];
    },
    durationComputed() {
      return "transform " + this.duration + "ms";
    },
  },
};
</script>

<style scoped>
.flip {
  perspective: 1000px;
}

.flip-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: v-bind(durationComputed);
}

.flip-front,
.flip-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.flip-inner-x {
  transform: v-bind("!modelValue ? 'rotateY(0deg)' : 'rotateY(180deg)'");
}

.flip-inner-y {
  transform: v-bind("!modelValue ? 'rotateX(0deg)' : 'rotateX(180deg)'");
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
