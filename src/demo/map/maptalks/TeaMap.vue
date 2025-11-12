<template>
  <div style="position: relative; height: fit-content; width: fit-content">
    <div id="container"></div>
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

<script setup>
import { ref, onMounted, h } from "vue";
import "maptalks/dist/maptalks.css";
import {
  Map,
  TileLayer,
  VectorLayer,
  Marker,
  LineString,
  GeoJSON,
} from "maptalks-gl";
import axios from "axios";
import TeaMapController from "./TeaMapController.vue";
import { TeaDialog } from "@/components/dialog/TeaDialog.js";

const map = ref(null);

// 初始化地图
const initMap = () => {
  const tk = "";
  map.value = new Map("container", {
    center: [120.07259, 30.31415],
    zoom: 16,
    pitch: 45,
    baseLayer: new TileLayer("base", {
      urlTemplate:
        `http://t{s}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles` +
        `&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${tk}`,
      subdomains: ["1", "2", "3", "4", "5"],
      attribution: "<span>&copy 版权归浙江省环境科技有限公司所有</span>",
    }),
    layers: [
      new TileLayer("annotation", {
        urlTemplate: `http://t{s}.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=${tk}`,
        subdomains: ["1", "2", "3", "4", "5"],
      }),
    ],
  });
  // 在此处使用后面的set方法
};

// 添加图层控件
const onShow1 = () => {
  return new Promise((resolve) => {
    // 此处可以调用后端接口获取点位
    const layer = setVectorLayer([
      setMarker({
        lng: 120.07259,
        lat: 30.31415,
      }),
    ]);
    resolve(layer);
  });
};
const onShow2 = () => {
  return new Promise((resolve) => {
    // 此处可以调用后端接口获取点位
    const layer = setVectorLayer([
      setMarker({
        lng: 120.07259,
        lat: 30.31415,
      }),
    ]);
    resolve(layer);
  });
};

// 创建矢量图层
const setVectorLayer = (geometries, options) => {
  if (map.value) {
    const uniqueId =
      new Date().getTime().toString(36) +
      Math.random().toString(36).substring(2, 9);
    return new VectorLayer(uniqueId, geometries, {
      enableAltitude: true,
      drawAltitude: {
        lineWidth: 2,
        lineColor: "red",
      },
      ...options,
    });
  }
};

// 创建一个带高度的标记点
const setMarker = (e, params = {}) => {
  if (map.value && e) {
    const marker = new Marker([e.lng, e.lat], {
      properties: { altitude: 50 },
      ...params,
    });
    setDialog(marker);
    return marker;
  } else {
    console.log("地图未加载或传参错误");
  }
};

// 创建一条带高度的折线
const setLine = (e, params = {}) => {
  if (map.value && e) {
    return new LineString(e, {
      properties: { altitude: 50 },
      ...params,
    });
  } else {
    console.log("地图未加载或传参错误");
  }
};

// marker添加信息窗体
const setInfoWindow = (marker) => {
  let content = ["这里是信息弹窗"];
  // 创建 infoWindow 实例
  marker.setInfoWindow({
    title: "标题",
    content: content.join("<br>"),
  });
  // 打开信息窗体
  marker.openInfoWindow();
};

// marker添加弹出框
const setDialog = (marker) => {
  marker.on("click", () => {
    TeaDialog({
      content: h("div", {}, "弹出框内容"),
    });
  });
};

// 添加GeoJson图层
// 其他格式的矢量文件必须先转化为geojson
const setGeoJson = () => {
  if (map.value) {
    axios.get("./chongqing.json").then((res) => {
      map.value?.addLayer(setVectorLayer(GeoJSON.toGeometry(res.data)));
    });
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
:deep(.maptalks-attribution > span > a) {
  display: none !important;
}
</style>
