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
  icon?: string;
  title: string;
  isShow?: boolean;
  onShow?: Function;
  children?: Array<listItemType>;
}

interface listItemWithIdType extends listItemType {
  id: symbol;
  children?: Array<listItemWithIdType>;
}

const props = defineProps({
  map: {
    type: [Object, null] as PropType<Object | null>,
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
const listWithId = ref<listItemWithIdType[]>([]);

const activeComputed = (id: symbol) => {
  return layerMap.value.get(id)?.show;
};

watch(
  () => [props.map, props.list],
  () => {
    if (props.map && props.list) {
      const processItem = (item: listItemType): listItemWithIdType => {
        const result: listItemWithIdType = {
          id: Symbol(),
          ...item,
          children: undefined, // 先初始化为undefined
        };
        if (item.children) {
          result.children = item.children.map((child) => processItem(child));
        }
        return result;
      };
      listWithId.value = props.list.map((item) => processItem(item));
      for (let index in listWithId.value) {
        // 有二级菜单
        if (listWithId.value[index].children) {
          layerMap.value.set(listWithId.value[index].id, {
            options: listWithId.value[index],
            checkOut: false,
          });
          listWithId.value[index].children!.forEach(
            (item: listItemWithIdType) => {
              layerMap.value.set(item.id, {
                options: item,
                layer: null,
                show: false,
                isChild: true,
                father: listWithId.value[index].id,
              });
              item.isShow && onSelect(true, item.id);
            },
          );
        } else {
          layerMap.value.set(listWithId.value[index].id, {
            options: listWithId.value[index],
            layer: null,
            show: false,
          });
          listWithId.value[index].isShow &&
            onSelect(true, listWithId.value[index].id);
        }
      }
    }
  },
  {
    immediate: true,
  },
);

const onSelect = async (val: boolean, id: symbol) => {
  const addLayer = (layer) => {
    if (Array.isArray(layer)) {
      layer.forEach((item) => {
        props.map?.addOverLay(item);
      });
    } else {
      props.map?.addOverLay(layer);
    }
  };
  const removeLayer = (layer) => {
    if (Array.isArray(layer)) {
      layer.forEach((item) => {
        props.map?.removeOverLay(item);
      });
    } else {
      props.map?.removeOverLay(layer);
    }
  };
  let obj = layerMap.value.get(id);
  if (!obj || obj.options.children) return;
  // 关闭图层
  if (!val) {
    if (obj.isChild) {
      const fa = layerMap.value.get(obj.father);
      if (fa) fa.checkOut = false;
    }
    obj.layer && removeLayer(obj.layer);
    obj.show = false;
    return;
  }
  // 打开图层
  const loadingInstance = ElLoading.service();
  setTimeout(() => {
    loadingInstance.close();
  }, 5000);
  try {
    // 是否需要重新加载数据
    let reloadFlag = !obj.layer || props.isReload;
    if (reloadFlag) {
      if (obj.layer && props.isReload) {
        removeLayer(obj.layer);
      }
      obj.layer = await obj.options.onShow();
      addLayer(obj.layer);
    } else {
      addLayer(obj.layer);
    }
    obj.show = true;
  } catch (err) {
    console.log(err);
  } finally {
    loadingInstance.close();
  }
  // 单选模式
  if (props.isSingle) {
    layerMap.value.forEach((value, key) => {
      if (key !== id && value.show && value.layer) {
        value.show = false;
        removeLayer(value.layer);
      }
    });
  }
};

const onSelectAll = (val: boolean, children: Array<listItemWithIdType>) => {
  children.forEach((item: listItemWithIdType) => {
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
  z-index: 999;
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
