# Vue Flow流程图

<div style="margin: 10px 0">
  <el-tag type="danger">提示</el-tag> 非组件，请安装相应依赖后，直接复制粘贴代码并调整修改部分代码使用
</div>

## 源代码

仅TeaFlow，完整代码请下载项目查看

```vue
<template>
  <div class="flow">
    <div class="flow-panel">
      <div class="flow-options">
        <div style="font-weight: 700">节点</div>
        <div class="flow-options-item" @click="onNodeAdd('border')">矩形</div>
        <div class="flow-options-item" @click="onNodeAdd('text')">文本</div>
        <div style="font-weight: 700">连线</div>
        <div
          class="flow-options-item"
          @click="connectType = 'solid'"
          :class="{ 'flow-options-item-active': connectType === 'solid' }"
        >
          实线
        </div>
        <div
          class="flow-options-item"
          @click="connectType = 'dashed'"
          :class="{ 'flow-options-item-active': connectType === 'dashed' }"
        >
          虚线
        </div>
      </div>
      <div class="flow-settings" v-if="nodeEditing || edgeEditing">
        <div style="padding: 10px">
          <div style="display: flex; align-items: center" v-if="nodeEditing">
            <div style="flex-shrink: 0">文本：</div>
            <el-input
              ref="nodeEditingRef"
              v-model="nodeEditing.data.label"
            ></el-input>
          </div>
          <el-button style="margin-top: 10px" type="danger" @click="onDelete">
            删除
          </el-button>
        </div>
      </div>
    </div>
    <VueFlow
      id="vueFlowId"
      class="flow-container"
      v-model:nodes="nodes"
      v-model:edges="edges"
      :node-types="nodeTypes"
      :edge-types="edgeTypes"
      @pane-click="onPaneClick"
      @connect="onEdgeAdd"
      @node-click="onNodeClick"
      @edge-click="onEdgeClick"
    >
      <Background variant="lines" />
    </VueFlow>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, markRaw } from "vue";
import { useVueFlow, VueFlow } from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import type {
  Node,
  Edge,
  NodeComponent,
  EdgeComponent,
  Connection,
  NodeMouseEvent,
  EdgeMouseEvent,
} from "@vue-flow/core";
import BorderNode from "./nodes/BorderNode.vue";
import TextNode from "./nodes/TextNode.vue";
import SolidEdge from "./edges/SolidEdge.vue";
import DashedEdge from "./edges/DashedEdge.vue";
import { useScreenshot } from "./useScreenshot";

const {
  vueFlowRef,
  addNodes,
  addEdges,
  removeNodes,
  removeEdges,
  getSelectedNodes,
  removeSelectedNodes,
  screenToFlowCoordinate,
  dimensions,
  fitView,
} = useVueFlow("vueFlowId");
const { capture } = useScreenshot();

const nodeTypes: Record<string, NodeComponent> = {
  border: markRaw(BorderNode) as NodeComponent,
  text: markRaw(TextNode) as NodeComponent,
};
const edgeTypes: Record<string, EdgeComponent> = {
  solid: markRaw(SolidEdge) as EdgeComponent,
  dashed: markRaw(DashedEdge) as EdgeComponent,
};

const nodes = ref<Node[]>([]);
const edges = ref<Edge[]>([]);

const connectType = ref<string>("solid");
const nodeEditingRef = ref();
const nodeEditing = ref<Node>();
const edgeEditing = ref<Edge>();

// 点击面板
const onPaneClick = () => {
  clearClick();
};

// 添加节点
const onNodeAdd = (type: string) => {
  nextTick(() => {
    if (vueFlowRef.value) {
      const position = screenToFlowCoordinate({
        x: dimensions.value.width / 2,
        y: dimensions.value.height / 2,
      });
      const nodeId = `${nodes.value.length === 0 ? 1 : Number(nodes.value[nodes.value.length - 1].id) + 1}`;
      addNodes({
        id: nodeId,
        type: type,
        data: { label: "" },
        position,
      });
    }
  });
};

// 添加边
const onEdgeAdd = (connectionEvent: Connection) => {
  nextTick(() => {
    addEdges({
      type: connectType.value,
      source: connectionEvent.target,
      sourceHandle: connectionEvent.targetHandle,
      target: connectionEvent.source,
      targetHandle: connectionEvent.sourceHandle,
    });
  });
};

// 清除点击
const clearClick = () => {
  nodeEditing.value = undefined;
  edgeEditing.value = undefined;
};

// 点击节点
const onNodeClick = async (nodeMouseEvent: NodeMouseEvent) => {
  clearClick();
  nodeEditing.value = nodeMouseEvent.node;
  await nextTick();
  nodeEditingRef.value.focus();
};

// 点击边
const onEdgeClick = (edgeMouseEvent: EdgeMouseEvent) => {
  clearClick();
  edgeEditing.value = edgeMouseEvent.edge;
};

// 删除元素
const onDelete = () => {
  if (nodeEditing.value) {
    removeNodes(nodeEditing.value.id, true, false);
    clearClick();
  }
  if (edgeEditing.value) {
    removeEdges(edgeEditing.value.id);
    clearClick();
  }
};

// 导出图片
const onExportImg = () => {
  if (!vueFlowRef.value) {
    console.warn("VueFlow element not found");
    return;
  }
  clearClick();
  removeSelectedNodes(getSelectedNodes.value);
  fitView();
  capture(vueFlowRef.value, { shouldDownload: true });
};
</script>

<style>
@import "@vue-flow/core/dist/style.css";
@import "@vue-flow/core/dist/theme-default.css";

.flow {
  width: 1000px;
  height: 500px;
  position: relative;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.12);
}

.flow-panel {
  display: flex;
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.12);
}

.flow-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 90%;
  background: #fff;
  padding: 10px;
  overflow: scroll;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}

.flow-options-item {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 50px;
  height: 50px;
  color: #25599f;
  border: 1px #25599f solid;
}

.flow-options-item-active {
  color: white;
  background: #25599f;
}

.flow-settings {
  background: #fff;
  overflow: hidden;
  width: 300px;
}

.flow-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

::-webkit-scrollbar {
  display: none;
}
</style>
```
