<template>
  <teleport to="body">
    <div
      class="dialog-outside"
      :style="{ 'background-color': modal ? 'rgba(0,0,0,0.5)' : 'transparent' }"
      v-if="modelValue"
    >
      <div class="dialog-inside">
        <slot></slot>
      </div>
    </div>
  </teleport>
</template>

<script setup>
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
});

// 弹出框是否显示
const emit = defineEmits(["update:modelValue"]);
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("dialog-outside")) {
    document.body.style.overflow = null;
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
  margin: auto;
}
</style>
