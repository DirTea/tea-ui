import { defineConfig } from "vitepress";
import {
  demoblockPlugin,
  demoblockVitePlugin,
} from "vitepress-theme-demoblock";

export default defineConfig({
  title: "TEA-UI",
  description: "TeaUI组件库",
  themeConfig: {
    sidebar: [
      {
        text: "指南",
        items: [{ text: "快速开始", link: "/home" }],
      },
      {
        text: "组件",
        items: [
          { text: "按钮", link: "/components/tea-button" },
          { text: "计数", link: "/components/tea-count-to" },
          { text: "弹出框", link: "/components/tea-dialog" },
          { text: "翻转", link: "/components/tea-flip" },
          { text: "文件预览", link: "/components/tea-preview" },
          { text: "排行榜", link: "/components/tea-rank" },
          { text: "标签云", link: "/components/tea-tag-cloud" },
        ],
      },
      {
        text: "非组件",
        items: [
          { text: "echarts环状图", link: "/demo/tea-chart-doughnut" },
          { text: "echarts极坐标图", link: "/demo/tea-chart-polar" },
          { text: "element-plus可拖拽表格", link: "/demo/tea-draggable-table" },
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
