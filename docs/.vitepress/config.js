import { defineConfig } from "vitepress";
import {
  demoblockPlugin,
  demoblockVitePlugin,
} from "vitepress-theme-demoblock";

export default defineConfig({
  title: "TEA-UI",
  description: "TeaUI组件库",
  head: [["link", { rel: "icon", href: "/icon.svg" }]],
  themeConfig: {
    logo: "/icon.svg",
    sidebar: [
      {
        text: "指南",
        items: [{ text: "快速开始", link: "/home" }],
      },
      {
        text: "组件(Components)",
        items: [
          { text: "按钮", link: "/components/tea-button" },
          { text: "计数", link: "/components/tea-count-to" },
          { text: "弹出框", link: "/components/tea-dialog" },
          { text: "翻转", link: "/components/tea-flip" },
          { text: "文件预览", link: "/components/tea-preview" },
          { text: "排行榜", link: "/components/tea-rank" },
          { text: "标签云", link: "/components/tea-tag-cloud" },
          { text: "高德天气", link: "/components/tea-weather" },
        ],
      },
      {
        text: "非组件(Demo)",
        items: [
          { text: "echarts环状图", link: "/demo/tea-chart-doughnut" },
          { text: "echarts极坐标图", link: "/demo/tea-chart-polar" },
          { text: "element-plus可拖拽表格", link: "/demo/tea-draggable-table" },
          { text: "高德地图", link: "/demo/tea-map-gaode" },
          { text: "天地图", link: "/demo/tea-map-tiandi" },
          { text: "d3词云", link: "/demo/tea-word-cloud" },
        ],
      },
    ],
  },
  markdown: {
    config: (md) => {
      md.use(demoblockPlugin);
    },
  },
  vite: {
    plugins: [demoblockVitePlugin()],
  },
});
