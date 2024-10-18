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
import { TeaDialog } from "../../../../components/dialog/vue3/TeaDialog.ts";
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
        getPolygon: (lnglats: AMap.LngLatLike) => {
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
