<template>
  <div class="preview-list">
    <tea-preview
      v-for="(item, index) in srcList"
      :key="index"
      :baseUrl="baseUrl"
      :fit="fit"
      :height="height"
      :src="item"
      :width="width"
    ></tea-preview>
  </div>
</template>

<script>
import TeaPreview from "./TeaPreview.vue";

export default {
  components: {
    TeaPreview,
  },
  props: {
    baseUrl: {
      type: String,
      default: "",
    },
    src: {
      type: [String, Array],
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
  computed: {
    srcList() {
      if (Array.isArray(this.src)) {
        return this.src;
      } else {
        return this.src.split(",");
      }
    },
  },
};
</script>

<style scoped>
.preview-list {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
