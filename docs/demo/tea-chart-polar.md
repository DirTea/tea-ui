# echarts极坐标图

<div style="margin: 10px 0">
  <el-tag type="danger">提示</el-tag> 非组件，请安装相应依赖后，直接复制粘贴代码并调整修改部分代码使用
</div>

## 示例

<TeaChartPolar></TeaChartPolar>

<script setup lang="ts">
import TeaChartPolar from "../../src/demo/echarts/TeaChartPolar.vue"
</script>

## 源代码

```vue
<template>
  <div id="myChart"></div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { onMounted } from "vue";

const init = () => {
  let option = {
    tooltip: {},
    polar: {
      radius: [10, "100%"],
    },
    angleAxis: {
      max: 10,
      startAngle: 90,
      clockwise: false,
      show: false,
    },
    radiusAxis: {
      type: "category",
      data: ["1", "2", "3"],
      inverse: true,
      show: false,
    },
    series: {
      type: "bar",
      data: [7, 1, 1, 1],
      coordinateSystem: "polar",
      barWidth: 6,
      showBackground: true,
      backgroundStyle: {
        color: "rgba(35, 64, 91, 0.1)",
      },
      itemStyle: {
        borderRadius: [20, 20, 20, 20],
        color: function (params: any) {
          let colorList = [
            new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#A9ADFF" },
              { offset: 1, color: "#7B81FF" },
            ]),
            new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#25D5E7" },
              { offset: 1, color: "#0E92B7" },
            ]),
            new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#E8DB36" },
              { offset: 1, color: "#C0A91A" },
            ]),
          ];
          return colorList[params.dataIndex];
        },
      },
    },
  };
  const myChart = echarts.init(document.getElementById("myChart"));
  myChart.setOption(option);
  window.addEventListener("resize", () => {
    myChart.resize();
  });
};

onMounted(() => {
  init();
});
</script>

<style scoped>
#myChart {
  height: 300px;
  width: 800px;
}
</style>
```
