<template>
  <div id="myChart"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  methods: {
    init() {
      let option = {
        // 提示框
        tooltip: {
          trigger: "item",
        },
        // 图例
        legend: {
          top: "5%",
          left: "center",
          formatter: (name) => {
            let data = option.series[0].data;
            let tarValue = 0;
            let sumValue = 0;
            for (let i = 0; i < data.length; i++) {
              if (data[i].name === name) {
                tarValue = data[i].value;
              }
              sumValue += data[i].value;
            }
            return `${name} ${((tarValue / 1500) * 100).toFixed(1)}%  ${tarValue}`;
          },
        },
        series: [
          {
            name: "环状图示例",
            // 指定类型饼图
            type: "pie",
            // 内外径
            radius: ["40%", "70%"],
            // 防止标签重叠
            avoidLabelOverlap: false,
            // 图形样式
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            // 中间文字
            label: {
              show: true,
              position: "center",
              color: "#4c4a4a",
              formatter: "{active|总计}" + "\n" + "{total|100}",
              rich: {
                total: {
                  fontFamily: "微软雅黑",
                  fontSize: 30,
                  fontWeight: "bold",
                  color: "#454c5c",
                },
                active: {
                  fontFamily: "微软雅黑",
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#6c7a89",
                  lineHeight: 30,
                },
              },
            },
            // 数据源
            data: [
              { value: 100, name: "数据1", itemStyle: { color: "blue" } },
              { value: 200, name: "数据2", itemStyle: { color: "red" } },
              { value: 300, name: "数据3", itemStyle: { color: "green" } },
              { value: 400, name: "数据4", itemStyle: { color: "yellow" } },
              { value: 500, name: "数据5", itemStyle: { color: "gray" } },
            ],
          },
        ],
      };
      let myChart = echarts.init(document.getElementById("myChart"));
      myChart.setOption(option);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style scoped>
#myChart {
  height: 300px;
}
</style>
