# 天地图

<div style="margin: 10px 0">
  <el-tag type="danger">提示</el-tag> 非组件，请安装相应依赖后，直接复制粘贴代码并调整修改部分代码使用
</div>

## 目前整合的功能

- 地图控件
- 图层控制器和（批量）点标记
- 点标记弹窗框和信息窗
- geojson图层加载
- 定位
- poi位置搜索

<ClientOnly>
  <TeaMapTiandi></TeaMapTiandi>
</ClientOnly>

<script setup lang="ts">
import TeaMapTiandi from "../example/TeaMapTiandi.vue"
</script>

## 源代码

tea-map

```vue
<template>
  <!--  <input id="input" placeholder="请输入地址搜索" />-->
  <div id="container">
    <TeaMapController
      :map="map"
      :list="[
        { title: '图层示例1', onShow: onShow1 },
        {
          title: '图层示例2',
          children: [{ title: '图层示例2-1', onShow: onShow2 }],
        },
      ]"
    ></TeaMapController>
  </div>
</template>

<script setup lang="ts">
import { TeaDialog } from "@/components/dialog/vue3/TeaDialog.ts";
import { h, onMounted, ref } from "vue";
import TeaMapController from "./TeaMapController.vue";

let T = (window as any).T;
let map = ref(null);

// 初始化地图
const initMap = () => {
  // 请在开发前更换天地图tk
  const tk = "";
  let mapTD = new T.Map("container");
  mapTD.centerAndZoom(new T.LngLat(121.631155, 29.736966), 5); // 传参中心点经纬度，以及放大程度
  // 卫星图
  let satelliteLayer = new T.TileLayer(
    `http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles` +
      `&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${tk}`,
  );
  // 路网
  let roadNetLayer = new T.TileLayer(
    `http://t4.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=${tk}`,
  );
  mapTD.addLayer(satelliteLayer);
  mapTD.addLayer(roadNetLayer);
  map.value = mapTD;
  // 在此处使用后面的set方法
};

// 添加地图控件
const setMapController = () => {
  //添加比例尺控件
  map.value.addControl(new T.Control.Zoom());
  // 其他控件参考http://lbs.tianditu.gov.cn/api/js4.0/examples.html
};

// 添加图层控件
const onShow1 = () => {
  return new Promise((resolve) => {
    // 此处可以调用后端接口获取点位
    let layer = [];
    const marker = setMarker({
      lng: 120.631155,
      lat: 28.736966,
    });
    layer.push(marker);
    resolve(layer);
  });
};
const onShow2 = () => {
  return new Promise((resolve) => {
    // 此处可以调用后端接口获取点位
    let layer = [];
    const marker = setMarker({
      lng: 121.631155,
      lat: 29.736966,
    });
    layer.push(marker);
    resolve(layer);
  });
};

// 创建单个标记点
const setMarker = (e: { lng: number; lat: number }) => {
  if (map.value && e) {
    const position = new T.LngLat(e.lng, e.lat); // Marker经纬度
    let marker = new T.Marker(position);
    setDialog(marker);
    setInfoWindow(position);
    return marker;
  } else {
    console.log("地图未加载或传参错误");
  }
};

// marker添加信息窗体
const setInfoWindow = (position: any) => {
  let content = ["这里是信息弹窗"];
  // 创建 infoWindow 实例
  let infoWindow = new T.InfoWindow(content.join("<br>"), {
    offset: new T.Point(0, -30),
  });
  infoWindow.setLngLat(position);
  // 打开信息窗体
  // map.value.addOverLay(infoWindow);
};

// marker添加弹出框
const setDialog = (marker: any) => {
  marker.addEventListener("click", () => {
    TeaDialog({
      props: {},
      content: h("div", {}, "弹出框内容"),
    });
  });
};

// 添加GeoJson图层
// 其他格式的矢量文件必须先转化为geojson
const setGeoJson = () => {
  if (T && map.value) {
    d3.json("/chongqing.json", function (data: any) {
      let overlay = new T.D3Overlay(
        (sel: any, transform: any) => {
          let upd = sel.selectAll("path.geojson").data(data.features);
          upd
            .enter()
            .append("path")
            .attr("class", "geojson")
            .attr("stroke", "white")
            .attr("fill", "red")
            .attr("fill-opacity", "0.5");
        },
        (sel: any, transform: any) => {
          sel.selectAll("path.geojson").each(function (d, i) {
            d3.select(this).attr("d", transform.pathFromGeojson);
          });
        },
      );
      map.value.addOverLay(overlay);
      overlay.bringToBack();
    });
  }
};

// 定位
// 注意：定位会导致setGeoJson()渲染出现bug，建议二者不要一起使用
const setLocation = () => {
  if (map.value) {
    let lo = new T.Geolocation();
    let fn = function (e: any) {
      map.value.centerAndZoom(e.lnglat, 15);
    };
    lo.getCurrentPosition(fn);
  }
};

// poi搜索地点 todo 需要配合下拉框
const setSearch = () => {
  const input = document.getElementById("input") as HTMLInputElement;
  const search = () => {
    // 创建搜索对象
    let localSearch = new T.LocalSearch(map.value, {
      pageCapacity: 10, //每页显示的数量
      onSearchComplete: function (res: any) {
        console.log(res);
      },
    });
    localSearch.search(input.value);
  };
  function debounce(fn: any, wait: any) {
    let timer: any = null;
    return function () {
      if (timer !== null) {
        clearTimeout(timer);
      }
      timer = setTimeout(fn, wait);
    };
  }
  input.addEventListener("input", debounce(search, 1000));
};

onMounted(() => {
  initMap();
});
</script>

<style scoped>
#container {
  height: 500px;
  width: 500px;
}

/* 去除水印 */
:deep(.tdt-control-copyright) {
  display: none !important;
}
:deep(.tdt-control) {
  display: none !important;
}
</style>
```

tea-map-controller

```vue
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
```
