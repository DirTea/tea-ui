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
              'background-image': background ? `url('${background}')` : 'none',
            }"
          >
            <slot></slot>
          </div>
        </Transition>
      </div>
    </Transition>
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
  },
  watch: {
    modelValue: {
      handler: function (value) {
        if (value) {
          document.body.style.overflow = "hidden";
        }
      },
    },
  },
  mounted() {
    document.addEventListener("click", (e) => {
      const target = e.target;
      if (target.classList.contains("dialog-outside")) {
        const body = document.body;
        body.style.overflow = "auto";
        this.$emit("update:modelValue", false);
      }
    });
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
