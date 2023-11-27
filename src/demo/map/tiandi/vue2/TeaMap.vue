<template>
  <div style="position:relative;width: fit-content">
    <div id="container"></div>
    <div
        style="position: absolute;right: 50px;bottom: 50px;z-index: 999;padding: 10px 15px;background-color: black;opacity: .8">
      <div style="display: flex;flex-direction: column;">
        <el-checkbox v-model="geoJsonLayerShow" label="园区范围"/>
        <el-checkbox v-model="markerList1Show" label="标记点"/>
      </div>
    </div>
  </div>
</template>

<script>
let T = window.T
export default {
  data() {
    return {
      // todo 请在开发前更换天地图tk
      tk: "8fb666e56330487a8d902fbf6d1a4440",
      // 地图实例
      map: null,
      // 园区范围图层实例
      geoJsonLayer: null,
      geoJsonLayerShow: true,
      // 标记点实例数组1
      markerList1: [],
      markerList1Show: true,
      // 新图层记得在这里添加
    }
  },
  watch: {
    // 监听园区范围图层显示
    geoJsonLayerShow: {
      handler: function (e) {
        this.$nextTick(() => {
          if (e) {
            this.setGeoJson('/company.geojson')
          } else {
            this.removeOverlay(this.geoJsonLayer)
          }
        })
      },
      immediate: true
    },
    // 监听标记点图层显示
    markerList1Show: {
      handler: function (e) {
        this.$nextTick(() => {
          if (e) {
            this.markerList1 = this.setMarkerLayer([{lng: 120.0195, lat: 30.6783}, {
              lng: 120.0205,
              lat: 30.6793
            }, {lng: 120.0215, lat: 30.6803}], this.cusIcon())
          } else {
            this.removeOverlay(this.markerList1)
          }
        })
      },
      immediate: true
    }
  },
  mounted() {
    this.initMap()
  },
  methods: {
    /**
     * 初始化地图
     */
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
          "&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=" +
          `${this.tk}`
      );
      // 路网
      let roadNetLayer = new T.TileLayer("http://t4.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=" +
          `${this.tk}`
      );
      mapTD.addLayer(satelliteLayer);
      mapTD.addLayer(roadNetLayer);
      this.map = mapTD;
      this.setMapClick();
    },

    /**
     * 定位到用户当前位置
     * 注意：定位会导致setGeoJson()渲染出现bug，建议二者不要一起使用
     */
    setLocation() {
      let that = this;
      if (this.map) {
        let lo = new T.Geolocation();
        let fn = function (e) {
          that.map.centerAndZoom(e.lnglat, 15)
          // that.setMarker(e.lnglat.getLng(), e.lnglat.getLat())
        }
        lo.getCurrentPosition(fn);
      }
    },

    /**
     * 添加地图点击事件
     */
    setMapClick() {
      if (this.map) {
        this.map.addEventListener("click", (e) => {
          // alert(e.lnglat.getLng() + "," + e.lnglat.getLat());
          // this.setMarker(e.lnglat.getLng(), e.lnglat.getLat())
        });
      }
    },

    /**
     * 添加标记点图层
     * @param list 标记点坐标数组
     * @param icon 自定义标记
     * @return *[] 标记点实例数组
     */
    setMarkerLayer(list, icon) {
      if (this.map) {
        let markerList = []
        for (let item of list) {
          let marker = this.setMarker(item.lng, item.lat, icon)
          markerList.push(marker)
        }
        return markerList
      }
    },

    /**
     * 设置标记点
     * @param lng 经度 （必填）
     * @param lat 纬度 （必填）
     * @param icon 自定义标记 （选填）
     * @returns marker 标记点实例
     */
    setMarker(lng, lat, icon = null) {
      if (this.map) {
        let marker = icon ? new T.Marker(new T.LngLat(lng, lat), {icon: icon}) : new T.Marker(new T.LngLat(lng, lat));
        this.setMarkerClick(marker)
        this.map.addOverLay(marker);
        return marker
      }
    },

    /**
     * 自定义标记点icon
     * @param url icon图片地址
     * @param width icon宽度
     * @param height icon高度
     * @return {AMap.Icon} icon实例
     */
    cusIcon(url = "http://api.tianditu.gov.cn/img/map/markerA.png", width = 19, height = 27) {
      return new T.Icon({
        iconUrl: url,
        iconSize: new T.Point(width, height),
        iconAnchor: new T.Point(width / 2, height)
      })
    },

    /**
     * 标记点添加点击事件
     * @param marker 标记点实例
     */
    setMarkerClick(marker) {
      //移除标注的点击事件，防止多次注册
      marker.removeEventListener("click", markerClick);
      //注册标注的点击事件
      marker.addEventListener("click", markerClick);

      function markerClick(e) {
        alert(e.lnglat.getLng() + "," + e.lnglat.getLat());
      }
    },

    /**
     * 添加geojson图层
     * 注意：其他格式的矢量文件必须先转化为geojson
     * @param geoJson geoJson的文件路径
     * @return layer 图层实例
     */
    setGeoJson(geoJson) {
      let that = this;
      if (that.map) {
        that.geoJsonLayer = null;
        d3.json(geoJson, function (data) {
          let overlay = new T.D3Overlay(
              (sel, transform) => {
                let upd = sel.selectAll('path.geojson').data(data.features);
                upd.enter()
                    .append('path')
                    .attr("class", "geojson")
                    .attr('stroke', 'white')
                    .attr('fill', 'red')
                    .attr('fill-opacity', '0.5')
              },
              (sel, transform) => {
                sel.selectAll('path.geojson').each(
                    function (d, i) {
                      d3.select(this).attr('d', transform.pathFromGeojson)
                    }
                )
              }
          );
          that.map.addOverLay(overlay);
          that.geoJsonLayer = overlay;
          overlay.bringToBack();
        })
      }
    },

    /**
     * 清除覆盖物
     * @param overlay 覆盖物实例/数组
     */
    removeOverlay(overlay) {
      if (overlay && this.map) {
        if (Array.isArray(overlay)) {
          for (let ov of overlay) {
            ov.onRemove(this.map);
          }
          overlay = []
        } else {
          overlay.onRemove(this.map);
        }
      }
    },

    /**
     * 清除所有覆盖物
     */
    clearOverlay() {
      if (this.map) {
        // todo 移除覆盖物请在此处清除或重置data的变量
        this.map.clearOverLays();
      }
    },


  }
}
</script>

<style scoped>
#container {
  height: 1000px;
  width: 1000px;
}

.el-checkbox {
  color: white !important;
  margin-right: 0 !important;
}
</style>
