<template>
  <!--  <input id="input" placeholder="请输入地址搜索" />-->
  <div id="container"></div>
</template>

<script setup>
import "@amap/amap-jsapi-types";
import AMapLoader from "@amap/amap-jsapi-loader";
import axios from "axios";
import { h } from "vue";
import { TeaDialog } from "../../../../components/dialog/TeaDialog";

window._AMapSecurityConfig = {
  securityJsCode: "21f22f00721c292e5baff2bb7b02b1c2", // 安全密钥
};

let AMap;
let map;

// 初始化地图
const initMap = () => {
  AMapLoader.load({
    key: "28c72476cc459a12a89ecd96282fb616", // 申请好的Web端开发者Key，首次调用 load 时必填
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
    map = new AMap.Map("container", {
      layers: [
        new AMap.TileLayer.Satellite(), // 卫星图
        new AMap.TileLayer.RoadNet(), // 路网
      ],
      zoom: 5,
    });
    // 在此处使用后面的set方法
  });
};
initMap();

// 添加图层控件
const setController = () => {
  // 添加类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
  map.addControl(new AMap.MapType());
  // 其他控件参考https://lbs.amap.com/api/javascript-api-v2/guide/overlays/toolbar
};

// 添加单个标记点
const setMarker = (e) => {
  if (AMap && e) {
    const position = new AMap.LngLat(e.lng, e.lat); // Marker经纬度
    const marker = new AMap.Marker({
      position: position,
    });
    // setDialog(marker);
    // setInfoWindow(position)
    map.add(marker);
  } else {
    console.log("AMap未加载或传参错误");
  }
};

// marker添加信息窗体
const setInfoWindow = (position) => {
  let content = ["这里是信息弹窗"];
  // 创建 infoWindow 实例
  let infoWindow = new AMap.InfoWindow({
    autoMove: true,
    offset: new AMap.Pixel(0, -30),
    content: content.join("<br>"), //传入 dom 对象，或者 html 字符串
  });
  // 打开信息窗体
  infoWindow.open(map, position);
};

// marker添加弹出框
const setDialog = (marker) => {
  marker.on("click", function (e) {
    TeaDialog({
      props: { background: "/src/assets/vue.svg" },
      content: h("div", {}, "弹出框内容"),
    });
  });
};

// 添加GeoJson图层
// 其他格式的矢量文件必须先转化为geojson
const setGeoJson = () => {
  if (AMap && map) {
    axios.get("/chongqing.json").then((res) => {
      let geojson = new AMap.GeoJSON({
        geoJSON: res.data,
        getPolygon: (geojson, lnglats) => {
          let polygon = new AMap.Polygon({
            path: lnglats,
            strokeColor: "white", // 边框颜色
            fillColor: "red", // 填充颜色
          });
          polygon.on("click", (e) => {
            console.log(e);
          });
          return polygon;
        },
      });
      map.add(geojson);
    });
  }
};

// 定位
const setLocation = () => {
  if (AMap && map) {
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
    map.addControl(geolocation);
    geolocation.on("complete", onComplete);
    geolocation.on("onError", onError);
    function onComplete(data) {
      // 定位成功后调用
      console.log(data);
    }
    function onError(data) {
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
      map: map,
    }); //构造地点查询类
    autoComplete.on("select", select); //注册监听，当选中某条记录时会触发
    function select(e) {
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
