<template>
  <teleport :to="appendTo">
    <div
      :data-key="dataKey"
      class="dialog-outside"
      :style="{
        'background-color': modal ? 'rgba(0,0,0,0.6)' : 'transparent',
      }"
      v-if="modelValue"
    >
      <div
        class="dialog-inside"
        :style="{
          'background-image': background ? `url('${background}')` : 'none',
        }"
      >
        <slot></slot>
      </div>
    </div>
  </teleport>
</template>

<script>
export default {
  model: {
    prop: "modelValue",
    event: "update:modelValue",
  },
  props: {
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
      type: [String, Object],
      default: "body",
    },
    // 是否将body滚动锁定
    lockScroll: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      dataKey: crypto.randomUUID(),
    };
  },
  watch: {
    modelValue: {
      handler: function (value) {
        const bodyStyle = document.body.style;
        if (value) {
          if (this.lockScroll) {
            bodyStyle.overflow = "hidden";
          }
        } else {
          bodyStyle.overflow = "";
        }
      },
      immediate: true,
    },
  },
  mounted() {
    document.addEventListener("click", (e) => {
      const target = e.target;
      if (target.dataset.key === this.dataKey) {
        if (target.classList.contains("dialog-outside")) {
          this.$emit("update:modelValue", false);
        }
      }
    });
  },
  unmounted() {
    document.body.style.overflow = "";
  },
};
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
}
@keyframes slideAnimation {
  0% {
    transform: translateY(-50px);
  }
  100% {
    transform: translateY(0px);
  }
}
</style>
