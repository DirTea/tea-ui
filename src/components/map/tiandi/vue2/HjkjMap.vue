<template>
  <div id="container"></div>
</template>

<script>
let T = window.T
export default {
  components: {

  },
  props: {

  },
  data() {
    return {
      map: null,
      geoJsonLayer: null,
    }
  },
  created() {

  },
  mounted() {
    this.initMap()
    this.setGeoJson('/company.geojson')
    this.setMarker(120.019501352, 30.678373914)
  },
  methods: {
    // 初始化地图
    initMap() {
      this.map = null
      let mapTD = new T.Map('container');
      mapTD.centerAndZoom(new T.LngLat(120.019501352, 30.678373914), 15); // 传参中心点经纬度，以及放大程度
      mapTD.setMinZoom(3); // 设置最小变动层级
      mapTD.setMaxZoom(20); // 设置最大变动层级
      mapTD.enableDrag(); // 启用拖拽
      mapTD.enableScrollWheelZoom(); // 启用滚轮放大缩小
      // 卫星图
      let satelliteLayer = new T.TileLayer("http://t0.tianditu.gov.cn/img_w/wmts?" +
          "SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles" +
          "&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=8fb666e56330487a8d902fbf6d1a4440");
      // 路网
      let roadNetLayer = new T.TileLayer('http://t4.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=8fb666e56330487a8d902fbf6d1a4440')
      mapTD.addLayer(satelliteLayer);
      mapTD.addLayer(roadNetLayer);
      this.map = mapTD;
    },

    // 添加单个标记点
    setMarker(lng, lat) {
      let marker = new T.Marker(new T.LngLat(lng, lat));
      this.setMarkerClick(marker)
      this.map.addOverLay(marker);
    },

    // 标记点添加点击事件
    setMarkerClick(marker) {
      //移除标注的点击事件，防止多次注册
      marker.removeEventListener("click", markerClick);
      //注册标注的点击事件
      marker.addEventListener("click", markerClick);
      function markerClick(e) {
        alert(e.lnglat.getLng() + "," + e.lnglat.getLat());
      }
    },

    // 添加geojson图层
    // 其他格式的矢量文件必须先转化为geojson
    setGeoJson(geoJson) {
      let that = this;
      d3.json(geoJson, function (data) {
        let overlay = new T.D3Overlay(
          (sel, transform)=> {
            let upd = sel.selectAll('path.geojson').data(data.features);
            upd.enter()
              .append('path')
              .attr("class", "geojson")
              .attr('stroke', 'white')
              .attr('fill', 'red')
              .attr('fill-opacity', '0.5')
          },
          (sel, transform)=> {
            sel.selectAll('path.geojson').each(
              function (d, i) {
                d3.select(this).attr('d', transform.pathFromGeojson)
              }
            )
          }
        );
        that.map.addOverLay(overlay)
        that.geoJsonLayer = overlay
        overlay.bringToBack();
      });
    },

    // 显示覆盖物
    showOverlay(overlay) {
      try {
        overlay.show()
      } catch (e) {
        overlay.onAdd(this.map);
      }
    },
    // 隐藏覆盖物
    hideOverlay(overlay) {
      try {
        overlay.hide()
      } catch (e) {
        overlay.onRemove(this.map);
      }
    },
    // 清除所有覆盖物
    clearOverlay() {
      this.map.clearOverLays()
    }

  }
}
</script>

<style scoped>
#container {
  height: 1000px;
  width: 1000px;
}
</style>
