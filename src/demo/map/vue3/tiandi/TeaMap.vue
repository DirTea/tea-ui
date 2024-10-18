<template>
  <!--  <input id="input" placeholder="请输入地址搜索" />-->
  <div id="container">
    <TeaMapController
      :list="[
        { title: '图层示例1', onShow: onShow1 },
        { title: '图层示例2', onShow: onShow2 },
      ]"
      :map="map"
    ></TeaMapController>
  </div>
</template>

<script setup lang="ts">
import { TeaDialog } from "../../../../components/dialog/vue3/TeaDialog.ts";
import { h, onMounted, ref } from "vue";
import TeaMapController from "./TeaMapController.vue";

let T = (window as any).T;
let map = ref();

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

// poi搜索地点 todo 搜索报错
const setSearch = () => {
  const input = document.getElementById("input") as HTMLInputElement;
  function search() {
    // 创建搜索对象
    let localSearch = new T.LocalSearch(map.value, {
      pageCapacity: 10, //每页显示的数量
      onSearchComplete: function (res: any) {
        console.log(res);
      },
    });
    localSearch.search(input.value);
  }
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
