<template>
  <teleport :to="appendTo">
    <div
      :data-key="dataKey"
      class="dialog-outside"
      :style="{
        'background-color': modal ? 'rgba(0,0,0,0.6)' : 'transparent',
      }"
      v-if="model"
    >
      <div
        class="dialog-inside"
        :style="{
          'background-image': background ? `url('${background}')` : 'none',
        }"
      >
        <slot></slot>
        <div v-if="!slotClose" class="dialog-close" @click="onClose">×</div>
        <div style="position: inherit; cursor: pointer" @click="onClose">
          <slot name="close"></slot>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, useSlots, watch } from "vue";

// v-model绑定是否弹出
const model = defineModel({
  type: Boolean,
  default: false,
  required: true,
});

const props = defineProps({
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
    type: [String, Object],
    default: "body",
  },
  // 是否将body滚动锁定
  lockScroll: {
    type: Boolean,
    default: true,
  },
});

const dataKey = Math.random().toString(36).substring(2);

const slotClose = computed(() => {
  return !!useSlots().close;
});

watch(
  () => model.value,
  (value) => {
    const bodyStyle = document.body.style;
    if (value) {
      if (props.lockScroll) {
        bodyStyle.overflow = "hidden";
      }
    } else {
      bodyStyle.overflow = "";
    }
  },
  {
    immediate: true,
  },
);

onMounted(() => {
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLDivElement;
    if (target.dataset!.key === dataKey) {
      if (target.classList.contains("dialog-outside")) {
        onClose();
      }
    }
  });
});
onUnmounted(() => {
  document.body.style.overflow = "";
});

const onClose = () => {
  model.value = false;
};
</script>

<style scoped>
.dialog-outside {
  display: flex;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  animation: fadeAnimation 0.4s;
}
@keyframes fadeAnimation {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.dialog-inside {
  background-size: 100% 100%;
  background-repeat: no-repeat;
  margin: auto;
  animation: slideAnimation 0.2s;
  position: relative;
}
@keyframes slideAnimation {
  0% {
    transform: translateY(-50px);
  }
  100% {
    transform: translateY(0px);
  }
}

.dialog-close {
  position: absolute;
  right: 8px;
  top: 8px;
  font-size: 20px;
  width: 20px;
  height: 20px;
  color: #000000;
  cursor: pointer;
}
</style>
