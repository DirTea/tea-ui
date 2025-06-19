<template>
  <div class="node">
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
    <div>
      <span style="padding: 0 20px">{{ data.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from "@vue-flow/core";
const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});
</script>

<style scoped>
.node {
  padding: 10px;
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
