<script setup>
import { computed } from "vue";
import { ElImage } from "element-plus";

const props = defineProps({
  baseUrl: {
    type: String,
    default: "",
  },
  src: {
    type: String,
    required: true,
  },
  height: {
    type: String,
    default: "100px",
  },
  width: {
    type: String,
    default: "100px",
  },
  fit: {
    type: String,
    values: ["", "contain", "cover", "fill", "none", "scale-down"],
    default: "contain",
  },
});

// 真实路径
const realSrc = computed(() => {
  if (/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/.test(props.src)) {
    return props.src;
  }
  return props.baseUrl + props.src;
});

// 文件后缀
const suffix = computed(() => {
  return realSrc.value.split(".").pop();
});

// 是否为图片
const isImage = computed(() => {
  return (
    ["png", "jpg", "jpeg", "bmp", "gif", "webp", "psd", "svg", "tiff"].indexOf(
      suffix.value,
    ) !== -1
  );
});

const previewFile = () => {
  window.open(realSrc.value);
};
</script>

<template>
  <el-image
    v-if="isImage"
    :fit="fit"
    :preview-src-list="[realSrc]"
    :src="realSrc"
    :style="{ width: width, height: height }"
    hide-on-click-modal
    lazy
    preview-teleported
  />
  <div v-else class="preview-file" @click="previewFile">
    <span>{{ suffix }}</span>
    <span style="margin-top: 5px">点击查看</span>
  </div>
</template>

<style scoped>
.preview-file {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: v-bind(height);
  width: v-bind(width);
  background-color: #f5f7fa;
  font-size: 14px;
  color: #a8abb2;
  vertical-align: middle;
}
</style>
