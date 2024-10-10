<template>
  <teleport :to="appendTo">
    <Transition name="fade">
      <div
        class="dialog-outside"
        :style="{
          'background-color': modal ? 'rgba(0,0,0,0.6)' : 'transparent',
        }"
        v-show="modelValue"
      >
        <Transition name="slide">
          <div
            v-if="modelValue"
            class="dialog-inside"
            :style="{
              'background-image': background
                ? `url('${props.background}')`
                : 'none',
            }"
          >
            <slot></slot>
          </div>
        </Transition>
      </div>
    </Transition>
  </teleport>
</template>

<script setup lang="ts">
import { watch } from "vue";

const props = defineProps({
  // v-model绑定是否弹出
  modelValue: {
    type: Boolean,
    required: true,
  },
  // 是否开启遮罩层
  modal: {
    type: Boolean,
    default: true,
  },
  // 使用背景图片
  background: {
    type: String,
  },
  // 挂载到哪个元素
  appendTo: {
    type: [String, HTMLElement],
    default: "body",
  },
});

// 弹出框是否显示
const emit = defineEmits(["update:modelValue"]);
document.addEventListener("click", (e) => {
  const target = e.target as HTMLDivElement;
  if (target.classList.contains("dialog-outside")) {
    const body = document.body as HTMLBodyElement;
    body.style.overflow = "auto";
    emit("update:modelValue", false);
  }
});

watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      document.body.style.overflow = "hidden";
    }
  },
);
</script>

<style scoped>
.dialog-outside {
  display: flex;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}
.dialog-inside {
  background-size: 100% 100%;
  background-repeat: no-repeat;
  margin: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateY(-50px);
}
</style>
