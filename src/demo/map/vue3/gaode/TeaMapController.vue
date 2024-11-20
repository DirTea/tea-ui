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
              (val: boolean) => {
                onSelectAll(val, item.children!);
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
              (val: boolean) => {
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

<script setup lang="ts">
import { ref, watch } from "vue";
import { ElLoading } from "element-plus";
import type { PropType } from "@vue/runtime-core";

interface listItemType {
  id: string;
  icon?: string;
  title: string;
  isShow?: boolean;
  onShow?: Function;
  children?: Array<listItemType>;
}

const props = defineProps({
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
    type: Object as PropType<Array<listItemType>>,
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
});

const layerMap = ref(new Map());

const activeComputed = (id: string | number) => {
  return layerMap.value.get(id.toString())?.show;
};

watch(
  () => props.map,
  () => {
    for (let index in props.list) {
      // 有二级菜单
      if (props.list[index].children) {
        layerMap.value.set(props.list[index].id.toString(), {
          options: props.list[index],
          checkOut: false,
        });
        props.list[index].children!.forEach((item) => {
          layerMap.value.set(item.id.toString(), {
            options: item,
            layer: null,
            show: false,
            isChild: true,
            father: props.list[index].id.toString(),
          });
          item.isShow && onSelect(true, item.id);
        });
      } else {
        layerMap.value.set(props.list[index].id.toString(), {
          options: props.list[index],
          layer: null,
          show: false,
        });
        props.list[index].isShow && onSelect(true, props.list[index].id);
      }
    }
  },
);

const onSelect = async (val: boolean, id: string) => {
  id = id.toString();
  let obj = layerMap.value.get(id);
  if (!obj || obj.options.children) return;
  // 是否展示
  if (!val) {
    obj.show = false;
    if (obj.isChild) {
      const fa = layerMap.value.get(obj.father);
      fa.checkOut = false;
    }
    if (obj.layer) {
      props.map.remove(obj.layer);
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
    if (!reloadFlag && props.isReload) {
      const loadingInstance = ElLoading.service();
      obj.show = true;
      if (obj.options.onShow) {
        const res = await obj.options.onShow();
        obj.layer = res;
        props.map.add(res);
      }
      loadingInstance.close();
    } else {
      obj.show = true;
      props.map.add(obj.layer);
    }
    // 单选模式
    if (props.isSingle) {
      layerMap.value.forEach((value, key) => {
        if (key !== id) {
          value.show = false;
          if (value.layer) {
            props.map.remove(value.layer);
          }
        }
      });
    }
  }
};

const onSelectAll = (val: boolean, children: Array<listItemType>) => {
  children.forEach((item: listItemType) => {
    onSelect(val, item.id);
  });
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
