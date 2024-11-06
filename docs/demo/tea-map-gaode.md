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

将申请好的安全密钥和key输入以开始预览demo效果

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
        { title: '图层示例1', onShow: onShow1 },
        { title: '图层示例2', onShow: onShow2 },
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
    layer.push(marker);
    resolve(layer);
  });
};
const onShow2 = () => {
  return new Promise((resolve) => {
    // 此处可以调用后端接口获取点位
    let layer = [];
    const marker = setMarker({
      lng: 108.8306,
      lat: 31.0089,
    });
    layer.push(marker);
    resolve(layer);
  });
};

// 创建单个标记点
const setMarker = (e: { lng: number; lat: number }) => {
  if (AMap && e) {
    const position = new AMap.LngLat(e.lng, e.lat); // Marker经纬度
    const marker = new AMap.Marker({
      position: position,
    });
    setDialog(marker);
    setInfoWindow(position);
    return marker;
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
      props: {},
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
        { title: '图层示例1', onShow: onShow1 },
        { title: '图层示例2', onShow: onShow2 },
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
  if (AMap && e) {
    const position = new AMap.LngLat(e.lng, e.lat); // Marker经纬度
    const marker = new AMap.Marker({
      position: position,
    });
    setDialog(marker);
    setInfoWindow(position);
    return marker;
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
      props: {},
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
  <div class="map-controller" v-if="map">
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

<script setup lang="ts">
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
    type: Array<{ title: string; onShow: Function }>,
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
      props.list[index].onShow().then((res: AMap.Marker[]) => {
        layerMap.value.set(Number(index), res);
      });
    }
  },
);

const activeMap = ref(new Map());
const activeComputed = (index: number) => {
  return activeMap.value.has(index);
};

const onSelect = (index: number) => {
  if (activeComputed(index)) {
    props.map?.remove(activeMap.value.get(index));
    activeMap.value.delete(index);
  } else {
    if (!props.isMultiple) {
      activeMap.value.forEach((value, key) => {
        props.map?.remove(value);
        activeMap.value.delete(key);
      });
    }
    if (props.isReload) {
      props.list[index].onShow().then((res: AMap.Marker[]) => {
        props.map?.add(res);
        activeMap.value.set(index, res);
      });
    } else {
      let layer = layerMap.value.get(index);
      props.map?.add(layer);
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
```
