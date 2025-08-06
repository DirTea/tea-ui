<template>
  <div class="node">
    <NodeResizer
      color="red"
      :handleStyle="{ width: '8px', height: '8px' }"
      :is-visible="selected"
      :min-width="40"
      :min-height="40"
    />
    <Handle
      id="source-left"
      type="source"
      :position="Position.Left"
      style="background: #25599f"
    />
    <Handle
      id="source-right"
      type="source"
      :position="Position.Right"
      style="background: #25599f"
    />
    <Handle
      id="source-top"
      type="source"
      :position="Position.Top"
      style="background: #25599f"
    />
    <Handle
      id="source-bottom"
      type="source"
      :position="Position.Bottom"
      style="background: #25599f"
    />

    <Handle
      id="target-left"
      type="target"
      :position="Position.Left"
      style="background: #25599f"
    />
    <Handle
      id="target-right"
      type="target"
      :position="Position.Right"
      style="background: #25599f"
    />
    <Handle
      id="target-top"
      type="target"
      :position="Position.Top"
      style="background: #25599f"
    />
    <Handle
      id="target-bottom"
      type="target"
      :position="Position.Bottom"
      style="background: #25599f"
    />
    <span>{{ data.label }}</span>
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from "@vue-flow/core";
import { NodeResizer } from "@vue-flow/node-resizer";
import "@vue-flow/node-resizer/dist/style.css";
const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  selected: Boolean,
});
</script>

<style scoped>
.node {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  font-size: 14px;
  color: #25599f;
  background: white;
  border: 2px solid #25599f;
  border-radius: 4px;
  outline: none;
  height: 100%;
  width: 100%;
  cursor: pointer;
}
</style>
