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

<script>
export default {
  props: {
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
  },
  data() {
    return {
      layerMap: new Map(),
      activeMap: new Map(),
    };
  },
  computed: {
    activeComputed() {
      return (index) => {
        return this.activeMap.has(index);
      };
    },
  },
  watch: {
    map: {
      handler: function () {
        for (let index in this.list) {
          this.list[index].onShow().then((res) => {
            this.layerMap.set(Number(index), res);
          });
        }
      },
    },
  },
  methods: {
    onSelect(index) {
      if (this.activeComputed(index)) {
        this.map.remove(this.activeMap.get(index));
        this.activeMap.delete(index);
      } else {
        if (!this.isMultiple) {
          this.activeMap.forEach((value, key) => {
            this.map.remove(value);
            this.activeMap.delete(key);
          });
        }
        if (this.isReload) {
          this.list[index].onShow().then((res) => {
            this.map.add(res);
            this.activeMap.set(index, res);
          });
        } else {
          let layer = this.layerMap.get(index);
          this.map.add(layer);
          this.activeMap.set(index, layer);
        }
      }
    },
  },
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
  z-index: 999;
}
.map-controller-item {
  background-color: black;
  color: white;
  padding: 10px;
  cursor: pointer;
}
.map-controller-item-active {
  background-color: blue;
}
</style>
