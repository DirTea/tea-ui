<template>
  <div class="preview-list" v-if="src">
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

<script setup lang="ts">
import { computed } from "vue";
import TeaPreview from "./TeaPreview.vue";

const props = defineProps({
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
  previewTeleported: {
    type: Boolean,
    default: false,
  },
});

const srcList = computed(() => {
  if (props.src) {
    if (Array.isArray(props.src)) {
      return props.src;
    } else {
      return props.src.split(",");
    }
  }
});
</script>

<style scoped>
.preview-list {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
