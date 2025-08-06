<template>
  <path
    :d="path"
    :stroke="data?.color || '#25599f'"
    :stroke-width="data?.width || 2"
    fill="none"
  />
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { EdgeProps, getBezierPath } from "@vue-flow/core";

const props = defineProps({
  id: String,
  sourceX: Number,
  sourceY: Number,
  targetX: Number,
  targetY: Number,
  data: Object, // 接收自定义虚线样式参数
});

const path = ref("");

const updatePath = () => {
  path.value = getBezierPath(props as EdgeProps)[0];
};

onMounted(updatePath);
watch(
  [
    () => props.sourceX,
    () => props.sourceY,
    () => props.targetX,
    () => props.targetY,
  ],
  () => {
    updatePath();
  },
);
</script>
