<template>
  <input id='input' placeholder="请输入地址搜索"/>
  <div id="container"></div>
</template>

<script setup lang="ts">
import "@amap/amap-jsapi-types";
import AMapLoader from "@amap/amap-jsapi-loader";
import axios from "axios";
import toGeoJSON from "@mapbox/togeojson/togeojson.js"

let AMap: any
let map: any
const initMap = () => {
  AMapLoader.load({
    "key": "673b9d195b95c28017d6799f850fa6ba", // 申请好的Web端开发者Key，首次调用 load 时必填
    "version": "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    "plugins": ['AMap.Geolocation', 'AMap.MapType', 'AMap.PlaceSearch', 'AMap.AutoComplete', 'AMap.GeoJSON'], // 需要使用的的插件列表
  }).then(Amap => {
    AMap = Amap
    // 添加默认图层
    map = new AMap.Map('container', {
      layers: [
        new AMap.TileLayer.Satellite(), // 卫星图
        new AMap.TileLayer.RoadNet() // 路网
      ],
      zoom: 5,
    });
    // 添加切换图层控件
    map.addControl(new AMap.MapType());
  });
}
initMap();

// 定位
const location = () => {
  if(AMap && map) {
    AMap.plugin('AMap.Geolocation', function() {
      let geolocation = new AMap.Geolocation({
        // 是否使用高精度定位，默认：true
        enableHighAccuracy: true,
        // 设置定位超时时间，默认：无穷大
        timeout: 5000,
        //  定位按钮的排放位置,  RB表示右下
        buttonPosition: 'RB',
        // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
        buttonOffset: new AMap.Pixel(20, 80),
        //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        zoomToAccuracy: true,
        panToLocation:true,
        showMarker: false,
        showCircle: false,
      })
      // 添加定位按钮控件
      map.addControl(geolocation)
      geolocation.on('complete', onComplete)
      geolocation.on('onError', onError)
      function onComplete(data: any) {
        // 定位成功后调用
        console.log(data)
      }
      function onError(data: any) {
        // 定位出错
        console.log(data)
      }
    })
  } else  {
    console.log("AMap未加载")
  }
}

// 添加单个标记点
const setMarker = (e: any) => {
  if(AMap && e) {
    const position = new AMap.LngLat(e.lng, e.lat); // Marker经纬度
    const marker = new AMap.Marker({
      position: position
    });
    map.add(marker);
    // setInfoWindow(position)
  } else  {
    console.log("AMap未加载或传参错误")
  }
}

// 添加信息窗体
const setInfoWindow = (position: any) => {
  let content = [
    "这里是信息弹窗",
  ];
  // 创建 infoWindow 实例
  let infoWindow = new AMap.InfoWindow({
    autoMove: true,
    offset: new AMap.Pixel(0, -30),
    content: content.join("<br>")  //传入 dom 对象，或者 html 字符串
  });
  // 打开信息窗体
  infoWindow.open(map,position);
}

// 搜索地点 todo 还是会不显示垃圾高德
const searchIn = () => {
  if(AMap) {
    AMap.plugin(['AMap.PlaceSearch','AMap.AutoComplete'], function(){
      let auto = new AMap.AutoComplete({
        input: "input"
      });
      let placeSearch = new AMap.PlaceSearch({
        map: map
      });  //构造地点查询类
      auto.on("select", select); //注册监听，当选中某条记录时会触发
      function select(e: any) {
        placeSearch.setCity(e.poi.adcode);
        placeSearch.search(e.poi.name);  //关键字查询查询
      }
    })
  }
}

// 添加geojson图层
// 其他格式的矢量文件必须先转化为geojson
const setGeoJson = () => {
  if(AMap && map) {
    axios.get("/chongqing.json").then((res: any) => {
      let geojson = new AMap.GeoJSON({
        geoJSON: res.data,
        getPolygon: (geojson, lnglats) => {
          return new AMap.Polygon({
            path: lnglats,
            strokeColor: 'white', // 边框颜色
            fillColor: 'red' // 填充颜色
          });
        },
      });
      map.add(geojson)
    });
  }
}
</script>

<style scoped>
#container {
  height: 500px;
  width: 500px;
}

/* 去除高德水印 */
:deep(.amap-logo) {
  display: none!important;
}
:deep(.amap-copyright) {
  display: none!important;
}
</style>

