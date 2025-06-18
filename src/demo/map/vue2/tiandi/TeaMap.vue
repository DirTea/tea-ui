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

<script>
import { TeaDialog } from "@/components/dialog/vue2/TeaDialog.js";
import { h } from "vue";
import TeaMapController from "./TeaMapController.vue";

let T = window.T;
export default {
  components: { TeaMapController },
  data() {
    return {
      map: undefined,
    };
  },
  methods: {
    // 初始化地图
    initMap() {
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
      this.map = mapTD;
      // 在此处使用后面的set方法
    },
    // 添加地图控件
    setMapController() {
      //添加比例尺控件
      this.map.addControl(new T.Control.Zoom());
      // 其他控件参考http://lbs.tianditu.gov.cn/api/js4.0/examples.html
    },
    // 添加图层控件
    onShow1() {
      return new Promise((resolve) => {
        // 此处可以调用后端接口获取点位
        let layer = [];
        const marker = this.setMarker({
          lng: 120.631155,
          lat: 28.736966,
        });
        layer.push(marker);
        resolve(layer);
      });
    },
    onShow2() {
      return new Promise((resolve) => {
        // 此处可以调用后端接口获取点位
        let layer = [];
        const marker = this.setMarker({
          lng: 121.631155,
          lat: 29.736966,
        });
        layer.push(marker);
        resolve(layer);
      });
    },
    // 创建单个标记点
    setMarker(e) {
      if (this.map && e) {
        const position = new T.LngLat(e.lng, e.lat); // Marker经纬度
        let marker = new T.Marker(position);
        this.setDialog(marker);
        this.setInfoWindow(position);
        return marker;
      } else {
        console.log("地图未加载或传参错误");
      }
    },
    // marker添加信息窗体
    setInfoWindow(position) {
      let content = ["这里是信息弹窗"];
      // 创建 infoWindow 实例
      let infoWindow = new T.InfoWindow(content.join("<br>"), {
        offset: new T.Point(0, -30),
      });
      infoWindow.setLngLat(position);
      // 打开信息窗体
      // this.map.addOverLay(infoWindow);
    },
    // marker添加弹出框
    setDialog(marker) {
      marker.addEventListener("click", () => {
        TeaDialog({
          props: {},
          content: h("div", {}, "弹出框内容"),
        });
      });
    },
    // 添加GeoJson图层
    // 其他格式的矢量文件必须先转化为geojson
    setGeoJson() {
      let that = this;
      if (T && that.map) {
        d3.json("/chongqing.json", function (data) {
          let overlay = new T.D3Overlay(
            (sel, transform) => {
              let upd = sel.selectAll("path.geojson").data(data.features);
              upd
                .enter()
                .append("path")
                .attr("class", "geojson")
                .attr("stroke", "white")
                .attr("fill", "red")
                .attr("fill-opacity", "0.5");
            },
            (sel, transform) => {
              sel.selectAll("path.geojson").each(function (d, i) {
                d3.select(this).attr("d", transform.pathFromGeojson);
              });
            },
          );
          that.map.addOverLay(overlay);
          overlay.bringToBack();
        });
      }
    },
    // 定位
    // 注意：定位会导致setGeoJson()渲染出现bug，建议二者不要一起使用
    setLocation() {
      let that = this;
      if (this.map) {
        let lo = new T.Geolocation();
        let fn = function (e) {
          that.map.centerAndZoom(e.lnglat, 15);
        };
        lo.getCurrentPosition(fn);
      }
    },
    // poi搜索地点 todo 需要配合下拉框
    setSearch() {
      const input = document.getElementById("input");
      const search = () => {
        // 创建搜索对象
        let localSearch = new T.LocalSearch(this.map, {
          pageCapacity: 10, //每页显示的数量
          onSearchComplete: function (res) {
            console.log(res);
          },
        });
        localSearch.search(input.value);
      };
      function debounce(fn, wait) {
        let timer = null;
        return function () {
          if (timer !== null) {
            clearTimeout(timer);
          }
          timer = setTimeout(fn, wait);
        };
      }
      input.addEventListener("input", debounce(search, 1000));
    },
  },
  mounted() {
    this.initMap();
  },
};
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
</style>
