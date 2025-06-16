<template>
  <div class="map-controller" v-if="map && layerMap">
    <div v-for="(item, index) in listWithId" :key="index">
      <el-popover
        popper-class="!bg-black/[.5] !shadow-none"
        placement="left"
        trigger="click"
        :disabled="!item.children"
      >
        <template #reference>
          <div
            class="map-controller-item"
            :class="{ 'map-controller-item-active': activeComputed(item.id) }"
            @click="onSelect(!activeComputed(item.id), item.id)"
          >
            <div v-if="item.icon">
              <img :src="item.icon" class="map-controller-icon" alt="" />
            </div>
            <div>
              {{ item.title }}
            </div>
          </div>
        </template>
        <div v-if="item.children" class="map-controller-item-next">
          <el-checkbox
            v-if="isCheckOut && !isSingle"
            v-model="layerMap.get(item.id).checkOut"
            label="全选"
            size="large"
            @change="
              (val) => {
                onSelectAll(val, item.children);
              }
            "
          />
          <el-checkbox
            v-for="(itemA, indexA) in item.children"
            v-model="layerMap.get(itemA.id).show"
            :key="indexA"
            :label="itemA.title"
            size="large"
            @change="
              (val) => {
                onSelect(val, itemA.id);
              }
            "
            :checked="itemA.isShow"
          />
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import { ElLoading } from "element-plus";

export default {
  props: {
    map: {
      required: true,
    },
    /**
     * [
     *  {
     *    icon: string, // 图标
     *    title: string, // 图层名
     *    isShow: boolean, // 是否默认选中
     *    onShow: Function<Promise>, // 传入一个返回值是promise的方法，resolve的值是layer数组，用于加载数据
     *    children: Array // 用于渲染二级菜单，配置了children的对象isShow和onShow属性不会生效
     *  }
     * ]
     */
    list: {
      type: Array,
      default: () => [],
    },
    // 是否开启单选模式
    isSingle: {
      type: Boolean,
      default: false,
    },
    // 是否开启全选选项
    isCheckOut: {
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
      listWithId: [],
    };
  },
  computed: {
    activeComputed() {
      return (id) => {
        return this.layerMap.get(id).show;
      };
    },
  },
  watch: {
    list: {
      immediate: true,
      handler: function () {
        const processItem = (item) => {
          const result = {
            id: Symbol(),
            ...item,
            children: undefined, // 先初始化为undefined
          };
          if (item.children) {
            result.children = item.children.map((child) => processItem(child));
          }
          return result;
        };
        this.listWithId = this.list.map((item) => processItem(item));
        for (let index in this.listWithId) {
          // 有二级菜单
          if (this.listWithId[index].children) {
            this.layerMap.set(this.listWithId[index].id, {
              options: this.listWithId[index],
              checkOut: false,
            });
            this.listWithId[index].children.forEach((item) => {
              this.layerMap.set(item.id, {
                options: item,
                layer: null,
                show: false,
                isChild: true,
                father: this.listWithId[index].id,
              });
              item.isShow && this.onSelect(true, item.id);
            });
          } else {
            this.layerMap.set(this.listWithId[index].id, {
              options: this.listWithId[index],
              layer: null,
              show: false,
            });
            this.listWithId[index].isShow &&
              this.onSelect(true, this.listWithId[index].id);
          }
        }
      },
    },
  },
  methods: {
    async onSelect(val, id) {
      const addLayer = (layer) => {
        this.map.add(layer);
      };
      const removeLayer = (layer) => {
        this.map.remove(layer);
      };
      let obj = this.layerMap.get(id);
      if (!obj || obj.options.children) return;
      // 关闭图层
      if (!val) {
        obj.show = false;
        if (obj.isChild) {
          const fa = this.layerMap.get(obj.father);
          if (fa) fa.checkOut = false;
        }
        obj.layer && removeLayer(obj.layer);
        return;
      }

      // 打开图层
      obj.show = true;
      // 是否需要重新加载数据
      let reloadFlag = !obj.layer || this.isReload;
      if (reloadFlag) {
        const loadingInstance = ElLoading.service();
        if (obj.layer && this.isReload) {
          removeLayer(obj.layer);
        }
        obj.layer = await obj.options.onShow();
        addLayer(obj.layer);
        loadingInstance.close();
      } else {
        addLayer(obj.layer);
      }
      // 单选模式
      if (this.isSingle) {
        this.layerMapforEach((value, key) => {
          if (key !== id && value.show && value.layer) {
            value.show = false;
            removeLayer(value.layer);
          }
        });
      }
    },
    onSelectAll(val, children) {
      children.forEach((item) => {
        this.onSelect(val, item.id);
      });
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
  right: 20px;
  z-index: 1;
}
.map-controller-item {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  user-select: none;
}
.map-controller-item-active {
  background-color: #25599f;
}
.map-controller-icon {
  height: 15px;
  width: 15px;
}
.map-controller-item-next {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
