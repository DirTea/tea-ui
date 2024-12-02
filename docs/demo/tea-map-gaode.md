# 高德地图

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

## 示例

在高德地图申请Web端(JS API)的key，将申请好的安全密钥和key输入以开始预览demo效果

<div class="vp-raw">
  <div style="margin-bottom: 10px">
    <el-input v-model="input1" style="width: 240px" placeholder="请输入安全密钥securityJsCode" />
    <el-input v-model="input2" style="width: 240px" placeholder="请输入Web端开发者Key" />
    <el-button type="primary" @click="initMap">开始预览</el-button>
  </div>
  <input id="input" placeholder="请输入地址搜索" v-show="map" />
  <div id="container" v-show="map">
    <TeaMapController
      :map="map"
      :list="[
        { id: '图层示例1', title: '图层示例1', onShow: onShow1 },
        {
          id: '图层示例2',
          title: '图层示例2',
          children: [
            { id: '图层示例2-1', title: '图层示例2-1', onShow: onShow2 },
          ],
        },
      ]"
    ></TeaMapController>
  </div>
</div>

<script setup lang="ts">
import "@amap/amap-jsapi-types";
import AMapLoader from "@amap/amap-jsapi-loader";
import axios from "axios";
import { h, onMounted, ref } from "vue";
import { TeaDialog } from "../../src/components/dialog/vue3/TeaDialog.ts";
import TeaMapController from "../../src/demo/map/vue3/gaode/TeaMapController.vue";

let AMap: any;
let map = ref();

const input1 = ref("");
const input2 = ref("");

// 初始化地图
const initMap = () => {
  (window as any)._AMapSecurityConfig = {
    securityJsCode: input1.value, // 安全密钥
  };
  AMapLoader.load({
    key: input2.value, // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [
      "AMap.MapType",
      "AMap.GeoJSON",
      "AMap.Geolocation",
      "AMap.PlaceSearch",
      "AMap.AutoComplete",
    ], // 需要使用的的插件列表
  }).then((Amap) => {
    AMap = Amap;
    // 添加默认图层
    map.value = new AMap.Map("container", {
      center: [108, 29.8],
      layers: [
        new AMap.TileLayer.Satellite(), // 卫星图
        new AMap.TileLayer.RoadNet(), // 路网
      ],
      zoom: 6,
    });
    // 在此处使用后面的set方法
    setMapController();
    setGeoJson();  
    setLocation();
    setSearch();
  });
};
initMap()

// 添加地图控件
const setMapController = () => {
  // 添加类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
  map.value?.addControl(new AMap.MapType());
  // 其他控件参考https://lbs.amap.com/api/javascript-api-v2/guide/overlays/toolbar
};

// 添加图层控件
const onShow1 = () => {
  return new Promise((resolve) => {
    // 此处可以调用后端接口获取点位
    let layer = [];
    const marker = setMarker({
      lng: 108.8196,
      lat: 28.8666,
    });
    setDialog(marker);
    layer.push(marker);
    resolve(layer);
  })
};
const onShow2 = () => {
  return new Promise((resolve) => {
    // 此处可以调用后端接口获取点位
    let layer = [];
    const marker = setMarker({
      lng: 108.8306,
      lat: 31.0089,
    });
    setDialog(marker);
    layer.push(marker);
    resolve(layer);
  });
};

// 创建一个标记点
const setMarker = (
  e: { lng: number; lat: number },
  params?: AMap.MarkerOptions,
) => {
  if (AMap && e) {
    const position = new AMap.LngLat(e.lng, e.lat); // Marker经纬度
    return new AMap.Marker({
      position: position,
      ...params,
    });
  } else {
    console.log("地图未加载或传参错误");
  }
};

// 创建一条折线
const setLine = (
  e: { lng: number; lat: number },
  params?: AMap.PolylineOptions,
) => {
  if (AMap && e) {
    let path: Array<AMap.LngLat> | Array<Array<AMap.LngLat>> = [];
    if (Array.isArray(e)) {
      e.forEach((item) => {
        // 线段经纬度
        path.push(new AMap.LngLat(item.lng, item.lat));
      });
      return new AMap.Polyline({
        path: path,
        ...params,
      });
    }
  } else {
    console.log("地图未加载或传参错误");
  }
};

// 创建一个文本标记点
const setText = (
  e: { lng: number; lat: number },
  params?: AMap.TextOptions,
) => {
  if (AMap && e) {
    const position = new AMap.LngLat(e.lng, e.lat); // Marker经纬度
    return new AMap.Text({
      position: position,
      anchor: "center",
      ...params,
    });
  } else {
    console.log("地图未加载或传参错误");
  }
};

// marker添加信息窗体
const setInfoWindow = (position: AMap.LngLat) => {
  let content = ["这里是信息弹窗"];
  // 创建 infoWindow 实例
  let infoWindow = new AMap.InfoWindow({
    autoMove: true,
    offset: new AMap.Pixel(0, -30),
    content: content.join("<br>"), //传入 dom 对象，或者 html 字符串
  });
  // 打开信息窗体
  // infoWindow.open(map.value, position);
};

// marker添加弹出框
const setDialog = (marker: AMap.Marker) => {
  marker.on("click", () => {
    TeaDialog({
      content: h("div", { style: "width: 500px;height: 500px;background: white;display: flex;justify-content: center;align-items: center;" }, "弹出框内容"),
    });
  });
};

// 添加GeoJson图层
// 其他格式的矢量文件必须先转化为geojson
const setGeoJson = () => {
  if (AMap && map.value) {
    axios.get("/chongqing.json").then((res) => {
      let geojson = new AMap.GeoJSON({
        geoJSON: res.data,
        getPolygon: (geojson: Object, lnglats: AMap.LngLatLike) => {
          let polygon = new AMap.Polygon({
            path: lnglats,
            strokeColor: "white", // 边框颜色
            fillColor: "red", // 填充颜色
          });
          polygon.on("click", (e: any) => {
            console.log(e);
          });
          return polygon;
        },
      });
        console.log(geojson)
      map.value?.add(geojson);
    });
  }
};

// 定位
const setLocation = () => {
  if (AMap && map.value) {
    let geolocation = new AMap.Geolocation({
      // 是否使用高精度定位，默认：true
      enableHighAccuracy: true,
      // 设置定位超时时间，默认：无穷大
      timeout: 5000,
      //  定位按钮的排放位置,  RB表示右下
      buttonPosition: "RB",
      // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
      buttonOffset: new AMap.Pixel(20, 80),
      //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
      zoomToAccuracy: true,
      panToLocation: true,
      showMarker: false,
      showCircle: false,
    });
    // 添加定位按钮控件
    map.value.addControl(geolocation);
    geolocation.on("complete", onComplete);
    geolocation.on("onError", onError);
    function onComplete(data: any) {
      // 定位成功后调用
      console.log(data);
    }
    function onError(data: any) {
      // 定位出错
      console.log(data);
    }
  } else {
    console.log("AMap未加载");
  }
};

// poi搜索地点
const setSearch = () => {
  if (AMap) {
    let autoComplete = new AMap.AutoComplete({
      input: "input",
      city: "全国",
    });
    let placeSearch = new AMap.PlaceSearch({
      map: map.value,
    }); //构造地点查询类
    autoComplete.on("select", select); //注册监听，当选中某条记录时会触发
    function select(e: any) {
      placeSearch.setCity(e.poi.adcode);
      placeSearch.search(e.poi.name); //关键字查询查询
    }
  }
};
</script>

<style scoped>
#container {
  height: 500px;
  width: 500px;
}

/* 去除水印 */
:deep(.amap-logo) {
  display: none !important;
}
:deep(.amap-copyright) {
  display: none !important;
}

/* 修改标记点文本 */
:deep(.amap-marker-label) {
  background-color: transparent;
  border: none;
  padding: 0;
}
</style>

## 源代码

tea-map

```vue
<template>
  <!--  <input id="input" placeholder="请输入地址搜索" />-->
  <div id="container">
    <TeaMapController
      :map="map"
      :list="[
        { id: '图层示例1', title: '图层示例1', onShow: onShow1 },
        {
          id: '图层示例2',
          title: '图层示例2',
          children: [
            { id: '图层示例2-1', title: '图层示例2-1', onShow: onShow2 },
          ],
        },
      ]"
    ></TeaMapController>
  </div>
</template>

<script setup lang="ts">
import "@amap/amap-jsapi-types";
import AMapLoader from "@amap/amap-jsapi-loader";
import axios from "axios";
import { h, onMounted, ref } from "vue";
import { TeaDialog } from "@/components/dialog/vue3/TeaDialog.ts";
import TeaMapController from "./TeaMapController.vue";

(window as any)._AMapSecurityConfig = {
  securityJsCode: "", // 安全密钥
};

let AMap: any;
let map = ref();

// 初始化地图
const initMap = () => {
  AMapLoader.load({
    key: "", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [
      "AMap.MapType",
      "AMap.GeoJSON",
      "AMap.Geolocation",
      "AMap.PlaceSearch",
      "AMap.AutoComplete",
    ], // 需要使用的的插件列表
  }).then((Amap) => {
    AMap = Amap;
    // 添加默认图层
    map.value = new AMap.Map("container", {
      layers: [
        new AMap.TileLayer.Satellite(), // 卫星图
        new AMap.TileLayer.RoadNet(), // 路网
      ],
      zoom: 5,
    });
    // 在此处使用后面的set方法
  });
};

// 添加地图控件
const setMapController = () => {
  // 添加类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
  map.value?.addControl(new AMap.MapType());
  // 其他控件参考https://lbs.amap.com/api/javascript-api-v2/guide/overlays/toolbar
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
    setDialog(marker);
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
    setDialog(marker);
    layer.push(marker);
    resolve(layer);
  });
};

// 创建单个标记点
const setMarker = (
  e: { lng: number; lat: number },
  params?: AMap.MarkerOptions,
) => {
  if (AMap && e) {
    const position = new AMap.LngLat(e.lng, e.lat); // Marker经纬度
    return new AMap.Marker({
      position: position,
      ...params,
    });
  } else {
    console.log("地图未加载或传参错误");
  }
};

// 创建一条折线
const setLine = (
  e: { lng: number; lat: number },
  params?: AMap.PolylineOptions,
) => {
  if (AMap && e) {
    let path: Array<AMap.LngLat> | Array<Array<AMap.LngLat>> = [];
    if (Array.isArray(e)) {
      e.forEach((item) => {
        // 线段经纬度
        path.push(new AMap.LngLat(item.lng, item.lat));
      });
      return new AMap.Polyline({
        path: path,
        ...params,
      });
    }
  } else {
    console.log("地图未加载或传参错误");
  }
};

// 创建一个文本标记点
const setText = (
  e: { lng: number; lat: number },
  params?: AMap.TextOptions,
) => {
  if (AMap && e) {
    const position = new AMap.LngLat(e.lng, e.lat); // Marker经纬度
    return new AMap.Text({
      position: position,
      anchor: "center",
      ...params,
    });
  } else {
    console.log("地图未加载或传参错误");
  }
};

// marker添加信息窗体
const setInfoWindow = (position: AMap.LngLat) => {
  let content = ["这里是信息弹窗"];
  // 创建 infoWindow 实例
  let infoWindow = new AMap.InfoWindow({
    autoMove: true,
    offset: new AMap.Pixel(0, -30),
    content: content.join("<br>"), //传入 dom 对象，或者 html 字符串
  });
  // 打开信息窗体
  // infoWindow.open(map.value, position);
};

// marker添加弹出框
const setDialog = (marker: AMap.Marker) => {
  marker.on("click", () => {
    TeaDialog({
      content: h("div", {}, "弹出框内容"),
    });
  });
};

// 添加GeoJson图层
// 其他格式的矢量文件必须先转化为geojson
const setGeoJson = () => {
  if (AMap && map.value) {
    axios.get("/chongqing.json").then((res) => {
      let geojson = new AMap.GeoJSON({
        geoJSON: res.data,
        getPolygon: (geojson: Object, lnglats: AMap.LngLatLike) => {
          let polygon = new AMap.Polygon({
            path: lnglats,
            strokeColor: "white", // 边框颜色
            fillColor: "red", // 填充颜色
          });
          polygon.on("click", (e: any) => {
            console.log(e);
          });
          return polygon;
        },
      });
      map.value?.add(geojson);
    });
  }
};

// 定位
const setLocation = () => {
  if (AMap && map.value) {
    let geolocation = new AMap.Geolocation({
      // 是否使用高精度定位，默认：true
      enableHighAccuracy: true,
      // 设置定位超时时间，默认：无穷大
      timeout: 5000,
      //  定位按钮的排放位置,  RB表示右下
      buttonPosition: "RB",
      // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
      buttonOffset: new AMap.Pixel(20, 80),
      //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
      zoomToAccuracy: true,
      panToLocation: true,
      showMarker: false,
      showCircle: false,
    });
    // 添加定位按钮控件
    map.value.addControl(geolocation);
    geolocation.on("complete", onComplete);
    geolocation.on("onError", onError);
    function onComplete(data: any) {
      // 定位成功后调用
      console.log(data);
    }
    function onError(data: any) {
      // 定位出错
      console.log(data);
    }
  } else {
    console.log("AMap未加载");
  }
};

// poi搜索地点
const setSearch = () => {
  if (AMap) {
    let autoComplete = new AMap.AutoComplete({
      input: "input",
      city: "全国",
    });
    let placeSearch = new AMap.PlaceSearch({
      map: map.value,
    }); //构造地点查询类
    autoComplete.on("select", select); //注册监听，当选中某条记录时会触发
    function select(e: any) {
      placeSearch.setCity(e.poi.adcode);
      placeSearch.search(e.poi.name); //关键字查询查询
    }
  }
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
:deep(.amap-logo) {
  display: none !important;
}
:deep(.amap-copyright) {
  display: none !important;
}

/* 修改标记点文本 */
:deep(.amap-marker-label) {
  background-color: transparent;
  border: none;
  padding: 0;
}
</style>
```

tea-map-controller

```vue
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
```
