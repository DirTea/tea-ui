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

<script>
import { ElImage } from "element-plus";

export default {
  components: {
    ElImage,
  },
  props: {
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
  },
  methods: {
    previewFile() {
      window.open(this.realSrc);
    },
  },
  computed: {
    // 真实路径
    realSrc() {
      if (/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/.test(this.src)) {
        return this.src;
      }
      return this.baseUrl + this.src;
    },
    // 文件后缀
    suffix() {
      return this.realSrc.split(".").pop();
    },
    // 是否为图片
    isImage() {
      return (
        [
          "png",
          "jpg",
          "jpeg",
          "bmp",
          "gif",
          "webp",
          "psd",
          "svg",
          "tiff",
        ].indexOf(this.suffix.toLowerCase()) !== -1
      );
    },
  },
};
</script>

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
