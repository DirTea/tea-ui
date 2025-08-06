<template>
  <div class="vp-raw">
    <div style="margin-bottom: 10px">
      <el-input
        v-model="input1"
        style="width: 240px"
        placeholder="请输入安全密钥securityJsCode"
      />
      <el-input
        v-model="input2"
        style="width: 240px"
        placeholder="请输入Web端开发者Key"
      />
      <el-button type="primary" @click="initMap">开始预览</el-button>
    </div>
    <input id="input" placeholder="请输入地址搜索" v-show="map" />
    <div id="container" v-show="map">
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
  </div>
</template>

<script setup lang="ts">
import "@amap/amap-jsapi-types";
import axios from "axios";
import { h, onMounted, ref } from "vue";
import { TeaDialog } from "../../src/components/dialog/TeaDialog.js";
import TeaMapController from "../../src/demo/map/gaode/TeaMapController.vue";

let AMapLoader: any;
onMounted(() => {
  import("@amap/amap-jsapi-loader").then((module) => {
    AMapLoader = module;
  });
});

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
      props: {
        appendTo: "#container",
      },
      content: h(
        "div",
        {
          style:
            "width: 200px;height: 200px;background: white;display: flex;justify-content: center;align-items: center;",
        },
        "弹出框内容",
      ),
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
      console.log(geojson);
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
