<template>
  <div class="flow">
    <div class="flow-panel">
      <div class="flow-options">
        <div style="font-weight: 700">节点</div>
        <div class="flow-options-item" @click="onAddNode('border')">矩形</div>
        <div class="flow-options-item" @click="onAddNode('text')">文本</div>
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
            <el-input v-model="nodeEditing.data.label"></el-input>
          </div>
          <el-button style="margin-top: 10px" type="danger" @click="onDelete">
            删除
          </el-button>
        </div>
      </div>
    </div>
    <VueFlow
      ref="vueFlowRef"
      class="flow-container"
      v-model:nodes="nodes"
      v-model:edges="edges"
      :node-types="nodeTypes"
      :edge-types="edgeTypes"
      @pane-click="onPaneClick"
      @connect="onConnect"
      @node-click="onNodeClick"
      @edge-click="onEdgeClick"
    >
      <Background />
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

const {
  addNodes,
  addEdges,
  removeNodes,
  removeEdges,
  screenToFlowCoordinate,
  dimensions,
} = useVueFlow();

const nodeTypes: Record<string, NodeComponent> = {
  border: markRaw(BorderNode) as NodeComponent,
  text: markRaw(TextNode) as NodeComponent,
};
const edgeTypes: Record<string, EdgeComponent> = {
  solid: markRaw(SolidEdge) as EdgeComponent,
  dashed: markRaw(DashedEdge) as EdgeComponent,
};

const vueFlowRef = ref<HTMLElement | null>(null);
const nodes = ref<Node[]>([]);
const edges = ref<Edge[]>([]);

const connectType = ref<string>("solid");
const nodeEditing = ref<Node>();
const edgeEditing = ref<Edge>();

const onPaneClick = () => {
  clearClick();
};

const onAddNode = (type: string) => {
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

const onConnect = (connectionEvent: Connection) => {
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

const clearClick = () => {
  nodeEditing.value = undefined;
  edgeEditing.value = undefined;
};

const onNodeClick = (nodeMouseEvent: NodeMouseEvent) => {
  clearClick();
  nodeEditing.value = nodeMouseEvent.node;
};

const onEdgeClick = (edgeMouseEvent: EdgeMouseEvent) => {
  clearClick();
  edgeEditing.value = edgeMouseEvent.edge;
};

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
