<template>
  <div class="map-controller" v-if="map && layerMap">
    <div v-for="(item, index) in list" :key="index">
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
     *    id: string, // 必填唯一标识
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
    };
  },
  computed: {
    activeComputed() {
      return (id) => {
        return this.layerMap.get(id)?.show;
      };
    },
  },
  watch: {
    list: {
      immediate: true,
      handler: function () {
        for (let index in this.list) {
          // 有二级菜单
          if (this.list[index].children) {
            this.layerMap.set(this.list[index].id, {
              options: this.list[index],
              checkOut: false,
            });
            this.list[index].children.forEach((item) => {
              this.layerMap.set(item.id, {
                options: item,
                layer: null,
                show: false,
                isChild: true,
                father: this.list[index].id,
              });
              item.isShow && this.onSelect(true, item.id);
            });
          } else {
            this.layerMap.set(this.list[index].id, {
              options: this.list[index],
              layer: null,
              show: false,
            });
            this.list[index].isShow && this.onSelect(true, this.list[index].id);
          }
        }
      },
    },
  },
  methods: {
    async onSelect(val, id) {
      let obj = this.layerMap.get(id);
      if (!obj || obj.options.children) return;
      // 是否展示
      if (!val) {
        obj.show = false;
        if (obj.isChild) {
          const fa = this.layerMap.get(obj.father);
          fa.checkOut = false;
        }
        if (obj.layer) {
          this.map.remove(obj.layer);
        }
      } else {
        // 此次加载不会触发isReload的加载
        let reloadFlag = false;
        // 判断需不需要加载数据
        if (!obj.layer) {
          reloadFlag = true;
          const loadingInstance = ElLoading.service();
          if (obj.options.onShow) {
            obj.layer = await obj.options.onShow();
          }
          loadingInstance.close();
        }
        // isReload需要重新加载数据
        if (!reloadFlag && this.isReload) {
          const loadingInstance = ElLoading.service();
          obj.show = true;
          if (obj.options.onShow) {
            const res = await obj.options.onShow();
            obj.layer = res;
            this.map.add(res);
          }
          loadingInstance.close();
        } else {
          obj.show = true;
          this.map.add(obj.layer);
        }
        // 单选模式
        if (this.isSingle) {
          this.layerMap.forEach((value, key) => {
            if (key !== id) {
              value.show = false;
              if (value.layer) {
                this.map.remove(value.layer);
              }
            }
          });
        }
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
  right: 500px;
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
  background-color: #409eff;
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
