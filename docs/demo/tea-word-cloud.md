# d3词云

<div style="margin: 10px 0">
  <el-tag type="danger">提示</el-tag> 非组件，请安装相应依赖后，直接复制粘贴代码并调整修改部分代码使用
</div>

```vue
<template>
  <div id="container"></div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
  let words = [];
  for (let i = 1; i <= 100; i++) {
    words.push({ text: i, size: 50 });
  }

  let layout = d3.layout
    .cloud()
    .size([500, 500])
    .words(words)
    .padding(2)
    .rotate(function () {
      return ~~(Math.random() * 2) * -90;
    })
    .font("Impact")
    .fontSize(function (d: any) {
      return d.size;
    })
    .on("end", draw);

  function draw(words: []) {
    d3.select("#container")
      .append("svg")
      .attr("width", layout.size()[0])
      .attr("height", layout.size()[1])
      .append("g")
      .attr(
        "transform",
        "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")",
      )
      .selectAll("text")
      .data(words)
      .enter()
      .append("text")
      .style("font-size", function (d: any) {
        return d.size + "px";
      })
      .style("font-family", "Impact")
      .style("fill", function (d: any) {
        return d.color;
      })
      .attr("text-anchor", "middle")
      .attr("transform", function (d: any) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function (d: any) {
        return d.text;
      });
  }

  // 绘制词云
  layout.start();
});
</script>

<style scoped></style>
```
