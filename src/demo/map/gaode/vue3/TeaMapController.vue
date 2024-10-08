<template>
  <div class="map-controller">
    <div v-for="(item, index) in list" :key="index">
      <div
        class="map-controller-item"
        :class="{ 'map-controller-item-active': activeComputed(index) }"
        @click="onSelect(index)"
      >
        {{ item.title }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  map: {
    type: Object,
    required: true,
  },
  /**
   * [Object: { title: 图层名, onShow: 传入一个返回值是promise的方法，resolve的值是layer数组，用于加载数据 }]
   */
  list: {
    type: Array,
    default: () => [],
  },
  // 是否可以多选
  isMultiple: {
    type: Boolean,
    default: true,
  },
  // 是否在显示图层前重新调用接口加载数据
  isReload: {
    type: Boolean,
    default: false,
  },
});

const layerMap = ref(new Map());
watch(
  () => props.map,
  () => {
    for (let index in props.list) {
      props.list[index].onShow().then((res) => {
        layerMap.value.set(Number(index), res);
      });
    }
  },
);

const activeMap = ref(new Map());
const activeComputed = (index) => {
  return activeMap.value.has(index);
};

const onSelect = (index) => {
  if (activeComputed(index)) {
    props.map.remove(activeMap.value.get(index));
    activeMap.value.delete(index);
  } else {
    if (!props.isMultiple) {
      activeMap.value.forEach((value, key) => {
        props.map.remove(value);
        activeMap.value.delete(key);
      });
    }
    if (props.isReload) {
      props.list[index].onShow().then((res) => {
        props.map.add(res);
        activeMap.value.set(index, res);
      });
    } else {
      let layer = layerMap.value.get(index);
      props.map.add(layer);
      activeMap.value.set(index, layer);
    }
  }
};
</script>

<style scoped>
.map-controller {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 1;
}
.map-controller-item {
  background-color: black;
  color: white;
  padding: 10px;
}
.map-controller-item-active {
  background-color: blue;
}
</style>
